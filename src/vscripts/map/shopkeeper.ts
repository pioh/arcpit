/**
 * Управление торговцем
 */
export class ShopkeeperManager {
    /**
     * Создать торговца если его еще нет
     */
    ensureShopkeeper(spawnLocation: Vector): void {
        const existing = Entities.FindAllByName("arcpit_shopkeeper");
        if (existing && existing.length > 0) {
            print("Shopkeeper already exists");
            return;
        }

        const pos = Vector(spawnLocation.x + 300, spawnLocation.y, spawnLocation.z);

        // Пробуем создать ent_dota_shop (может не работать в tools)
        try {
            const shopEnt = SpawnEntityFromTableSynchronous("ent_dota_shop", {
                targetname: "arcpit_shop",
                origin: `${pos.x} ${pos.y} ${pos.z}`,
            });
            
            if (shopEnt && IsValidEntity(shopEnt)) {
                print("✓ ent_dota_shop spawned");
            }
        } catch (e) {
            print("Could not spawn ent_dota_shop (might be in tools mode)");
        }
    }
}

