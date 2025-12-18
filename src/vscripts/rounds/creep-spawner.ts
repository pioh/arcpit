/**
 * Система спавна крипов
 */
import { RoundConfig, CreepWaveConfig } from "./round-config";

export class CreepSpawner {
    /**
     * Начать раунд
     */
    startRound(config: RoundConfig): void {
        print(`=== Starting Round ${config.roundNumber} ===`);
        
        // Применяем специальные правила
        if (config.specialRules) {
            this.applySpecialRules(config.specialRules);
        }
        
        // Спавним волны крипов
        for (const wave of config.creepWaves) {
            Timers.CreateTimer(wave.spawnDelay, () => {
                this.spawnWave(wave);
                return undefined;
            });
        }
    }

    /**
     * Спавн волны крипов
     */
    private spawnWave(wave: CreepWaveConfig): void {
        print(`Spawning ${wave.count}x ${wave.unitName}`);
        
        for (let i = 0; i < wave.count; i++) {
            const creep = CreateUnitByName(
                wave.unitName,
                wave.spawnLocation,
                true,
                undefined,
                undefined,
                DotaTeam.NEUTRALS
            );
            
            if (creep !== undefined) {
                // Дополнительная настройка крипа
                this.setupCreep(creep);
            }
        }
    }

    /**
     * Настройка крипа после спавна
     */
    private setupCreep(creep: CDOTA_BaseNPC): void {
        // Можно добавить модификаторы, поведение и т.д.
    }

    /**
     * Применить специальные правила раунда
     */
    private applySpecialRules(rules: any): void {
        print("Applying special rules for round");
        // Реализация специальных правил
    }
}

