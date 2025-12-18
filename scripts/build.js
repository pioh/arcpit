import { spawn } from "bun";
import { cleanBuildOutputs } from "./utils.js";

// Важно: чистим outDir'ы перед билдом, чтобы не оставались старые файлы.
await cleanBuildOutputs();

// Параллельный запуск обоих билдов
const panorama = spawn(["bun", "run", "build:panorama"], {
    stdout: "inherit",
    stderr: "inherit",
});

const vscripts = spawn(["bun", "run", "build:vscripts"], {
    stdout: "inherit",
    stderr: "inherit",
});

// Ожидаем завершения обоих процессов
const [panoramaResult, vscriptsResult] = await Promise.all([
    panorama.exited,
    vscripts.exited,
]);

// Выходим с ошибкой, если хотя бы один из процессов завершился с ошибкой
if (panoramaResult !== 0 || vscriptsResult !== 0) {
    process.exit(1);
}

