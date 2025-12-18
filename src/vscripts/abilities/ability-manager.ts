import { ABILITY_POOL } from "./ability-pool";
import { PlayerManager } from "../players/player-manager";
import { AbilityCustomizer } from "./ability-customizer";

/**
 * Управление способностями героев
 */
export class AbilityManager {
    constructor(
        private playerManager: PlayerManager
    ) {}

    /**
     * Автоматический выбор способностей для всех игроков
     */
    autoSelectForAllPlayers(onComplete?: () => void): void {
        print("=== Auto-selecting abilities for all players ===");

        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;

            let hero = this.playerManager.getPlayerHero(i as PlayerID);
            if (!hero || !IsValidEntity(hero)) {
                const selected = PlayerResource.GetSelectedHeroEntity(i);
                if (selected && IsValidEntity(selected)) {
                    hero = selected;
                    this.playerManager.setPlayerHero(i as PlayerID, hero);
                }
            }

            if (hero && IsValidEntity(hero)) {
                this.replaceAbilities(hero, i);
            } else {
                print(`✗ No hero found for player ${i}`);
            }
        }

        if (onComplete) {
            // дать тик на создание абилок/модификаторов
            Timers.CreateTimer(0.1, () => {
                onComplete();
                return undefined;
            });
        }
    }

    /**
     * Замена способностей героя на случайные
     */
    private replaceAbilities(hero: CDOTA_BaseNPC_Hero, playerID: number): void {
        print(`Processing abilities for player ${playerID}, hero: ${hero.GetUnitName()}`);
        
        // Удаляем все текущие способности
        for (let j = hero.GetAbilityCount() - 1; j >= 0; j--) {
            const ability = hero.GetAbilityByIndex(j);
            if (ability) {
                hero.RemoveAbility(ability.GetAbilityName());
            }
        }

        // Добавляем 5 случайных способностей
        const selectedAbilities = this.getRandomAbilities(5);
        print(`  Selected abilities: ${selectedAbilities.join(", ")}`);
        
        for (const abilityName of selectedAbilities) {
            const ability = hero.AddAbility(abilityName);
            if (ability !== undefined) {
                // НЕ прокачиваем способности! Игрок сам будет качать
                // ability.SetLevel(1);
                print(`  ✓ Added ability: ${abilityName} (level 0, not skilled)`);
                
                // Применяем кастомную логику для способности
                AbilityCustomizer.setupAbility(hero, abilityName);
            } else {
                print(`  ✗ Failed to add ability: ${abilityName}`);
            }
        }
    }

    /**
     * Получить N случайных способностей из пула
     */
    private getRandomAbilities(count: number): string[] {
        const pool = [...ABILITY_POOL];
        const result: string[] = [];

        while (result.length < count && pool.length > 0) {
            const idx = RandomInt(0, pool.length - 1);
            result.push(pool[idx]);
            // swap-remove
            pool[idx] = pool[pool.length - 1];
            pool.pop();
        }

        return result;
    }
}

