/**
 * Пул доступных героев
 * Здесь можно настраивать список героев для выбора
 */
export const HERO_POOL: string[] = [
    "npc_dota_hero_axe",
    "npc_dota_hero_juggernaut",
    "npc_dota_hero_sven",
    "npc_dota_hero_pudge",
    "npc_dota_hero_crystal_maiden",
    "npc_dota_hero_lina",
    "npc_dota_hero_invoker",
    "npc_dota_hero_mirana",
    "npc_dota_hero_antimage",
    "npc_dota_hero_phantom_assassin",
    "npc_dota_hero_sniper",
    "npc_dota_hero_drow_ranger",
    "npc_dota_hero_silencer",
    "npc_dota_hero_wisp"
];

/**
 * Прекеш героев
 */
export function precacheHeroes(context: CScriptPrecacheContext): void {

    // Весь пул
    for (const heroName of HERO_POOL) {
        PrecacheUnitByNameSync(heroName, context);
    }
}

