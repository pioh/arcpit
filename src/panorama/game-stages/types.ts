/**
 * Типы для стадий игры (клиентская часть)
 */
export enum GameStage {
    INIT = 0,
    HERO_SELECTION = 1,
    ABILITY_SELECTION = 2,
    PRE_COMBAT = 3,
    COMBAT = 4
}

export interface StageChangedData {
    stage: GameStage;
    duration: number;
}

