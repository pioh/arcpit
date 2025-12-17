import { spawn } from "child_process";
import { join } from "path";
import { createWriteStream, mkdirSync, existsSync, readFileSync, watch, statSync } from "fs";
import { getAddonName, getDotaPath } from "./utils.js";
import { checkSteam } from "./check-steam.js";

try {
    // Проверяем запущен ли Steam
    const isSteamRunning = await checkSteam();
    if (!isSteamRunning) {
        console.log("⚠️  Steam не запущен!");
        console.log("Пожалуйста, запустите Steam и попробуйте снова.");
        console.log("Без Steam игра не сможет инициализироваться корректно.\n");
        process.exit(1);
    }
    console.log("✓ Steam запущен\n");

    const dotaPath = await getDotaPath();
    const win64 = join(dotaPath, "game", "bin", "win64");
    const addonName = getAddonName();
    
    // Ищем путь к Steam
    const steamPath = join(dotaPath, "..", "..", "..", "steam.exe");
    const executable = existsSync(steamPath) ? steamPath : join(win64, "dota2.exe");

    // Создаем директорию для логов
    const logsDir = join(process.cwd(), "logs");
    mkdirSync(logsDir, { recursive: true });

    // Создаем файл лога с timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const logFile = join(logsDir, `play_${timestamp}.log`);
    const logStream = createWriteStream(logFile, { flags: "a" });

    const log = (message) => {
        console.log(message);
        logStream.write(message + "\n");
    };

    // Автоматический запуск карты arcpit_1
    const mapName = "arcpit_1";
    const usingSteam = executable.endsWith("steam.exe");
    
    const gameArgs = [
        "-novid", 
        "-console",      // Показываем консоль
        "-condebug",     // Пишем полный лог в console.log
        "-dev",          // Developer mode
        "+sv_lan", "1",  // Локальная игра
        "+map", mapName, // Загружаем карту напрямую
        "+dota_force_gamemode", "15",  // 15 = Custom game mode
        "+sv_cheats", "1"  // Включаем читы для тестирования
    ];
    
    const args = usingSteam 
        ? ["-applaunch", "570", ...gameArgs]
        : gameArgs;

    log("=== Быстрый запуск карты ===");
    log(`Время запуска: ${new Date().toLocaleString("ru-RU")}`);
    log(`Путь к Dota: ${dotaPath}`);
    log(`Рабочая директория: ${win64}`);
    log(`Исполняемый файл: ${executable}`);
    log(`Запуск через: ${usingSteam ? "Steam (рекомендуется)" : "напрямую dota2.exe"}`);
    log(`Название аддона: ${addonName}`);
    log(`Карта: ${mapName}`);
    log(`Аргументы: ${args.join(" ")}`);
    log(`Лог сохраняется в: ${logFile}`);
    log("===========================\n");

    // Путь к console.log Dota 2
    const consoleLogPath = join(dotaPath, "game", "dota", "console.log");
    
    // Сохраняем старый console.log
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
        cwd: usingSteam ? dotaPath : win64,
        stdio: ["inherit", "pipe", "pipe"],
        detached: false
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
    let watcherActive = false;
    let checkInterval = null;
    
    const startWatchingConsoleLog = () => {
        if (existsSync(consoleLogPath)) {
            try {
                const stats = statSync(consoleLogPath);
                lastSize = stats.size;
                
                checkInterval = setInterval(() => {
                    try {
                        if (existsSync(consoleLogPath)) {
                            const currentSize = statSync(consoleLogPath).size;
                            if (currentSize > lastSize) {
                                const buffer = Buffer.alloc(currentSize - lastSize);
                                const fd = require('fs').openSync(consoleLogPath, 'r');
                                require('fs').readSync(fd, buffer, 0, buffer.length, lastSize);
                                require('fs').closeSync(fd);
                                
                                const newContent = buffer.toString('utf-8');
                                process.stdout.write(newContent);
                                logStream.write(newContent);
                                lastSize = currentSize;
                            }
                        }
                    } catch (e) {
                        // Файл может быть временно заблокирован
                    }
                }, 500);
                
                watcherActive = true;
                log("✓ Отслеживание console.log запущено\n");
            } catch (e) {
                log(`⚠ Не удалось начать отслеживание console.log: ${e.message}\n`);
                setTimeout(startWatchingConsoleLog, 2000);
            }
        } else {
            setTimeout(startWatchingConsoleLog, 2000);
        }
    };
    
    setTimeout(startWatchingConsoleLog, 2000);

    child.on("error", (error) => {
        const errorMsg = `\n❌ Ошибка при запуске игры:\nКод ошибки: ${error.code}\nСообщение: ${error.message}\nПолная ошибка: ${error}`;
        console.error(errorMsg);
        logStream.write(errorMsg + "\n");
        logStream.end();
        process.exit(1);
    });

    child.on("exit", (code, signal) => {
        if (checkInterval) {
            clearInterval(checkInterval);
        }
        if (consoleWatcher) {
            consoleWatcher.close();
        }
        
        setTimeout(() => {
            if (existsSync(consoleLogPath)) {
                try {
                    log("\n=== Полное содержимое console.log ===\n");
                    const finalContent = readFileSync(consoleLogPath, "utf-8");
                    logStream.write(finalContent);
                    log("\n=== Конец console.log ===\n");
                } catch (e) {
                    log(`⚠ Ошибка чтения console.log: ${e.message}\n`);
                }
            } else {
                log("⚠ console.log не найден\n");
            }
            
            const exitMsg = `\n=== Игра завершена ===\nКод выхода: ${code}${signal ? `\nСигнал: ${signal}` : ""}\nПуть к console.log: ${consoleLogPath}\n======================\n`;
            log(exitMsg);
            logStream.end();
            
            if (code !== 0 && code !== null) {
                process.exit(code);
            }
        }, 1000);
    });

    child.on("close", (code) => {
        log(`Процесс игры закрыт с кодом: ${code}`);
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

