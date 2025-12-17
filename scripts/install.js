import { existsSync, lstatSync, realpathSync, renameSync, symlinkSync } from "fs";
import { join, resolve } from "path";
import { getAddonName, getDotaPath } from "./utils.js";

try {
    const dotaPath = await getDotaPath();
    if (dotaPath === undefined) {
        console.log("No Dota 2 installation found. Addon linking is skipped.");
        process.exit(0);
    }

    for (const directoryName of ["game", "content"]) {
        const sourcePath = resolve(import.meta.dir, "..", directoryName);
        if (!existsSync(sourcePath)) {
            throw new Error(`Could not find '${sourcePath}'`);
        }

        const targetRoot = join(dotaPath, directoryName, "dota_addons");
        if (!existsSync(targetRoot)) {
            throw new Error(`Could not find '${targetRoot}'`);
        }

        const targetPath = join(dotaPath, directoryName, "dota_addons", getAddonName());
        if (existsSync(targetPath)) {
            const isCorrect = lstatSync(sourcePath).isSymbolicLink() && realpathSync(sourcePath) === targetPath;
            if (isCorrect) {
                console.log(`Skipping '${sourcePath}' '${targetPath}' since it is already linked`);
                continue;
            } else {
                throw new Error(`'${targetPath}' is already linked to another directory`);
            }
        }

        renameSync(sourcePath, targetPath);
        symlinkSync(targetPath, sourcePath, "junction");
        console.log(`Linked ${sourcePath} <==> ${targetPath}`);
    }
} catch (error) {
    console.error(error);
    process.exit(1);
}
