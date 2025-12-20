import * as path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { deepClone, deepMerge, parseKV1, stableStringifyJson, stringifyKV1 } from "./kv1.js";

function stripBom(s) {
    return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

function pickRootSection(obj, candidates) {
    for (const k of candidates) {
        const v = obj?.[k];
        if (v && typeof v === "object") return { rootKey: k, root: v };
    }
    const keys = obj && typeof obj === "object" ? Object.keys(obj) : [];
    if (keys.length === 1 && obj[keys[0]] && typeof obj[keys[0]] === "object") {
        return { rootKey: keys[0], root: obj[keys[0]] };
    }
    return { rootKey: candidates[0], root: obj };
}

async function readJsonIfExists(p) {
    try {
        if (!existsSync(p)) return undefined;
        return JSON.parse(await readFile(p, "utf8"));
    } catch {
        return undefined;
    }
}

function applyOverrides(baseRoot, overrides) {
    const out = {};
    for (const [name, patch] of Object.entries(overrides ?? {})) {
        if (!patch || typeof patch !== "object") continue;

        const copyFrom = patch.__copyFrom;
        const patchNoMeta = { ...patch };
        delete patchNoMeta.__copyFrom;

        const base = copyFrom ? baseRoot?.[copyFrom] : baseRoot?.[name];
        const merged = base && typeof base === "object" ? deepMerge(deepClone(base), patchNoMeta) : deepClone(patchNoMeta);
        out[name] = merged;
    }
    return out;
}

async function main() {
    const args = process.argv.slice(2);
    const dumpDirArg = args.find((a) => a.startsWith("--dump="))?.slice("--dump=".length);
    const overridesDirArg = args.find((a) => a.startsWith("--overrides="))?.slice("--overrides=".length);
    const outDirArg = args.find((a) => a.startsWith("--out="))?.slice("--out=".length);

    const dumpDir = path.resolve(process.cwd(), dumpDirArg ?? "dota_dump");
    const overridesDir = path.resolve(process.cwd(), overridesDirArg ?? "dota_overrides");
    const outDir = path.resolve(process.cwd(), outDirArg ?? "dota_generated");

    // Prefer unioned JSON from dump (it already includes transitive #base files).
    const parsedAbilitiesJsonPath = path.join(dumpDir, "parsed", "npc_abilities.json");
    const parsedHeroesJsonPath = path.join(dumpDir, "parsed", "npc_heroes.json");

    const baseAbilitiesParsed = existsSync(parsedAbilitiesJsonPath)
        ? JSON.parse(await readFile(parsedAbilitiesJsonPath, "utf8"))
        : parseKV1(stripBom(await readFile(path.join(dumpDir, "raw", "scripts", "npc", "npc_abilities.txt"), "utf8")));
    const baseHeroesParsed = existsSync(parsedHeroesJsonPath)
        ? JSON.parse(await readFile(parsedHeroesJsonPath, "utf8"))
        : parseKV1(stripBom(await readFile(path.join(dumpDir, "raw", "scripts", "npc", "npc_heroes.txt"), "utf8")));

    const baseAbilities = pickRootSection(baseAbilitiesParsed, ["DOTAAbilities"]);
    const baseHeroes = pickRootSection(baseHeroesParsed, ["DOTAHeroes"]);

    const overridesAbilities = await readJsonIfExists(path.join(overridesDir, "abilities.json"));
    const overridesHeroes = await readJsonIfExists(path.join(overridesDir, "heroes.json"));
    const overridesItems = await readJsonIfExists(path.join(overridesDir, "items.json"));

    const customAbilitiesRoot = applyOverrides(baseAbilities.root, overridesAbilities);
    const customHeroesRoot = applyOverrides(baseHeroes.root, overridesHeroes);

    // items base file name differs; try both
    let baseItemsRoot = {};
    const parsedItemsJsonPath = path.join(dumpDir, "parsed", "npc_items.json");
    if (existsSync(parsedItemsJsonPath)) {
        const baseItemsParsed = JSON.parse(await readFile(parsedItemsJsonPath, "utf8"));
        baseItemsRoot = pickRootSection(baseItemsParsed, ["DOTAItems", "items"]).root ?? {};
    } else {
        const itemsCandidates = [
            path.join(dumpDir, "raw", "scripts", "npc", "npc_items.txt"),
            path.join(dumpDir, "raw", "scripts", "npc", "items.txt"),
        ];
        const itemsPath = itemsCandidates.find(existsSync);
        if (itemsPath) {
            const baseItemsText = stripBom(await readFile(itemsPath, "utf8"));
            const baseItemsParsed = parseKV1(baseItemsText);
            baseItemsRoot = pickRootSection(baseItemsParsed, ["DOTAItems", "items"]).root ?? {};
        }
    }
    const customItemsRoot = applyOverrides(baseItemsRoot, overridesItems);

    await mkdir(outDir, { recursive: true });

    // Generate KV custom files (minimal: only changed/added entries)
    const kvAbilities = stringifyKV1({ DOTAAbilities: customAbilitiesRoot }, { sortKeys: true });
    const kvHeroes = stringifyKV1({ DOTAHeroes: customHeroesRoot }, { sortKeys: true });
    const kvItems = stringifyKV1({ DOTAItems: customItemsRoot }, { sortKeys: true });

    const npcOutDir = path.join(outDir, "scripts", "npc");
    await mkdir(npcOutDir, { recursive: true });

    await writeFile(path.join(npcOutDir, "npc_abilities_custom.generated.txt"), kvAbilities, "utf8");
    await writeFile(path.join(npcOutDir, "npc_heroes_custom.generated.txt"), kvHeroes, "utf8");
    await writeFile(path.join(npcOutDir, "npc_items_custom.generated.txt"), kvItems, "utf8");

    // Also generate merged indexes for randomization (base + custom)
    const mergedIndex = {
        heroes: Array.from(new Set([
            ...Object.keys(baseHeroes.root ?? {}).filter((k) => k.startsWith("npc_dota_hero_")),
            ...Object.keys(customHeroesRoot),
        ])).sort(),
        abilities: Array.from(new Set([
            ...Object.keys(baseAbilities.root ?? {}).filter((k) => k && !k.startsWith("special_bonus_") && k !== "Version" && k !== "ability_base"),
            ...Object.keys(customAbilitiesRoot),
        ])).sort(),
        items: Array.from(new Set([
            ...Object.keys(baseItemsRoot ?? {}).filter((k) => k && k.startsWith("item_") && k !== "Version" && k !== "item_base"),
            ...Object.keys(customItemsRoot),
        ])).sort(),
    };

    await writeFile(path.join(outDir, "index.merged.json"), stableStringifyJson(mergedIndex), "utf8");

    console.log(`✓ OUT KV: ${path.join(outDir, "scripts", "npc")}`);
    console.log(`✓ OUT index: ${path.join(outDir, "index.merged.json")}`);
    console.log(`✓ Overrides dir: ${overridesDir}`);
    console.log(`✓ Counts: heroes=${mergedIndex.heroes.length} abilities=${mergedIndex.abilities.length} items=${mergedIndex.items.length}`);
}

await main();


