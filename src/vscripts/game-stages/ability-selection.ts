import { IStageHandler, GameStage } from "./types";
import { GAME_CONSTANTS } from "../config/game-constants";
import { AbilityManager } from "../abilities/ability-manager";

/**
 * Стадия выбора способностей
 */
export class AbilitySelectionStage implements IStageHandler {
    constructor(
        private abilityManager: AbilityManager
    ) {}

    getName(): string {
        return "Ability Selection";
    }

    start(): void {
        print("=== Starting ability selection phase ===");
        
        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.ABILITY_SELECTION,
            duration: GAME_CONSTANTS.ABILITY_SELECTION_TIME
        });

        Timers.CreateTimer(GAME_CONSTANTS.ABILITY_SELECTION_TIME, () => {
            this.abilityManager.autoSelectForAllPlayers();
            return undefined;
        });
    }
}

