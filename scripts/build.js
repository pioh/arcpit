import { spawn } from "bun";
import { cleanBuildOutputs } from "./utils.js";

// Генерируем kv/02_custom, финальные npc_*_custom.txt и *.generated.ts перед компиляцией TS -> Lua
const gen = spawn(["bun", "run", "generate"], {
    stdout: "inherit",
    stderr: "inherit",
});
const genCode = await gen.exited;
if (genCode !== 0) process.exit(1);

// Строгая проверка типизации (без эмита)
const typecheck = spawn(["bun", "run", "typecheck"], {
    stdout: "inherit",
    stderr: "inherit",
});
const typecheckCode = await typecheck.exited;
if (typecheckCode !== 0) process.exit(1);

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

