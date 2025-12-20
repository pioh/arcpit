/**
 * Кирпичики для построения сцены и тестов
 */

import { PlayerManager } from "../players/player-manager";
import { SpawnManager } from "../map/spawn-manager";
import { HeroManager } from "../heroes/hero-manager";
import { AbilityManager } from "../abilities/ability-manager";
import { PeaceMode } from "../combat/peace-mode";

/**
 * Утилиты для построения тестовых сценариев
 */
export class SceneBuilder {
    constructor(
        private playerManager: PlayerManager,
        private spawnManager: SpawnManager,
        private heroManager: HeroManager,
        private abilityManager: AbilityManager,
        private peaceMode: PeaceMode
    ) {}

    /**
     * Получить главного игрока (первый человек, не бот)
     */
    getMainPlayer(): { playerID: PlayerID; hero: CDOTA_BaseNPC_Hero } | null {
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            if (PlayerResource.IsFakeClient(i)) continue;
            
            const hero = this.playerManager.getPlayerHero(i as PlayerID);
            if (hero && IsValidEntity(hero)) {
                return { playerID: i as PlayerID, hero };
            }
        }
        return null;
    }

    /**
     * Добавить способность герою
     */
    giveAbility(hero: CDOTA_BaseNPC_Hero, abilityName: string, level: number = 1): void {
        const ability = hero.AddAbility(abilityName);
        if (ability !== undefined) {
            const maxLevel = ability.GetMaxLevel();
            const targetLevel = math.min(level, maxLevel);

            // level=0 означает "просто добавить, не качать"
            if (targetLevel > 0) {
                ability.SetLevel(targetLevel);
                print(`✓ Added ${abilityName} level ${targetLevel} to ${hero.GetUnitName()}`);
            } else {
                print(`✓ Added ${abilityName} (level 0, not skilled) to ${hero.GetUnitName()}`);
            }
        } else {
            print(`✗ Failed to add ${abilityName}`);
        }
    }

    /**
     * Установить уровень героя (БЕЗ автопрокачки способностей)
     */
    setHeroLevel(hero: CDOTA_BaseNPC_Hero, level: number): void {
        const currentLevel = hero.GetLevel();
        if (level <= currentLevel) return;
        
        // Даем очки способностей НЕ прокачивая их автоматически
        for (let i = currentLevel; i < level; i++) {
            hero.HeroLevelUp(false); // false = не прокачивать способности
        }
        
        print(`✓ ${hero.GetUnitName()} level set to ${level} (${level - currentLevel} ability points available)`);
    }

    /**
     * Дать герою полное здоровье и ману
     */
    healHero(hero: CDOTA_BaseNPC_Hero): void {
        hero.SetHealth(hero.GetMaxHealth());
        hero.SetMana(hero.GetMaxMana());
    }

    /**
     * Заспавнить крипов в указанной позиции
     */
    spawnCreeps(
        unitName: string,
        count: number,
        position: Vector,
        team: DotaTeam = DotaTeam.NEUTRALS
    ): CDOTA_BaseNPC[] {
        const creeps: CDOTA_BaseNPC[] = [];
        
        for (let i = 0; i < count; i++) {
            const dx = RandomInt(-300, 300);
            const dy = RandomInt(-300, 300);
            // НЕ используем position.__add(...) — в Lua это может стать vectorws и ломать variant
            const spawnPos = Vector(position.x + dx, position.y + dy, position.z);
            
            const creep = CreateUnitByName(
                unitName,
                spawnPos,
                true,
                undefined,
                undefined,
                team
            );
            
            if (creep !== undefined) {
                FindClearSpaceForUnit(creep, spawnPos, true);
                creeps.push(creep);
            }
        }
        
        print(`✓ Spawned ${creeps.length}x ${unitName}`);
        return creeps;
    }

    /**
     * Заспавнить вражеского героя-манекен (для тестов "как я его бью").
     * Это НЕ player-bot, но для теста ударов и способностей достаточно.
     */
    spawnEnemyHeroDummy(heroName: string, position: Vector, team: DotaTeam = DotaTeam.BADGUYS): CDOTA_BaseNPC_Hero | undefined {
        const pos = Vector(position.x, position.y, position.z);
        const unit = CreateUnitByName(heroName, pos, true, undefined, undefined, team) as CDOTA_BaseNPC_Hero;
        if (!unit) return undefined;

        FindClearSpaceForUnit(unit, pos, true);
        // чтобы стоял и дрался
        unit.SetIdleAcquire(true);
        unit.SetAcquisitionRange(1200);
        return unit;
    }

    /**
     * Добавить player-bot (как в обычном режиме) через AddBotPlayerWithEntityScript.
     * Возвращает героя бота.
     */
    addPlayerBot(name: string, team: DotaTeam, entityScript: string = "bot/arcpit_bot_ai.lua"): CDOTA_BaseNPC_Hero | undefined {
        const botHero = GameRules.AddBotPlayerWithEntityScript(
            "npc_dota_hero_wisp",
            name,
            team as unknown as DOTATeam_t,
            entityScript,
            false
        );

        if (!botHero) {
            print("✗ Failed to create bot player via AddBotPlayerWithEntityScript");
            return undefined;
        }

        return botHero;
    }

    /**
     * Сделать крипов агрессивными к цели
     */
    makeCreepsAggressive(creeps: CDOTA_BaseNPC[], target: CDOTA_BaseNPC): void {
        for (const creep of creeps) {
            if (IsValidEntity(creep)) {
                creep.SetAcquisitionRange(2000);
                creep.SetIdleAcquire(true);
                
                // Приказываем атаковать
                ExecuteOrderFromTable({
                    UnitIndex: creep.entindex(),
                    OrderType: UnitOrder.ATTACK_TARGET,
                    TargetIndex: target.entindex(),
                });
            }
        }
        print(`✓ ${creeps.length} creeps now aggressive to ${target.GetUnitName()}`);
    }

    /**
     * Телепортировать героя
     */
    teleportHero(hero: CDOTA_BaseNPC_Hero, position: Vector): void {
        // Нормализуем в обычный Vector, чтобы не ловить vectorws
        const pos = Vector(position.x, position.y, position.z);
        hero.SetAbsOrigin(pos);
        FindClearSpaceForUnit(hero, pos, true);
    }

    /**
     * Очистить способности героя
     */
    clearAbilities(hero: CDOTA_BaseNPC_Hero): void {
        for (let i = hero.GetAbilityCount() - 1; i >= 0; i--) {
            const ability = hero.GetAbilityByIndex(i);
            if (ability) {
                hero.RemoveAbility(ability.GetAbilityName());
            }
        }
    }

    /**
     * Дать безлимитную ману
     */
    giveUnlimitedMana(hero: CDOTA_BaseNPC_Hero): void {
        hero.AddNewModifier(hero, undefined, "modifier_infinite_mana", {});
    }

    /**
     * Получить точку спавна
     */
    getSpawnPoint(): Vector {
        return this.spawnManager.getSpawnLocation();
    }

    /**
     * Снять мирный режим с героя (разрешить атаковать)
     */
    enableCombat(hero: CDOTA_BaseNPC_Hero): void {
        this.peaceMode.removeFromHero(hero);
        print(`✓ Combat enabled for ${hero.GetUnitName()}`);
    }

    /**
     * Снять мирный режим со всех
     */
    enableCombatForAll(): void {
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            const hero = PlayerResource.GetSelectedHeroEntity(i);
            if (hero && IsValidEntity(hero)) {
                this.peaceMode.removeFromHero(hero);
            }
        }
        print(`✓ Combat enabled for all heroes`);
    }
}

