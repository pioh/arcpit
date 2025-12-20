import { spawnSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import * as path from "node:path";

async function ensureEmptyDir(p) {
    await rm(p, { recursive: true, force: true });
    await mkdir(p, { recursive: true });
}

function run(cmd, args) {
    const exe = cmd === "bun" ? process.execPath : cmd;
    const res = spawnSync(exe, args, {
        stdio: "inherit",
        shell: false,
    });
    if (res.status !== 0) {
        throw new Error(`Command failed: ${cmd} ${args.join(" ")} (exit=${res.status})`);
    }
}

async function main() {
    const root = process.cwd();
    const tmpRoot = path.join(root, ".tmp");
    const tmpFinal = path.join(tmpRoot, "kv_final");

    // NB: generate НЕ обновляет 01_dota из клиента.
    // Для этого есть отдельная команда: bun run refresh:dota-kv
    //
    // 1) Build 02_custom from 01_dota (global transformers)
    run("bun", [path.join("scripts", "kv", "build-02-custom.js"), `--kv=${path.join("kv")}`, `--transformers=${path.join("kv", "transformers")}`]);

    // 2) Prune no-op generated files in 02_custom (if equals 01_dota, delete file/empty dir)
    run("bun", [path.join("scripts", "kv", "prune-02-custom.js"), `--kv=${path.join("kv")}`]);

    // 3) Merge 02_custom + 03_custom -> tmp final and emit addon KV files
    await ensureEmptyDir(tmpRoot);
    run("bun", [
        path.join("scripts", "kv", "merge-and-emit.js"),
        `--base=${path.join("kv")}`,
        `--out=${tmpFinal}`,
        `--addonOut=${path.join("game", "scripts", "npc")}`,
    ]);

    // 4) Sync kv/**/{modifiers,customizers} TS -> src/vscripts/kv_generated
    run("bun", [path.join("scripts", "kv", "sync-ts.js"), `--kv=${path.join("kv")}`, `--out=${path.join("src", "vscripts", "kv_generated")}`]);

    // 5) Generate TS pools from tmp final index.json
    run("bun", [path.join("scripts", "dota", "generate-pools.js"), `--in=${path.join(tmpFinal, "index.json")}`, `--outRoot=${path.join("src", "vscripts")}`]);
}

await main();


