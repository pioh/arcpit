/**
 * Конфигурация раундов (аналог Custom Hero Chaos)
 * Здесь настраивается поведение раундов и крипов
 */

export interface RoundConfig {
    roundNumber: number;
    duration: number;
    creepWaves: CreepWaveConfig[];
    specialRules?: SpecialRules;
}

export interface CreepWaveConfig {
    unitName: string;
    count: number;
    spawnDelay: number;
    spawnLocation: Vector;
}

export interface SpecialRules {
    doubleDamage?: boolean;
    fastCooldowns?: boolean;
    customModifier?: string;
}

/**
 * Пример раундов
 */
export const ROUNDS: RoundConfig[] = [
    {
        roundNumber: 1,
        duration: 60,
        creepWaves: [
            {
                unitName: "npc_dota_creep_badguys_melee",
                count: 5,
                spawnDelay: 0,
                spawnLocation: Vector(0, 1000, 128)
            }
        ]
    },
    {
        roundNumber: 2,
        duration: 90,
        creepWaves: [
            {
                unitName: "npc_dota_creep_badguys_melee",
                count: 8,
                spawnDelay: 0,
                spawnLocation: Vector(0, 1000, 128)
            },
            {
                unitName: "npc_dota_creep_badguys_ranged",
                count: 3,
                spawnDelay: 5,
                spawnLocation: Vector(0, 1000, 128)
            }
        ],
        specialRules: {
            doubleDamage: true
        }
    }
];

