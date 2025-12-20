// Константы игры
export const GAME_CONSTANTS = {
    // Игроки
    MAX_PLAYERS: 8,

    // Боты
    BOT_START_LEVEL: 30,
    
    // Время стадий (в секундах)
    HERO_SELECTION_TIME: 5,
    ABILITY_SELECTION_TIME: 5,
    PRE_COMBAT_TIME: 5, // планирование перед 1-м раундом
    BETWEEN_ROUNDS_PLANNING_TIME: 10, // планирование между раундами
    
    // Экономика
    STARTING_GOLD: 2000,
    GOLD_PER_TICK: 2,
    GOLD_TICK_TIME: 1.0,
    
    // Боевые параметры
    DEFAULT_ACQUISITION_RANGE: 800,
    BOT_SEARCH_RADIUS: 2500,
    COMBAT_SEARCH_RADIUS: 8000,

    // Если true — чистим дефолтные способности у героя кодом.
    // Если false — ожидаем, что дефолтные Ability* уже очищены через npc_heroes_custom (генерация KV).
    CLEAR_DEFAULT_ABILITIES_IN_CODE: false,

    // Precache:
    // Массовый PrecacheUnitByNameSync для большого пула героев может переполнить список loading resources
    // и привести к FATAL ERROR (лимит ~32767). Включайте только при необходимости.
    // 0 = не прекешить пул на старте (рекомендуется).
    PRECACHE_HERO_POOL_SYNC_LIMIT: 0,

    // Best-effort precache моделей героев в Precache (для tools окружения). Аналогично опасно по лимитам.
    PRECACHE_HERO_MODELS_IN_PRECACHE: false,
} as const;

