import { IStageHandler, GameStage } from "./types";
import { GAME_CONSTANTS } from "../config/game-constants";
import { HeroManager } from "../heroes/hero-manager";
import { SpawnManager } from "../map/spawn-manager";

/**
 * Стадия выбора героя
 */
export class HeroSelectionStage implements IStageHandler {
    constructor(
        private heroManager: HeroManager,
        private spawnManager: SpawnManager,
        private playerHeroes: Map<PlayerID, CDOTA_BaseNPC_Hero>
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
            this.heroManager.autoSelectForAllPlayers(() => {
                // После ReplaceHeroWith герои часто появляются в одной точке (особенно если на карте нет info_player_start для CUSTOM_teams).
                // Раскидываем их по кругу в нейтралке и сохраняем позиции.
                this.spawnManager.scatterHeroesInNeutral(this.playerHeroes);
            });
            return undefined;
        });
    }
}

