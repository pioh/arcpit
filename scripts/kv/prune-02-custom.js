import * as path from "node:path";
import { readdir, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { stableStringifyJson } from "../dota/kv1.js";

async function* walk(dir) {
    const ents = await readdir(dir, { withFileTypes: true });
    for (const ent of ents) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) yield* walk(full);
        else if (ent.isFile()) yield full;
    }
}

async function isEmptyDir(dir) {
    try {
        const ents = await readdir(dir, { withFileTypes: true });
        return ents.length === 0;
    } catch {
        return true;
    }
}

async function deleteDirIfEmpty(dir) {
    if (!existsSync(dir)) return false;
    if (!(await isEmptyDir(dir))) return false;
    await rm(dir, { recursive: true, force: true });
    return true;
}

async function readJsonStable(p) {
    const raw = await readFile(p, "utf8");
    return stableStringifyJson(JSON.parse(raw));
}

async function main() {
    const args = process.argv.slice(2);
    const kvRootArg = args.find((a) => a.startsWith("--kv="))?.slice("--kv=".length);
    const kvRoot = path.resolve(process.cwd(), kvRootArg ?? "kv");

    let deletedFiles = 0;
    let keptFiles = 0;
    let deletedDirs = 0;

    // Only prune inside */02_custom/**.json by comparing to matching */01_dota/**.json
    const targets = [];
    for await (const f of walk(kvRoot)) {
        if (!f.endsWith(".json")) continue;
        const rel = f.replaceAll("\\", "/");
        if (!rel.includes("/02_custom/")) continue;
        targets.push(f);
    }

    for (const f of targets) {
        const base = f.replace(`${path.sep}02_custom${path.sep}`, `${path.sep}01_dota${path.sep}`);
        if (!existsSync(base)) {
            keptFiles++;
            continue;
        }
        try {
            const a = await readJsonStable(f);
            const b = await readJsonStable(base);
            if (a === b) {
                await rm(f, { force: true });
                deletedFiles++;
            } else {
                keptFiles++;
            }
        } catch {
            // invalid JSON -> keep (user could be editing transformers output manually, though not recommended)
            keptFiles++;
        }
    }

    // Remove empty 02_custom dirs (deepest-first)
    const dirs = new Set();
    for await (const f of walk(kvRoot)) {
        const parts = f.split(path.sep);
        const idx = parts.lastIndexOf("02_custom");
        if (idx >= 0) dirs.add(parts.slice(0, idx + 1).join(path.sep));
    }
    const dirList = Array.from(dirs).sort((a, b) => b.length - a.length);
    for (const d of dirList) {
        if (await deleteDirIfEmpty(d)) deletedDirs++;
    }

    console.log(`✓ prune 02_custom: deletedFiles=${deletedFiles} keptFiles=${keptFiles} deletedDirs=${deletedDirs}`);
}

await main();


