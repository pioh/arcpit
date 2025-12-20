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
    const tmpDump = path.join(tmpRoot, "dota_dump");

    // 1) Dump from VPK -> .tmp/dota_dump
    await ensureEmptyDir(tmpRoot);
    run("bun", [path.join("scripts", "dota", "dump.js"), `--out=${tmpDump}`]);

    // 2) Split -> kv/**/01_dota (does NOT wipe kv/, keeps your 03_custom + TS)
    run("bun", [path.join("scripts", "kv", "split-dump-to-kv.js"), `--dump=${tmpDump}`, `--out=${path.join("kv")}`]);
}

await main();


