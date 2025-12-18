/**
 * Кастомизация способности Axe Culling Blade
 * Здесь можно настроить специфичную логику для этой способности
 */

export const CullingBladeConfig = {
    abilityName: "axe_culling_blade",
    
    // Кастомные параметры
    customParams: {
        bonusDamage: 0,
        executeThreshold: 250,
    },
    
    // Особое поведение способности
    onCast(caster: CDOTA_BaseNPC_Hero, target: CDOTA_BaseNPC): void {
        // Специальная логика при касте
        print(`Culling Blade cast by ${caster.GetUnitName()} on ${target.GetUnitName()}`);
    }
};

