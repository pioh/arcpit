/**
 * Основной игровой сценарий (Custom Hero Chaos)
 */

import { StageManager } from "../game-stages/stage-manager";
import { PlayerManager } from "../players/player-manager";
import { PeaceMode } from "../combat/peace-mode";

/**
 * Основной режим игры
 */
export class DefaultGameScenario {
    constructor(
        private stageManager: StageManager,
        private playerManager: PlayerManager,
        private peaceMode: PeaceMode
    ) {}

    /**
     * Запустить основной игровой режим
     */
    start(): void {
        print("=== Starting DEFAULT GAME scenario ===");
        
        // Флоу:
        // - HERO_SELECTION + STRATEGY_TIME обрабатывает движок (кастомный пик + аспекты)
        // - тут мы стартуем только когда игра уже началась (GAME_IN_PROGRESS): PRE_COMBAT 5с -> COMBAT
        this.peaceMode.enable();
        this.peaceMode.applyToAll();
        
        // Золото игрокам
        this.playerManager.giveGoldToAll(2000);
        
        // Запрет шэринга
        this.playerManager.disableUnitSharing();
        
        // Сохраняем героев
        this.playerManager.saveCurrentHeroes();
        
        // Запускаем стадии: сразу PRE_COMBAT на 5 сек, затем первый раунд
        Timers.CreateTimer(0.5, () => {
            this.stageManager.startPreCombat(5);
            return undefined;
        });
    }
}

