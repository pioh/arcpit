import { PeaceMode } from "../combat/peace-mode";

/**
 * Управление точками спавна
 */
export class SpawnManager {
    private cachedSpawnLocation: Vector | null = null;
    private cachedNeutralCenter: Vector | null = null;
    private cachedArenaCenters: Record<number, Vector> | null = null;

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
     * Получить центр нейтральной зоны.
     * По карте: центр нейтральной зоны = (0,0).
     */
    getNeutralCenter(): Vector {
        if (this.cachedNeutralCenter) return this.cachedNeutralCenter;

        // Фиксированный центр карты/нейтралки.
        this.cachedNeutralCenter = Vector(0, 0, 128);
        return this.cachedNeutralCenter;
    }

    /**
     * Центры арен, если на карте расставлены маркеры (info_target).
     * Имена, которые поддерживаем:
     * - arcpit_arena_1 .. arcpit_arena_8
     * - arena_1_center .. arena_8_center
     * - arena1_center .. arena8_center
     */
    getArenaCenters(): Record<number, Vector> | null {
        if (this.cachedArenaCenters) return this.cachedArenaCenters;

        const centers: Record<number, Vector> = {};
        let found = 0;

        const findArenaMarker = (id: number): CBaseEntity | undefined => {
            return (
                Entities.FindByName(undefined, `arcpit_arena_${id}`) ??
                Entities.FindByName(undefined, `arena_${id}_center`) ??
                Entities.FindByName(undefined, `arena${id}_center`)
            );
        };

        for (let id = 1; id <= 8; id++) {
            const ent = findArenaMarker(id);
            if (!ent) continue;
            const o = ent.GetAbsOrigin();
            centers[id] = Vector(o.x, o.y, o.z);
            found++;
        }

        if (found <= 0) {
            this.cachedArenaCenters = null;
            return null;
        }

        print(`Arena centers loaded from map markers: ${found}/8`);
        this.cachedArenaCenters = centers;
        return this.cachedArenaCenters;
    }

    /**
     * Разложить героев в нейтральной зоне по кругу вокруг центра нейтрали.
     */
    scatterHeroesInNeutral(playerHeroes: Map<PlayerID, CDOTA_BaseNPC_Hero>, radius: number = 520): void {
        const center = this.getNeutralCenter();

        const ids: PlayerID[] = [];
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            ids.push(i as PlayerID);
        }
        ids.sort((a, b) => a - b);

        const n = math.max(1, ids.length);
        for (let idx = 0; idx < ids.length; idx++) {
            const pid = ids[idx];
            const hero = playerHeroes.get(pid);
            if (!hero || !IsValidEntity(hero)) continue;

            const angle = (2 * math.pi * idx) / n;
            const x = center.x + radius * math.cos(angle);
            const y = center.y + radius * math.sin(angle);
            const pos = Vector(x, y, center.z);

            hero.SetAbsOrigin(pos);
            FindClearSpaceForUnit(hero, pos, true);
            this.peaceMode.applyToHero(hero);
        }
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
                this.peaceMode.applyToHero(hero);
                print(`Player ${i} hero moved to spawn point`);
            } else {
                print(`✗ Hero not found for player ${i}`);
            }
        }
    }
}

