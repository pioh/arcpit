import { GameStage, IStageHandler } from "./types";
import { HeroSelectionStage } from "./hero-selection";
import { PreCombatStage } from "./pre-combat";
import { CombatStage } from "./combat";
import { GAME_CONSTANTS } from "../config/game-constants";
import { RoundController } from "../rounds/round-controller";

/**
 * Управление переходами между стадиями
 */
export class StageManager {
    private currentStage: GameStage = GameStage.INIT;
    private stages: Map<GameStage, IStageHandler> = new Map();
    private roundController?: RoundController;

    constructor(
        heroSelectionStage: HeroSelectionStage,
        preCombatStage: PreCombatStage,
        combatStage: CombatStage,
        roundController?: RoundController
    ) {
        this.stages.set(GameStage.HERO_SELECTION, heroSelectionStage);
        this.stages.set(GameStage.PRE_COMBAT, preCombatStage);
        this.stages.set(GameStage.COMBAT, combatStage);
        this.roundController = roundController;
    }

    getCurrentStage(): GameStage {
        return this.currentStage;
    }

    startHeroSelection(): void {
        this.transitionTo(GameStage.HERO_SELECTION);
        
        // Переход к следующей стадии
        Timers.CreateTimer(GAME_CONSTANTS.HERO_SELECTION_TIME, () => {
            // Выбор способностей больше не является отдельной стадией (он триггерится сервером по правилам).
            this.startPreCombat(GAME_CONSTANTS.PRE_COMBAT_TIME);
            return undefined;
        });
    }

    startPreCombat(duration: number = GAME_CONSTANTS.PRE_COMBAT_TIME): void {
        this.transitionTo(GameStage.PRE_COMBAT);

        // Для PRE_COMBAT (планирование) длительность может быть разной (5с перед 1-м раундом, 10с между раундами)
        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.PRE_COMBAT,
            duration
        });

        this.roundController?.onPlanningStageStarted(duration);
        
        Timers.CreateTimer(duration, () => {
            this.startCombat();
            return undefined;
        });
    }

    startCombat(): void {
        this.transitionTo(GameStage.COMBAT);
    }

    private transitionTo(stage: GameStage): void {
        print(`=== Transitioning from ${this.currentStage} to ${stage} ===`);
        this.currentStage = stage;
        
        const handler = this.stages.get(stage);
        if (handler) {
            print(`Starting stage: ${handler.getName()}`);
            handler.start();
        } else {
            print(`WARNING: No handler for stage ${stage}`);
        }
    }
}

