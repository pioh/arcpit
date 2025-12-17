import { spawn } from "child_process";
import { join } from "path";
import { createWriteStream, mkdirSync, existsSync, readFileSync, watch } from "fs";
import { getAddonName, getDotaPath } from "./utils.js";

try {
    const dotaPath = await getDotaPath();
    const win64 = join(dotaPath, "game", "bin", "win64");
    const addonName = getAddonName();
    const executable = join(win64, "dota2.exe");

    // Создаем директорию для логов
    const logsDir = join(process.cwd(), "logs");
    mkdirSync(logsDir, { recursive: true });

    // Создаем файл лога с timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const logFile = join(logsDir, `hammer_${timestamp}.log`);
    const logStream = createWriteStream(logFile, { flags: "a" });

    const log = (message) => {
        console.log(message);
        logStream.write(message + "\n");
    };

    // Запуск только Hammer редактора для работы с картами
    const args = ["-novid", "-console", "-condebug", "-tools", "-addon", addonName, "+map_editing_mode", "1"];

    log("=== Запуск Hammer для Dota 2 ===");
    log(`Время запуска: ${new Date().toLocaleString("ru-RU")}`);
    log(`Путь к Dota: ${dotaPath}`);
    log(`Рабочая директория: ${win64}`);
    log(`Исполняемый файл: ${executable}`);
    log(`Название аддона: ${addonName}`);
    log(`Аргументы: ${args.join(" ")}`);
    log(`Лог сохраняется в: ${logFile}`);
    log("================================\n");

    // Путь к console.log Dota 2
    const consoleLogPath = join(dotaPath, "game", "dota", "console.log");
    
    if (existsSync(consoleLogPath)) {
        try {
            const oldContent = readFileSync(consoleLogPath, "utf-8");
            logStream.write("\n=== Предыдущий console.log ===\n");
            logStream.write(oldContent);
            logStream.write("\n=== Новый запуск ===\n\n");
        } catch (e) {
            // Игнорируем ошибки чтения старого лога
        }
    }

    const child = spawn(executable, args, { 
        cwd: win64,
        stdio: ["inherit", "pipe", "pipe"] // Перехватываем stdout/stderr для логирования
    });

    // Пишем stdout и в консоль, и в файл
    child.stdout.on("data", (data) => {
        process.stdout.write(data);
        logStream.write(data);
    });

    // Пишем stderr и в консоль, и в файл
    child.stderr.on("data", (data) => {
        process.stderr.write(data);
        logStream.write(data);
    });

    // Следим за console.log и копируем его содержимое
    let consoleWatcher = null;
    let lastSize = 0;
    const startWatchingConsoleLog = () => {
        if (existsSync(consoleLogPath)) {
            try {
                consoleWatcher = watch(consoleLogPath, (eventType) => {
                    if (eventType === "change") {
                        try {
                            const content = readFileSync(consoleLogPath, "utf-8");
                            const newContent = content.slice(lastSize);
                            if (newContent) {
                                process.stdout.write(newContent);
                                logStream.write(newContent);
                                lastSize = content.length;
                            }
                        } catch (e) {
                            // Файл может быть заблокирован
                        }
                    }
                });
                log("✓ Отслеживание console.log запущено\n");
            } catch (e) {
                log("⚠ Не удалось начать отслеживание console.log\n");
            }
        } else {
            setTimeout(startWatchingConsoleLog, 2000);
        }
    };
    
    setTimeout(startWatchingConsoleLog, 1000);

    child.on("error", (error) => {
        const errorMsg = `\n❌ Ошибка при запуске Hammer:\nКод ошибки: ${error.code}\nСообщение: ${error.message}\nПолная ошибка: ${error}`;
        console.error(errorMsg);
        logStream.write(errorMsg + "\n");
        logStream.end();
        process.exit(1);
    });

    child.on("exit", (code, signal) => {
        if (consoleWatcher) {
            consoleWatcher.close();
        }
        
        if (existsSync(consoleLogPath)) {
            try {
                const finalContent = readFileSync(consoleLogPath, "utf-8");
                const newContent = finalContent.slice(lastSize);
                if (newContent) {
                    logStream.write("\n=== Финальный вывод console.log ===\n");
                    logStream.write(newContent);
                }
            } catch (e) {
                // Игнорируем ошибки
            }
        }
        
        const exitMsg = `\n=== Hammer завершён ===\nКод выхода: ${code}${signal ? `\nСигнал: ${signal}` : ""}\n=======================\n`;
        log(exitMsg);
        logStream.end();
        if (code !== 0 && code !== null) {
            process.exit(code);
        }
    });

    child.on("close", (code) => {
        log(`Процесс Hammer закрыт с кодом: ${code}`);
    });

} catch (error) {
    console.error("\n❌ Критическая ошибка:");
    console.error("Сообщение:", error.message);
    console.error("Стек вызовов:", error.stack);
    process.exit(1);
}

process.on("SIGINT", () => {
    console.log("\n\n⚠️  Получен сигнал прерывания (Ctrl+C)");
    process.exit(0);
});

