import { IStageHandler, GameStage } from "./types";
import { GAME_CONSTANTS } from "../config/game-constants";
import { SpawnManager } from "../map/spawn-manager";
import { ShopkeeperManager } from "../map/shopkeeper";

/**
 * Стадия подготовки к бою
 */
export class PreCombatStage implements IStageHandler {
    constructor(
        private spawnManager: SpawnManager,
        private shopkeeperManager: ShopkeeperManager,
        private playerHeroes: Map<PlayerID, CDOTA_BaseNPC_Hero>
    ) {}

    getName(): string {
        return "Pre-Combat";
    }

    start(): void {
        print("=== Starting pre-combat phase ===");
        
        const spawnLocation = this.spawnManager.getSpawnLocation();
        
        // Телепортируем всех героев в центр
        this.spawnManager.moveAllHeroesToSpawn(this.playerHeroes);
        
        // Создаем торговца
        this.shopkeeperManager.ensureShopkeeper(spawnLocation);
        
        CustomGameEventManager.Send_ServerToAllClients("stage_changed", {
            stage: GameStage.PRE_COMBAT,
            duration: GAME_CONSTANTS.PRE_COMBAT_TIME
        });
    }
}

