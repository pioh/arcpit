import { PeaceMode } from "../combat/peace-mode";

/**
 * Управление точками спавна
 */
export class SpawnManager {
    private cachedSpawnLocation: Vector | null = null;

    constructor(
        private peaceMode: PeaceMode
    ) {}

    /**
     * Получить координаты точки спавна
     */
    getSpawnLocation(): Vector {
        if (this.cachedSpawnLocation) {
            return this.cachedSpawnLocation;
        }

        const spawnPoint = Entities.FindByClassname(undefined, "info_player_start_dota");
        
        if (spawnPoint) {
            // ВАЖНО: GetAbsOrigin() иногда возвращает vectorws, который ломает некоторые вызовы (variant type vectorws).
            // Нормализуем в обычный Vector.
            const o = spawnPoint.GetAbsOrigin();
            this.cachedSpawnLocation = Vector(o.x, o.y, o.z);
            print(`Spawn location found: ${this.cachedSpawnLocation.x}, ${this.cachedSpawnLocation.y}, ${this.cachedSpawnLocation.z}`);
        } else {
            this.cachedSpawnLocation = Vector(0, 0, 128);
            print("Warning: No spawn point found, using default location");
        }

        return this.cachedSpawnLocation;
    }

    /**
     * Телепортировать всех героев в точку спавна
     */
    moveAllHeroesToSpawn(playerHeroes: Map<PlayerID, CDOTA_BaseNPC_Hero>): void {
        const spawnLocation = this.getSpawnLocation();

        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            
            const hero = playerHeroes.get(i as PlayerID);
            if (hero && IsValidEntity(hero)) {
                hero.SetAbsOrigin(spawnLocation);
                FindClearSpaceForUnit(hero, spawnLocation, true);
                hero.SetTeam(DotaTeam.CUSTOM_1); // Все друзья
                this.peaceMode.applyToHero(hero);
                print(`Player ${i} hero moved to spawn point`);
            } else {
                print(`✗ Hero not found for player ${i}`);
            }
        }
    }
}

