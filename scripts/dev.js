import { spawn } from "bun";

console.log("Starting development mode with file watching...");

// Параллельный запуск обоих dev процессов в watch режиме
const panorama = spawn(["bun", "run", "dev:panorama"], {
    stdout: "inherit",
    stderr: "inherit",
});

const vscripts = spawn(["bun", "run", "dev:vscripts"], {
    stdout: "inherit",
    stderr: "inherit",
});

// Ожидаем завершения (эти процессы будут работать пока не будут убиты)
await Promise.race([panorama.exited, vscripts.exited]);

// Если один из процессов завершился, завершаем и другой
panorama.kill();
vscripts.kill();
process.exit(1);

