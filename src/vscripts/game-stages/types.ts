// Стадии игры
export enum GameStage {
    INIT = 0,
    HERO_SELECTION = 1,
    ABILITY_SELECTION = 2,
    PRE_COMBAT = 3,
    COMBAT = 4
}

// Интерфейс для обработчика стадий
export interface IStageHandler {
    start(): void;
    getName(): string;
}

