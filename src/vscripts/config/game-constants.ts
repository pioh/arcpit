// Константы игры
export const GAME_CONSTANTS = {
    // Игроки
    MAX_PLAYERS: 8,
    
    // Время стадий (в секундах)
    HERO_SELECTION_TIME: 0.5,  // Быстро для тестов
    ABILITY_SELECTION_TIME: 0.5,  // Быстро для тестов
    PRE_COMBAT_TIME: 1,  // Быстро для тестов
    
    // Экономика
    STARTING_GOLD: 2000,
    GOLD_PER_TICK: 2,
    GOLD_TICK_TIME: 1.0,
    
    // Боевые параметры
    DEFAULT_ACQUISITION_RANGE: 800,
    BOT_SEARCH_RADIUS: 2500,
    COMBAT_SEARCH_RADIUS: 8000,
} as const;

