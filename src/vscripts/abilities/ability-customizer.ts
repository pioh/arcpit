/**
 * Система кастомизации способностей
 * Автоматически применяет модификаторы и логику к конкретным способностям
 */

export class AbilityCustomizer {
    // Маппинг способностей на кастомные модификаторы
    private static readonly ABILITY_MODIFIERS: Record<string, string> = {
        // Временный интеллект от глейвов (через бакеты)
        "silencer_glaives_of_wisdom": "modifier_glaives_temp_int_handler",
    };

    /**
     * Инициализация кастомной логики для способности
     */
    static setupAbility(hero: CDOTA_BaseNPC_Hero, abilityName: string): void {
        const modifierName = this.ABILITY_MODIFIERS[abilityName];
        
        if (modifierName !== undefined) {
            print(`[AbilityCustomizer] Applying custom modifier ${modifierName} for ${abilityName}`);
            
            // Применяем модификатор который будет отслеживать поведение способности
            hero.AddNewModifier(hero, undefined, modifierName, {});
        }
    }

    /**
     * Проверка всех способностей героя и применение кастомной логики
     */
    static setupHeroAbilities(hero: CDOTA_BaseNPC_Hero): void {
        for (let i = 0; i < hero.GetAbilityCount(); i++) {
            const ability = hero.GetAbilityByIndex(i);
            if (ability) {
                const abilityName = ability.GetAbilityName();
                this.setupAbility(hero, abilityName);
            }
        }
    }

    /**
     * Применить ко всем героям на карте
     */
    static setupAllHeroes(): void {
        const heroes = Entities.FindAllByClassname("npc_dota_hero") as CDOTA_BaseNPC_Hero[];
        for (const hero of heroes) {
            if (hero && IsValidEntity(hero) && hero.IsRealHero()) {
                this.setupHeroAbilities(hero);
            }
        }
    }
}

