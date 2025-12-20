import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const logsDir = join(process.cwd(), "logs");

try {
    const files = readdirSync(logsDir)
        .filter(f => f.endsWith('.log'))
        .map(f => ({
            name: f,
            path: join(logsDir, f),
            time: statSync(join(logsDir, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
        console.log("Нет логов в папке logs/");
        process.exit(0);
    }

    const lastLog = files[0];
    console.log(`\n📄 Последний лог: ${lastLog.name}`);
    console.log(`⏰ Время: ${lastLog.time.toLocaleString("ru-RU")}`);
    console.log(`\n${"=".repeat(80)}\n`);

    const content = readFileSync(lastLog.path, "utf-8");
    console.log(content);

    console.log(`\n${"=".repeat(80)}\n`);
    
    // Анализ ошибок
    const lines = content.split('\n');
    const errors = lines.filter(l => 
        l.includes('error') || 
        l.includes('Error') || 
        l.includes('ERROR') ||
        l.includes('failed') ||
        l.includes('Failed') ||
        l.includes('FATAL')
    );

    if (errors.length > 0) {
        console.log(`\n⚠️  Найдено ${errors.length} строк с ошибками:\n`);
        errors.slice(0, 20).forEach((err, i) => {
            console.log(`${i + 1}. ${err.trim()}`);
        });
        if (errors.length > 20) {
            console.log(`\n... и еще ${errors.length - 20} ошибок`);
        }
    } else {
        console.log("\n✓ Критических ошибок не найдено");
    }

} catch (error) {
    console.error("Ошибка:", error.message);
    process.exit(1);
}


