import * as path from "node:path";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { stableStringifyJson } from "../dota/kv1.js";
import { heroAbilityJsonPath, heroFolder, heroNpcJsonPath, heroShortFromNpc, itemFolder, itemJsonPath, layerDir, unassignedAbilityJsonPath, unassignedFolder } from "./paths.js";

function toPosix(p) {
    return p.replaceAll("\\", "/");
}

async function ensureEmptyDir(p) {
    await rm(p, { recursive: true, force: true });
    await mkdir(p, { recursive: true });
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
    return { rootKey: candidates[0], root: obj ?? {} };
}

function getHeroAbilityList(heroObj) {
    const out = [];
    for (const [k, v] of Object.entries(heroObj ?? {})) {
        if (!/^Ability\d+$/.test(k)) continue;
        if (typeof v !== "string") continue;
        const name = v.trim();
        if (!name) continue;
        // ignore talents in hero file (they start at AbilityTalentStart usually)
        if (name.startsWith("special_bonus_")) continue;
        out.push(name);
    }
    return Array.from(new Set(out)).sort();
}

function getDraftAbilityList(heroObj) {
    const draft = heroObj?.AbilityDraftAbilities;
    if (!draft || typeof draft !== "object") return [];
    const out = [];
    for (const [k, v] of Object.entries(draft)) {
        if (!/^Ability\d+$/.test(k)) continue;
        if (typeof v !== "string") continue;
        const name = v.trim();
        if (!name) continue;
        if (name.startsWith("special_bonus_")) continue;
        out.push(name);
    }
    return Array.from(new Set(out)).sort();
}

const HIDDEN_OR_UNWANTED_ABILITIES = new Set([
    "generic_hidden",
    "consumable_hidden",
    "attribute_bonus",
    "dota_empty_ability",
    "dota_base_ability",
    "default_attack",
]);

function lcp(a, b) {
    const n = Math.min(a.length, b.length);
    let i = 0;
    while (i < n && a[i] === b[i]) i++;
    return a.slice(0, i);
}

function inferAbilityPrefix(heroShort, heroAbilities) {
    // Prefer direct match to hero short
    const direct = `${heroShort}_`;
    if (heroAbilities.some((a) => a.startsWith(direct))) return heroShort;

    if (heroAbilities.length <= 0) return heroShort;
    let common = heroAbilities[0];
    for (let i = 1; i < heroAbilities.length; i++) common = lcp(common, heroAbilities[i]);
    const idx = common.lastIndexOf("_");
    if (idx <= 0) return heroShort;
    return common.slice(0, idx); // without trailing underscore
}

async function writeJson(filePath, data) {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, stableStringifyJson(data), "utf8");
}

