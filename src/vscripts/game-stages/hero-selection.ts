import { IStageHandler, GameStage } from "./types";
import { GAME_CONSTANTS } from "../config/game-constants";
import { HeroManager } from "../heroes/hero-manager";

/**
 * Стадия выбора героя
 */
export class HeroSelectionStage implements IStageHandler {
    constructor(
        private heroManager: HeroManager
    ) {}

    getName(): string {
        return "Hero Selection";
    }

    start(): void {
        print("=== Starting hero selection phase ===");
        
        // Отправляем событие на клиент
        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.HERO_SELECTION,
            duration: GAME_CONSTANTS.HERO_SELECTION_TIME
        });

        // Автовыбор через N секунд
        Timers.CreateTimer(GAME_CONSTANTS.HERO_SELECTION_TIME, () => {
            this.heroManager.autoSelectForAllPlayers();
            return undefined;
        });
    }
}

