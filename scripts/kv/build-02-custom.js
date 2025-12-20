import * as path from "node:path";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { deepClone, stableStringifyJson } from "../dota/kv1.js";

async function ensureEmptyDir(p) {
    await rm(p, { recursive: true, force: true });
    await mkdir(p, { recursive: true });
}

async function readJson(p) {
    return JSON.parse(await readFile(p, "utf8"));
}

async function writeJson(p, data) {
    await mkdir(path.dirname(p), { recursive: true });
    await writeFile(p, stableStringifyJson(data), "utf8");
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

function toPosix(p) {
    return p.replaceAll("\\", "/");
}

function listJsonFiles(dir) {
    if (!existsSync(dir)) return [];
    return readdir(dir, { withFileTypes: true }).then((ents) =>
        ents.filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => path.join(dir, e.name)),
    );
}

async function main() {
    const args = process.argv.slice(2);
    const kvRootArg = args.find((a) => a.startsWith("--kv="))?.slice("--kv=".length);
    const transformersArg = args.find((a) => a.startsWith("--transformers="))?.slice("--transformers=".length);

    const kvRoot = path.resolve(process.cwd(), kvRootArg ?? "kv");
    const transformersDir = path.resolve(process.cwd(), transformersArg ?? path.join("kv", "transformers"));

    const transformers = await loadTransformers(transformersDir);
    console.log(`✓ transformers: ${transformers.map((t) => t.name).join(", ") || "(none)"}`);

    // Heroes
    const heroesRoot = path.join(kvRoot, "heroes");
    if (existsSync(heroesRoot)) {
        const heroDirs = (await readdir(heroesRoot, { withFileTypes: true })).filter((e) => e.isDirectory());
        for (const h of heroDirs) {
            const entRoot = path.join(heroesRoot, h.name);
            const inNpcDir = path.join(entRoot, "01_dota", "npc");
            const inAbDir = path.join(entRoot, "01_dota", "abilities");
            const outNpcDir = path.join(entRoot, "02_custom", "npc");
            const outAbDir = path.join(entRoot, "02_custom", "abilities");

            await ensureEmptyDir(path.join(entRoot, "02_custom"));
            await mkdir(outNpcDir, { recursive: true });
            await mkdir(outAbDir, { recursive: true });

            for (const f of await listJsonFiles(inNpcDir)) {
                const name = path.basename(f, ".json");
                let data = deepClone(await readJson(f));
                for (const t of transformers) {
                    const res = await t.fn({ kind: "hero", name: h.name, rel: toPosix(path.relative(kvRoot, f)), data });
                    if (res !== undefined) data = res;
                }
                await writeJson(path.join(outNpcDir, `${name}.json`), data);
            }
            for (const f of await listJsonFiles(inAbDir)) {
                const ab = path.basename(f, ".json");
                let data = deepClone(await readJson(f));
                for (const t of transformers) {
                    const res = await t.fn({ kind: "hero_ability", name: ab, rel: toPosix(path.relative(kvRoot, f)), data });
                    if (res !== undefined) data = res;
                }
                await writeJson(path.join(outAbDir, `${ab}.json`), data);
            }
        }
    }

    // Unassigned abilities
    const unassignedRoot = path.join(kvRoot, "unassigned");
    if (existsSync(unassignedRoot)) {
        const dirs = (await readdir(unassignedRoot, { withFileTypes: true })).filter((e) => e.isDirectory());
        for (const d of dirs) {
            const entRoot = path.join(unassignedRoot, d.name);
            const inDir = path.join(entRoot, "01_dota", "ability");
            const outDir = path.join(entRoot, "02_custom", "ability");
            await ensureEmptyDir(path.join(entRoot, "02_custom"));
            await mkdir(outDir, { recursive: true });
            for (const f of await listJsonFiles(inDir)) {
                const ab = path.basename(f, ".json");
                let data = deepClone(await readJson(f));
                for (const t of transformers) {
                    const res = await t.fn({ kind: "unassigned_ability", name: ab, rel: toPosix(path.relative(kvRoot, f)), data });
                    if (res !== undefined) data = res;
                }
                await writeJson(path.join(outDir, `${ab}.json`), data);
            }
        }
    }

    // Items
    const itemsRoot = path.join(kvRoot, "items");
    if (existsSync(itemsRoot)) {
        const dirs = (await readdir(itemsRoot, { withFileTypes: true })).filter((e) => e.isDirectory());
        for (const d of dirs) {
            const entRoot = path.join(itemsRoot, d.name);
            const inDir = path.join(entRoot, "01_dota", "item");
            const outDir = path.join(entRoot, "02_custom", "item");
            await ensureEmptyDir(path.join(entRoot, "02_custom"));
            await mkdir(outDir, { recursive: true });
            for (const f of await listJsonFiles(inDir)) {
                const it = path.basename(f, ".json");
                let data = deepClone(await readJson(f));
                for (const t of transformers) {
                    const res = await t.fn({ kind: "item", name: it, rel: toPosix(path.relative(kvRoot, f)), data });
                    if (res !== undefined) data = res;
                }
                await writeJson(path.join(outDir, `${it}.json`), data);
            }
        }
    }

    console.log("✓ kv/**/02_custom generated");
}

await main();


