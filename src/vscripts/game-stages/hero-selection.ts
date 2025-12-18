import { IStageHandler, GameStage } from "./types";
import { GAME_CONSTANTS } from "../config/game-constants";
import { HeroDraftManager } from "../heroes/hero-draft-manager";

/**
 * Стадия выбора героя
 */
export class HeroSelectionStage implements IStageHandler {
    constructor(
        private heroDraft: HeroDraftManager
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

        // Индивидуальный драфт (6 героев, клик -> CreateHeroForPlayer)
        this.heroDraft.start(GAME_CONSTANTS.HERO_SELECTION_TIME);
    }
}