async function main() {
    const args = process.argv.slice(2);
    const dumpDirArg = args.find((a) => a.startsWith("--dump="))?.slice("--dump=".length);
    const outDirArg = args.find((a) => a.startsWith("--out="))?.slice("--out=".length);

    const dumpDir = path.resolve(process.cwd(), dumpDirArg ?? path.join(".tmp", "dota_dump"));
    const outDir = path.resolve(process.cwd(), outDirArg ?? "kv");

    const heroesJsonPath = path.join(dumpDir, "parsed", "npc_heroes.json");
    const abilitiesJsonPath = path.join(dumpDir, "parsed", "npc_abilities.json");
    const itemsJsonPath = path.join(dumpDir, "parsed", "npc_items.json");

    if (!existsSync(heroesJsonPath) || !existsSync(abilitiesJsonPath) || !existsSync(itemsJsonPath)) {
        console.error("❌ Не найден parsed-дамп. Сначала запустите дамп VPK:");
        console.error("   bun run dump:dota -- --out=.kv_tmp/dota_dump");
        process.exit(1);
    }

    const heroesParsed = JSON.parse(await readFile(heroesJsonPath, "utf8"));
    const abilitiesParsed = JSON.parse(await readFile(abilitiesJsonPath, "utf8"));
    const itemsParsed = JSON.parse(await readFile(itemsJsonPath, "utf8"));

    const heroes = pickRootSection(heroesParsed, ["DOTAHeroes", "npc_heroes"]).root ?? {};
    const abilities = pickRootSection(abilitiesParsed, ["DOTAAbilities", "npc_abilities"]).root ?? {};
    const items = pickRootSection(itemsParsed, ["DOTAItems", "items", "npc_items"]).root ?? {};

    // We do NOT wipe the whole kv/ directory (it contains your 03_custom + TS).
    // We only regenerate per-entity 01_dota and also clear 02_custom (generated).
    await mkdir(outDir, { recursive: true });
    await mkdir(path.join(outDir, "heroes"), { recursive: true });
    await mkdir(path.join(outDir, "items"), { recursive: true });
    await mkdir(path.join(outDir, "unassigned"), { recursive: true });
    await mkdir(path.join(outDir, "localization"), { recursive: true });

    const heroNames = Object.keys(heroes)
        .filter((k) => k.startsWith("npc_dota_hero_") && k !== "npc_dota_hero_base")
        .sort();
    const abilityNames = Object.keys(abilities)
        .filter((k) => k && k !== "Version" && k !== "ability_base" && !k.startsWith("special_bonus_"))
        .filter((k) => !["dota_base_ability", "default_attack", "attribute_bonus", "dota_empty_ability", "generic_hidden", "consumable_hidden"].includes(k))
        .sort();
    const itemNames = Object.keys(items)
        .filter((k) => k && k !== "Version" && k !== "item_base" && k.startsWith("item_"))
        .sort();

    // Items -> kv/items/<item>/01_dota/item/<item>.json
    for (const itemName of itemNames) {
        const ent = itemFolder(outDir, itemName);
        await rm(layerDir(ent, "01_dota"), { recursive: true, force: true });
        await rm(layerDir(ent, "02_custom"), { recursive: true, force: true });
        await mkdir(layerDir(ent, "01_dota"), { recursive: true });
        await writeJson(itemJsonPath(ent, "01_dota", itemName), items[itemName]);
        await mkdir(path.join(ent, "03_custom"), { recursive: true });
        await mkdir(path.join(ent, "customizers"), { recursive: true });
    }

    // Per-hero grouping -> kv/heroes/<short>/01_dota/{npc,abilities}
    const usedAbilities = new Set();
    const heroPrefixMap = new Map(); // prefix -> heroName
    const heroPrefixes = new Map(); // heroName -> prefix
    for (const heroName of heroNames) {
        const heroObj = heroes[heroName];
        const heroShort = heroShortFromNpc(heroName);
        const ent = heroFolder(outDir, heroShort);
        await rm(layerDir(ent, "01_dota"), { recursive: true, force: true });
        await rm(layerDir(ent, "02_custom"), { recursive: true, force: true });
        await mkdir(path.join(ent, "01_dota", "npc"), { recursive: true });
        await mkdir(path.join(ent, "01_dota", "abilities"), { recursive: true });
        await mkdir(path.join(ent, "03_custom"), { recursive: true });
        await mkdir(path.join(ent, "modifiers"), { recursive: true });
        await mkdir(path.join(ent, "customizers"), { recursive: true });

        await writeJson(heroNpcJsonPath(ent, "01_dota", heroName), heroObj);

        const heroAbilities = Array.from(
            new Set([...getHeroAbilityList(heroObj), ...getDraftAbilityList(heroObj)]),
        )
            .filter((a) => !HIDDEN_OR_UNWANTED_ABILITIES.has(a))
            .sort();

        const prefix = inferAbilityPrefix(heroShort, heroAbilities);
        heroPrefixes.set(heroName, prefix);
        if (prefix && !heroPrefixMap.has(prefix)) heroPrefixMap.set(prefix, heroName);

        for (const ab of heroAbilities) {
            const abObj = abilities[ab];
            if (!abObj) continue;
            await writeJson(heroAbilityJsonPath(ent, "01_dota", ab), abObj);
            usedAbilities.add(ab);
        }
    }

    // Assign remaining abilities by inferred prefix (hero-prefixed abilities that weren't referenced in hero lists)
    const multiOwner = [];
    const mismatch = [];
    for (const ab of abilityNames) {
        if (usedAbilities.has(ab)) continue;

        // find matching prefixes (longest match wins)
        const owners = [];
        for (const [prefix, heroName] of heroPrefixMap.entries()) {
            if (ab.startsWith(prefix + "_")) owners.push({ prefix, heroName });
        }
        if (owners.length > 1) {
            owners.sort((a, b) => b.prefix.length - a.prefix.length);
            // if still multiple (same length), log
            const topLen = owners[0].prefix.length;
            const top = owners.filter((o) => o.prefix.length === topLen);
            if (top.length > 1) multiOwner.push({ ability: ab, owners: top.map((o) => o.heroName) });
            owners.splice(1); // keep best-effort first
        }

        const owner = owners[0]?.heroName;
        if (!owner) continue;

        const ownerShort = heroShortFromNpc(owner);
        const ent = heroFolder(outDir, ownerShort);
        const target = heroAbilityJsonPath(ent, "01_dota", ab);
        const srcObj = abilities[ab];
        if (!srcObj) continue;

        // If file already exists, ensure same content
        if (existsSync(target)) {
            try {
                const existing = JSON.parse(await readFile(target, "utf8"));
                if (stableStringifyJson(existing) !== stableStringifyJson(srcObj)) {
                    mismatch.push({ ability: ab, hero: owner });
                }
            } catch {
                mismatch.push({ ability: ab, hero: owner });
            }
        } else {
            await writeJson(target, srcObj);
        }
        usedAbilities.add(ab);
    }

    // Remaining abilities -> unassigned
    const unassigned = abilityNames.filter((a) => !usedAbilities.has(a));
    for (const ab of unassigned) {
        const abObj = abilities[ab];
        if (!abObj) continue;
        const ent = unassignedFolder(outDir, ab);
        await rm(layerDir(ent, "01_dota"), { recursive: true, force: true });
        await rm(layerDir(ent, "02_custom"), { recursive: true, force: true });
        await mkdir(path.join(ent, "01_dota", "ability"), { recursive: true });
        await mkdir(path.join(ent, "03_custom"), { recursive: true });
        await mkdir(path.join(ent, "modifiers"), { recursive: true });
        await mkdir(path.join(ent, "customizers"), { recursive: true });
        await writeJson(unassignedAbilityJsonPath(ent, "01_dota", ab), abObj);
    }

    // Global index (for pools)
    const allAbilities = Array.from(new Set([...usedAbilities, ...unassigned])).sort();
    await writeJson(path.join(outDir, "index.json"), {
        heroes: heroNames.map(heroShortFromNpc),
        abilities: allAbilities,
        items: itemNames,
        meta: {
            sourceDump: toPosix(path.relative(process.cwd(), dumpDir)),
            unassignedAbilities: unassigned.length,
            multiOwner: multiOwner.length,
            mismatches: mismatch.length,
        },
    });

    if (multiOwner.length > 0 || mismatch.length > 0) {
        await writeJson(path.join(outDir, "split-warnings.json"), { multiOwner, mismatch },);
    }

    // Localization raw copy from dump/raw
    const locCandidates = [
        "resource/localization/dota_english.txt",
        "resource/localization/dota_russian.txt",
    ];
    for (const loc of locCandidates) {
        const src = path.join(dumpDir, "raw", ...loc.split("/"));
        if (!existsSync(src)) continue;
        const dst = path.join(outDir, "localization", path.basename(loc));
        await writeFile(dst, await readFile(src, "utf8"), "utf8");
    }

    console.log(`✓ kv/01_dota written under: ${outDir}`);
    console.log(`✓ counts: heroes=${heroNames.length} abilities=${allAbilities.length} items=${itemNames.length} unassigned=${unassigned.length}`);
}

await main();


