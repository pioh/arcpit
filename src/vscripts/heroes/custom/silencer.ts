/**
 * Кастомизация героя Silencer
 * 
 * ВАЖНО: Этот файл для кастомизации САМОГО ГЕРОЯ Silencer,
 * а не его способностей! Способности работают независимо от героя.
 * 
 * Например, здесь можно настроить:
 * - Врожденную пассивку Silencer (Int Steal on Death)
 * - Особые характеристики героя
 * - Логику при спавне/смерти конкретно для Silencer
 * 
 * Glaives of Wisdom настраивается в:
 * - modifiers/modifier_glaives_temp_int.ts (работает у ЛЮБОГО героя)
 * - abilities/ability-customizer.ts (автоматически применяется)
 */

export const SilencerConfig = {
    heroName: "npc_dota_hero_silencer",
    
    /**
     * Логика при спавне Silencer
     * Например, можно дать врожденную пассивку на кражу инта при смерти врагов
     */
    onSpawn(hero: CDOTA_BaseNPC_Hero): void {
        print(`Silencer spawned`);
        
        // Пример: добавить врожденную способность Silencer (Int Steal on Death)
        // hero.AddAbility("silencer_int_steal_passive");
    },
    
    onDeath(hero: CDOTA_BaseNPC_Hero): void {
        print(`Silencer died`);
    }
};
