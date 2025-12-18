import { IStageHandler, GameStage } from "./types";
import { CombatStarter } from "../combat/combat-starter";

/**
 * Боевая стадия
 */
export class CombatStage implements IStageHandler {
    constructor(
        private combatStarter: CombatStarter
    ) {}

    getName(): string {
        return "Combat";
    }

    start(): void {
        print("=== Starting combat phase ===");
        
        // Разделяем всех по командам и запускаем бой
        this.combatStarter.startCombat();
        
        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.COMBAT,
            duration: 0
        });
    }
}

