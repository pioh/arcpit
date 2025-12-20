import * as path from "node:path";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { deepClone, stableStringifyJson } from "../dota/kv1.js";

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

async function loadTransformers(dir) {
    if (!existsSync(dir)) return [];
    const ents = await readdir(dir, { withFileTypes: true });
    const files = ents
        .filter((e) => e.isFile() && (e.name.endsWith(".js") || e.name.endsWith(".mjs")))
        .map((e) => path.join(dir, e.name))
        .sort();

    const out = [];
    for (const f of files) {
        const mod = await import(pathToFileURL(f).href);
        const fn = mod?.transform ?? mod?.default;
        if (typeof fn !== "function") continue;
        out.push({ name: path.basename(f), fn });
    }
    return out;
}

async function readJson(p) {
    return JSON.parse(await readFile(p, "utf8"));
}

async function writeJson(p, data) {
    await mkdir(path.dirname(p), { recursive: true });
    await writeFile(p, stableStringifyJson(data), "utf8");
}

function classify(rel) {
    const r = toPosix(rel);
    if (r === "index.json") return { kind: "index", name: "index" };
    if (r.startsWith("heroes/") && r.endsWith(".json") && r.includes("/abilities/")) {
        return { kind: "hero_ability", name: path.basename(r, ".json") };
    }
    if (r.startsWith("heroes/") && r.endsWith(".json") && r.split("/").length === 3) {
        // heroes/<npc_dota_hero_x>/<npc_dota_hero_x>.json
        return { kind: "hero", name: path.basename(r, ".json") };
    }
    if (r.startsWith("unassigned/abilities/") && r.endsWith(".json")) return { kind: "ability", name: path.basename(r, ".json") };
    if (r.startsWith("items/") && r.endsWith(".json")) return { kind: "item", name: path.basename(r, ".json") };
    if (r.startsWith("localization/") && r.endsWith(".txt")) return { kind: "localization_raw", name: path.basename(r) };
    return { kind: "other", name: path.basename(r) };
}

async function main() {
    const args = process.argv.slice(2);
    const inArg = args.find((a) => a.startsWith("--in="))?.slice("--in=".length);
    const outArg = args.find((a) => a.startsWith("--out="))?.slice("--out=".length);
    const transformersArg = args.find((a) => a.startsWith("--transformers="))?.slice("--transformers=".length);

    const inDir = path.resolve(process.cwd(), inArg ?? path.join("kv", "dota"));
    const outDir = path.resolve(process.cwd(), outArg ?? path.join(".tmp", "kv_custom1"));
    const transformersDir = path.resolve(process.cwd(), transformersArg ?? path.join("kv", "custom2", "transformers"));

    if (!existsSync(inDir)) {
        console.error(`❌ Не найден входной слой: ${inDir}`);
        process.exit(1);
    }

    const transformers = await loadTransformers(transformersDir);
    console.log(`✓ transformers: ${transformers.map((t) => t.name).join(", ") || "(none)"}`);

    await ensureEmptyDir(outDir);

    for await (const file of walk(inDir)) {
        const rel = path.relative(inDir, file);
        const outPath = path.join(outDir, rel);

        // raw localization: copy as-is
        if (file.endsWith(".txt")) {
            await mkdir(path.dirname(outPath), { recursive: true });
            await writeFile(outPath, await readFile(file), "utf8");
            continue;
        }

        if (!file.endsWith(".json")) {
            continue;
        }

        const data0 = await readJson(file);
        const meta = classify(rel);

        let data = deepClone(data0);
        for (const t of transformers) {
            const res = await t.fn({
                kind: meta.kind,
                name: meta.name,
                rel: toPosix(rel),
                data,
                layer: { inDir, outDir },
            });
            if (res !== undefined) data = res;
        }

        await writeJson(outPath, data);
    }

    console.log(`✓ kv/custom1 written: ${outDir}`);
}

await main();


