import { findSteamAppByName, SteamNotFoundError } from "@moddota/find-steam-app";
import packageJson from "../package.json" with { type: "json" };
import * as path from "node:path";
import { mkdir, rm, readdir, readFile, writeFile } from "node:fs/promises";

export function getAddonName() {
    if (!/^[a-z][\d_a-z]+$/.test(packageJson.name)) {
        throw new Error(
            "Addon name may consist only of lowercase characters, digits, and underscores " +
                "and should start with a letter. Edit `name` field in `package.json` file.",
        );
    }

    return packageJson.name;
}

export async function getDotaPath() {
    try {
        return await findSteamAppByName("dota 2 beta");
    } catch (error) {
        if (!(error instanceof SteamNotFoundError)) {
            throw error;
        }
    }
}

/**
 * Полностью очищает директорию и пересоздаёт её.
 * Нужна, чтобы при билде/вотче не накапливался мусор от удалённых/переименованных файлов.
 */
export async function ensureEmptyDir(dirPath) {
    await rm(dirPath, { recursive: true, force: true });
    await mkdir(dirPath, { recursive: true });
}

export function getBuildOutputPaths() {
    // scripts/* лежит в корне проекта: <root>/scripts
    const root = path.resolve(import.meta.dir, "..");
    return {
        panoramaOutDir: path.resolve(root, "content", "panorama", "scripts", "custom_game"),
        vscriptsOutDir: path.resolve(root, "game", "scripts", "vscripts"),
        vscriptsSrcDir: path.resolve(root, "src", "vscripts"),
    };
}

async function readJsonIfExists(filePath) {
    try {
        const raw = await readFile(filePath, "utf-8");
        return JSON.parse(raw);
    } catch (e) {
        return undefined;
    }
}

async function writeJson(filePath, data) {
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function* walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
            yield* walk(full);
        } else if (ent.isFile()) {
            yield full;
        }
    }
}

function toPosix(p) {
    return p.replaceAll("\\", "/");
}

async function collectTstlOutputsManifest(vscriptsSrcDir) {
    // Манифест считаем из TS-исходников: каждый .ts -> .lua (в той же относительной структуре).
    // Дополнительно: lualib_bundle.lua и source maps (если они включены).
    const relPaths = new Set();

    for await (const file of walk(vscriptsSrcDir)) {
        if (!file.endsWith(".ts")) continue;
        if (file.endsWith(".d.ts")) continue;

        const rel = path.relative(vscriptsSrcDir, file);
        const luaRel = rel.replaceAll("\\", "/").replace(/\.ts$/, ".lua");
        relPaths.add(luaRel);
        relPaths.add(`${luaRel}.map`);
    }

    relPaths.add("lualib_bundle.lua");
    relPaths.add("lualib_bundle.lua.map");

    return Array.from(relPaths).sort();
}

async function deleteFilesFromManifest(outDir, relList) {
    const base = toPosix(path.resolve(outDir));
    for (const rel of relList) {
        const full = path.resolve(outDir, rel);
        // защита: не выходим за пределы outDir
        const fullPosix = toPosix(full);
        if (!(fullPosix === base || fullPosix.startsWith(base + "/"))) {
            continue;
        }
        await rm(full, { force: true });
    }
}

async function cleanVscriptsOutputs() {
    const { vscriptsOutDir, vscriptsSrcDir } = getBuildOutputPaths();
    await mkdir(vscriptsOutDir, { recursive: true });

    const manifestPath = path.join(vscriptsOutDir, ".tstl-manifest.json");
    const prev = await readJsonIfExists(manifestPath);
    if (prev && Array.isArray(prev.files)) {
        await deleteFilesFromManifest(vscriptsOutDir, prev.files);
    } else {
        // Фоллбек: если манифеста нет, НЕ чистим весь vscripts (там могут быть ручные файлы типа gamemode.txt).
        // Удаляем только lualib_bundle (часто генерится) и карты.
        await deleteFilesFromManifest(vscriptsOutDir, ["lualib_bundle.lua", "lualib_bundle.lua.map"]);
    }

    const nextFiles = await collectTstlOutputsManifest(vscriptsSrcDir);
    await writeJson(manifestPath, { files: nextFiles });
}

export async function cleanBuildOutputs() {
    const { panoramaOutDir, vscriptsOutDir } = getBuildOutputPaths();
    // Panorama outDir считаем полностью генерируемым → можно чистить целиком.
    await ensureEmptyDir(panoramaOutDir);
    // Vscripts outDir может содержать ручные файлы (например gamemode.txt) → чистим по манифесту.
    await cleanVscriptsOutputs();
}
