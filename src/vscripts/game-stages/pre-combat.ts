import { IStageHandler, GameStage } from "./types";
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

        // В планировании НЕ телепортируем всех в одну точку — игроки должны остаться на своих местах в нейтралке.
        // Мирный режим держится через PeaceMode + RoundController neutral enforcer.
        const neutralCenter = this.spawnManager.getNeutralCenter();
        this.shopkeeperManager.ensureShopkeeper(neutralCenter);
    }
}

