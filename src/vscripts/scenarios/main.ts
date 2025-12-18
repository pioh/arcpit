/**
 * ГЛАВНАЯ ТОЧКА ВХОДА для выбора сценария
 * 
 * Измени функцию в startSelectedScenario() чтобы запустить нужный сценарий
 */

import { SceneBuilder } from "./scene-builder";
import { DefaultGameScenario } from "./default-game";
import { TestGlaivesVsCreeps } from "./test-glaives-vs-creeps";
import { StageManager } from "../game-stages/stage-manager";
import { PlayerManager } from "../players/player-manager";
import { PeaceMode } from "../combat/peace-mode";
import { SpawnManager } from "../map/spawn-manager";
import { HeroManager } from "../heroes/hero-manager";
import { AbilityManager } from "../abilities/ability-manager";

/**
 * Менеджер сценариев
 */
export class ScenarioManager {
    private sceneBuilder: SceneBuilder;
    private defaultGame: DefaultGameScenario;
    private testGlaives: TestGlaivesVsCreeps;

    constructor(
        playerManager: PlayerManager,
        spawnManager: SpawnManager,
        heroManager: HeroManager,
        abilityManager: AbilityManager,
        peaceMode: PeaceMode,
        stageManager: StageManager
    ) {
        // Инициализируем кирпичики
        this.sceneBuilder = new SceneBuilder(
            playerManager,
            spawnManager,
            heroManager,
            abilityManager,
            peaceMode
        );

        // Инициализируем сценарии
        this.defaultGame = new DefaultGameScenario(
            stageManager,
            playerManager,
            peaceMode
        );

        this.testGlaives = new TestGlaivesVsCreeps(
            this.sceneBuilder,
            playerManager,
            peaceMode,
            heroManager,
            abilityManager
        );
    }

    /**
     * ========================================
     * МЕНЯЙ ЗДЕСЬ чтобы выбрать сценарий!
     * ========================================
     */
    startSelectedScenario(): void {
        // Раскомментируй нужный сценарий:

        // === ОСНОВНАЯ ИГРА ===
        // this.defaultGame.start();

        // === ТЕСТ: Glaives vs Creeps ===
        this.testGlaives.start();

        // === Добавь свои тесты ниже ===
        // this.testMyCustomScenario.start();
    }

    /**
     * Получить SceneBuilder для создания новых тестов
     */
    getSceneBuilder(): SceneBuilder {
        return this.sceneBuilder;
    }
}

