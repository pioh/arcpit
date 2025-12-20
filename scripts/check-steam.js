import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Проверяем запущен ли Steam
export async function checkSteam() {
    try {
        const { stdout } = await execAsync('tasklist /FI "IMAGENAME eq steam.exe" /NH', { encoding: 'utf8' });
        const isRunning = stdout.toLowerCase().includes('steam.exe');
        return isRunning;
    } catch (error) {
        return false;
    }
}

// Ждем пока Steam запустится
export async function waitForSteam(timeoutMs = 30000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
        if (await checkSteam()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
}


