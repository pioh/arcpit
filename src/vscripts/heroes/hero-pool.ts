/**
 * Пул доступных героев
 * Здесь можно настраивать список героев для выбора
 */
import { HERO_POOL_GENERATED } from "./hero-pool/generated";

export const HERO_POOL: string[] = [...HERO_POOL_GENERATED];

/**
 * Прекеш героев
 */
export function precacheHeroes(context: CScriptPrecacheContext, limit: number = HERO_POOL.length): void {
    const max = Math.max(0, Math.floor(limit));
    if (max <= 0) return;

    // ВАЖНО: массовый precache большого количества героев может переполнить лимит loading resources и крашнуть игру.
    // Поэтому по умолчанию лимит задаётся из GAME_CONSTANTS и обычно равен 0.
    const n = Math.min(HERO_POOL.length, max);
    for (let i = 0; i < n; i++) {
        PrecacheUnitByNameSync(HERO_POOL[i], context);
    }
}

