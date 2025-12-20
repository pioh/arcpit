import * as path from "node:path";
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { getDotaPath } from "../utils.js";
import { extractBaseDirectives, parseKV1, stableStringifyJson } from "./kv1.js";

const require = createRequire(import.meta.url);
const VPK = require("vpk");

function toPosix(p) {
    return p.replaceAll("\\", "/");
}

function toNative(p) {
    return p.replaceAll("/", path.sep);
}

function stripBom(s) {
    return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

async function ensureDirForFile(filePath) {
    await mkdir(path.dirname(filePath), { recursive: true });
}

function pickRootSection(obj, candidates) {
    for (const k of candidates) {
        const v = obj?.[k];
        if (v && typeof v === "object") return { rootKey: k, root: v };
    }
    // fallback: if file has exactly 1 top-level key -> use it
    const keys = obj && typeof obj === "object" ? Object.keys(obj) : [];
    if (keys.length === 1 && obj[keys[0]] && typeof obj[keys[0]] === "object") {
        return { rootKey: keys[0], root: obj[keys[0]] };
    }
    return { rootKey: undefined, root: obj };
}

function uniqueSorted(arr) {
    return Array.from(new Set(arr)).sort();
}

async function fileExists(p) {
    try {
        await stat(p);
        return true;
    } catch {
        return false;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const outDirArg = args.find((a) => a.startsWith("--out="))?.slice("--out=".length);
    const outDir = path.resolve(process.cwd(), outDirArg ?? "dota_dump");

    const dotaPath = await getDotaPath();
    if (!dotaPath) {
        console.error("❌ Dota 2 не найдена через Steam. Убедитесь, что установлен клиент 'dota 2 beta'.");
        process.exit(1);
    }

    // Dota 2 Reborn: <install>/game/dota/pak01_dir.vpk
    const pakCandidates = [
        path.join(dotaPath, "game", "dota", "pak01_dir.vpk"),
        path.join(dotaPath, "game", "dota", "pak01_dir.vpk".toLowerCase()),
    ];
    const pakPath = pakCandidates.find(existsSync);
    if (!pakPath) {
        console.error("❌ Не найден pak01_dir.vpk. Ожидали путь вроде:");
        for (const c of pakCandidates) console.error(`   - ${c}`);
        process.exit(1);
    }

    console.log(`✓ Dota: ${dotaPath}`);
    console.log(`✓ VPK:  ${pakPath}`);
    console.log(`✓ OUT:  ${outDir}`);

    const vpk = new VPK(pakPath);
    vpk.load();

    const wanted = [
        // core KV
        "scripts/npc/npc_heroes.txt",
        "scripts/npc/npc_abilities.txt",
        // items live in one of these depending on branch/build
        "scripts/npc/items.txt",
        "scripts/npc/npc_items.txt",

        // localization (descriptions)
        "resource/localization/dota_english.txt",
        "resource/localization/dota_russian.txt",
    ];

    // Auto-discover relevant KV shards inside VPK (Dota splits heroes/abilities across many files)
    const extra = [];
    for (const f of vpk.files ?? []) {
        if (typeof f !== "string") continue;
        const fp = toPosix(f);
        if (!fp.endsWith(".txt")) continue;
        if (fp.startsWith("scripts/npc/heroes/")) extra.push(fp);
        else if (fp.startsWith("scripts/npc/abilities/")) extra.push(fp);
        else if (fp.startsWith("scripts/npc/items/")) extra.push(fp);
    }

    const extracted = new Set();
    const queue = [...wanted];
    for (const f of extra) queue.push(f);

    function tryGetFile(vpkPath) {
        const buf = vpk.getFile(vpkPath);
        return buf ?? null;
    }

    while (queue.length > 0) {
        const vpkPath = toPosix(queue.shift());
        if (extracted.has(vpkPath)) continue;

        const buf = tryGetFile(vpkPath);
        if (!buf) {
            // quietly skip optional files
            extracted.add(vpkPath);
            continue;
        }

        const rawText = stripBom(buf.toString("utf8"));
        const outPath = path.join(outDir, "raw", toNative(vpkPath));
        await ensureDirForFile(outPath);
        await writeFile(outPath, rawText, "utf8");
        extracted.add(vpkPath);

        // enqueue #base includes
        for (const base of extractBaseDirectives(rawText)) {
            // base paths in Dota are usually posix already
            if (!extracted.has(base)) queue.push(base);
        }
    }

    // Parse & build indexes from whatever was actually extracted (raw exists on disk)
    const rawBaseDir = path.join(outDir, "raw");

    async function readRawIfExists(vpkRel) {
        const p = path.join(rawBaseDir, toNative(vpkRel));
        if (!(await fileExists(p))) return undefined;
        return stripBom(await readFile(p, "utf8"));
    }

    async function collectTransitiveFiles(startFiles) {
        const files = [];
        const seen = new Set();
        const q = [...startFiles];
        while (q.length > 0) {
            const f = toPosix(q.shift());
            if (!f || seen.has(f)) continue;
            seen.add(f);
            const t = await readRawIfExists(f);
            if (!t) continue;
            files.push(f);
            for (const b of extractBaseDirectives(t)) {
                if (!seen.has(b)) q.push(b);
            }
        }
        return files;
    }

    async function parseUnionMany(startFiles, rootCandidates) {
        const files = await collectTransitiveFiles(startFiles);
        const merged = {};
        let rootKey;
        for (const f of files) {
            const t = await readRawIfExists(f);
            if (!t) continue;
            const parsed = parseKV1(t);
            const picked = pickRootSection(parsed, rootCandidates);
            if (!rootKey && picked.rootKey) rootKey = picked.rootKey;
            const root = picked.root;
            if (!root || typeof root !== "object") continue;
            for (const k of Object.keys(root)) merged[k] = root[k];
        }
        return { rootKey, root: merged, files };
    }

    const heroes = await parseUnionMany(
        ["scripts/npc/npc_heroes.txt", ...extra.filter((f) => f.startsWith("scripts/npc/heroes/"))],
        ["DOTAHeroes", "npc_heroes"],
    );

    const abilities = await parseUnionMany(
        ["scripts/npc/npc_abilities.txt", ...extra.filter((f) => f.startsWith("scripts/npc/abilities/")), ...extra.filter((f) => f.startsWith("scripts/npc/heroes/"))],
        ["DOTAAbilities", "npc_abilities"],
    );

    const itemsStart = (await fileExists(path.join(rawBaseDir, toNative("scripts/npc/npc_items.txt"))))
        ? "scripts/npc/npc_items.txt"
        : "scripts/npc/items.txt";
    const items = await parseUnionMany(
        [itemsStart, ...extra.filter((f) => f.startsWith("scripts/npc/items/"))],
        ["DOTAItems", "items", "npc_items"],
    );

    const heroNames = uniqueSorted(Object.keys(heroes.root).filter((k) => k.startsWith("npc_dota_hero_")));
    const abilityNames = uniqueSorted(
        Object.keys(abilities.root).filter((k) => {
            if (k === "Version" || k === "ability_base") return false;
            // by default exclude talents from the "abilities pool" index
            if (k.startsWith("special_bonus_")) return false;
            return true;
        }),
    );
    const itemNames = uniqueSorted(
        Object.keys(items.root).filter((k) => {
            if (k === "Version" || k === "item_base") return false;
            return k.startsWith("item_");
        }),
    );

    const parsedDir = path.join(outDir, "parsed");
    await mkdir(parsedDir, { recursive: true });

    await writeFile(path.join(parsedDir, "npc_heroes.json"), stableStringifyJson({ [heroes.rootKey ?? "DOTAHeroes"]: heroes.root }), "utf8");
    await writeFile(path.join(parsedDir, "npc_abilities.json"), stableStringifyJson({ [abilities.rootKey ?? "DOTAAbilities"]: abilities.root }), "utf8");
    await writeFile(path.join(parsedDir, "npc_items.json"), stableStringifyJson({ [items.rootKey ?? "DOTAItems"]: items.root }), "utf8");

    const index = {
        heroes: heroNames,
        abilities: abilityNames,
        items: itemNames,
        // for debugging / reproducibility (still deterministic if unchanged)
        sources: {
            heroes: heroes.files.sort(),
            abilities: abilities.files.sort(),
            items: items.files.sort(),
        },
    };
    await writeFile(path.join(outDir, "index.json"), stableStringifyJson(index), "utf8");

    console.log(`✓ Extracted raw: ${path.join(outDir, "raw")}`);
    console.log(`✓ Parsed JSON:   ${path.join(outDir, "parsed")}`);
    console.log(`✓ Index:        ${path.join(outDir, "index.json")}`);
    console.log(`✓ Counts: heroes=${heroNames.length} abilities=${abilityNames.length} items=${itemNames.length}`);
}

await main();


