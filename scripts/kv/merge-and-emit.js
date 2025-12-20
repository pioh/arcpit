import * as path from "node:path";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { deepMerge, stableStringifyJson, stringifyKV1 } from "../dota/kv1.js";

async function ensureEmptyDir(p) {
    await rm(p, { recursive: true, force: true });
    await mkdir(p, { recursive: true });
}

async function* walk(dir) {
    const ents = await readdir(dir, { withFileTypes: true });
    for (const ent of ents) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) yield* walk(full);
        else if (ent.isFile()) yield full;
    }
}

function toPosix(p) {
    return p.replaceAll("\\", "/");
}

async function readJson(p) {
    return JSON.parse(await readFile(p, "utf8"));
}

async function writeJson(p, data) {
    await mkdir(path.dirname(p), { recursive: true });
    await writeFile(p, stableStringifyJson(data), "utf8");
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

function clearHeroAbilitiesForOutput(heroObj) {
    const out = { ...(heroObj ?? {}) };
    // remove any existing AbilityN
    for (const k of Object.keys(out)) {
        if (/^Ability\d+$/.test(k)) delete out[k];
    }
    // explicitly set empty for first 24 slots to try to force "no base abilities"
    for (let i = 1; i <= 24; i++) out[`Ability${i}`] = "";
    // also remove talent start to avoid auto-adding talents
    out["AbilityTalentStart"] = "0";
    return out;
}

async function main() {
    const args = process.argv.slice(2);
    const baseArg = args.find((a) => a.startsWith("--base="))?.slice("--base=".length);
    const layer1Arg = args.find((a) => a.startsWith("--layer1="))?.slice("--layer1=".length);
    const layer2Arg = args.find((a) => a.startsWith("--layer2="))?.slice("--layer2=".length);
    const outArg = args.find((a) => a.startsWith("--out="))?.slice("--out=".length);
    const addonOutArg = args.find((a) => a.startsWith("--addonOut="))?.slice("--addonOut=".length);

    // New structure: per-entity folders with 01_dota / 02_custom / 03_custom
    const kvRoot = path.resolve(process.cwd(), baseArg ?? "kv");
    const outDir = path.resolve(process.cwd(), outArg ?? path.join(".tmp", "kv_final"));
    const addonOutDir = path.resolve(process.cwd(), addonOutArg ?? path.join("game", "scripts", "npc"));

    if (!existsSync(kvRoot)) {
        console.error(`❌ Не найден kv root: ${kvRoot}`);
        process.exit(1);
    }

    await ensureEmptyDir(outDir);
    await mkdir(addonOutDir, { recursive: true });

    // Collect final sets by merging 02_custom + 03_custom per entity.
    // We also write a small "final" index for pools.
    const heroes = [];
    const abilitiesSet = new Set();
    const items = [];

    const outHeroesRoot = {};
    const outAbilitiesRoot = {};
    const outItemsRoot = {};

    async function readMaybe(p) {
        return existsSync(p) ? await readJson(p) : undefined;
    }

    // Heroes
    const heroesRoot = path.join(kvRoot, "heroes");
    if (existsSync(heroesRoot)) {
        const heroDirs = (await readdir(heroesRoot, { withFileTypes: true })).filter((e) => e.isDirectory());
        for (const h of heroDirs) {
            const heroShort = h.name;
            const npcName = `npc_dota_hero_${heroShort}`;
            const entRoot = path.join(heroesRoot, heroShort);

            const npc02Dir = path.join(entRoot, "02_custom", "npc");
            const npc01Dir = path.join(entRoot, "01_dota", "npc");
            const npc03Dir = path.join(entRoot, "03_custom", "npc");

            // prefer 02_custom, fallback to 01_dota
            const baseNpcPath = existsSync(path.join(npc02Dir, `${npcName}.json`))
                ? path.join(npc02Dir, `${npcName}.json`)
                : path.join(npc01Dir, `${npcName}.json`);
            if (!existsSync(baseNpcPath)) continue;

            const baseNpc = await readJson(baseNpcPath);
            const patchNpc = await readMaybe(path.join(npc03Dir, `${npcName}.json`));
            const finalNpc = patchNpc ? deepMerge(baseNpc, patchNpc) : baseNpc;
            outHeroesRoot[npcName] = clearHeroAbilitiesForOutput(finalNpc);
            heroes.push(npcName);

            // abilities under hero
            const ab02Dir = path.join(entRoot, "02_custom", "abilities");
            const ab01Dir = path.join(entRoot, "01_dota", "abilities");
            const ab03Dir = path.join(entRoot, "03_custom", "abilities");

            const srcDir = existsSync(ab02Dir) ? ab02Dir : ab01Dir;
            if (existsSync(srcDir)) {
                const abFiles = (await readdir(srcDir, { withFileTypes: true })).filter((e) => e.isFile() && e.name.endsWith(".json"));
                for (const f of abFiles) {
                    const abName = f.name.replace(/\.json$/, "");
                    const baseAb = await readJson(path.join(srcDir, f.name));
                    const patchAb = await readMaybe(path.join(ab03Dir, f.name));
                    const finalAb = patchAb ? deepMerge(baseAb, patchAb) : baseAb;
                    outAbilitiesRoot[abName] = finalAb;
                    abilitiesSet.add(abName);
                }
            }
        }
    }

    // Unassigned abilities
    const unassignedRoot = path.join(kvRoot, "unassigned");
    if (existsSync(unassignedRoot)) {
        const dirs = (await readdir(unassignedRoot, { withFileTypes: true })).filter((e) => e.isDirectory());
        for (const d of dirs) {
            const abName = d.name;
            const entRoot = path.join(unassignedRoot, abName);
            const a02 = path.join(entRoot, "02_custom", "ability", `${abName}.json`);
            const a01 = path.join(entRoot, "01_dota", "ability", `${abName}.json`);
            const a03 = path.join(entRoot, "03_custom", "ability", `${abName}.json`);
            const basePath = existsSync(a02) ? a02 : a01;
            if (!existsSync(basePath)) continue;
            const base = await readJson(basePath);
            const patch = await readMaybe(a03);
            const fin = patch ? deepMerge(base, patch) : base;
            outAbilitiesRoot[abName] = fin;
            abilitiesSet.add(abName);
        }
    }

    // Items
    const itemsRoot = path.join(kvRoot, "items");
    if (existsSync(itemsRoot)) {
        const dirs = (await readdir(itemsRoot, { withFileTypes: true })).filter((e) => e.isDirectory());
        for (const d of dirs) {
            const itName = d.name;
            const entRoot = path.join(itemsRoot, itName);
            const i02 = path.join(entRoot, "02_custom", "item", `${itName}.json`);
            const i01 = path.join(entRoot, "01_dota", "item", `${itName}.json`);
            const i03 = path.join(entRoot, "03_custom", "item", `${itName}.json`);
            const basePath = existsSync(i02) ? i02 : i01;
            if (!existsSync(basePath)) continue;
            const base = await readJson(basePath);
            const patch = await readMaybe(i03);
            const fin = patch ? deepMerge(base, patch) : base;
            outItemsRoot[itName] = fin;
            items.push(itName);
        }
    }

    const abilities = Array.from(abilitiesSet).sort();
    heroes.sort();
    items.sort();

    await writeJson(path.join(outDir, "index.json"), { heroes, abilities, items });

    await writeFile(
        path.join(addonOutDir, "npc_heroes_custom.txt"),
        `// AUTO-GENERATED by bun run generate (DO NOT EDIT)\n` + stringifyKV1({ DOTAHeroes: outHeroesRoot }, { sortKeys: true }),
        "utf8",
    );
    await writeFile(
        path.join(addonOutDir, "npc_abilities_custom.txt"),
        `// AUTO-GENERATED by bun run generate (DO NOT EDIT)\n` + stringifyKV1({ DOTAAbilities: outAbilitiesRoot }, { sortKeys: true }),
        "utf8",
    );
    await writeFile(
        path.join(addonOutDir, "npc_items_custom.txt"),
        `// AUTO-GENERATED by bun run generate (DO NOT EDIT)\n` + stringifyKV1({ DOTAItems: outItemsRoot }, { sortKeys: true }),
        "utf8",
    );

    console.log(`✓ kv/final written: ${outDir}`);
    console.log(`✓ addon kv written: ${addonOutDir}`);
    console.log(`✓ counts: heroes=${Object.keys(outHeroesRoot).length} abilities=${Object.keys(outAbilitiesRoot).length} items=${Object.keys(outItemsRoot).length}`);
}

await main();


