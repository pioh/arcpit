/**
 * Пул доступных героев
 * Здесь можно настраивать список героев для выбора
 */
import { HERO_POOL_GENERATED } from "./hero-pool.generated";

export const HERO_POOL: string[] = [...HERO_POOL_GENERATED];

/**
 * Прекеш героев
 */
export function precacheHeroes(context: CScriptPrecacheContext): void {

    // Весь пул
    for (const heroName of HERO_POOL) {
        PrecacheUnitByNameSync(heroName, context);
    }
}

