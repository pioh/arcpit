import { IStageHandler, GameStage } from "./types";
import { RoundController } from "../rounds/round-controller";

/**
 * Боевая стадия
 */
export class CombatStage implements IStageHandler {
    constructor(
        private roundController: RoundController
    ) {}

    getName(): string {
        return "Combat";
    }

    start(): void {
        print("=== Starting combat phase ===");
        
        // Стартуем раунд PvE (vs крипы)
        this.roundController.onCombatStageStarted();
        
        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.COMBAT,
            duration: 0
        });
    }
}

