/**
 * Кастомизация героя Axe
 *
 * ВАЖНО: Этот файл для врожденных особенностей САМОГО ГЕРОЯ Axe,
 * а НЕ для его способностей!
 */

export const AxeConfig = {
    heroName: "npc_dota_hero_axe",

    /**
     * Логика при спавне Axe
     * Например: дать бонусную броню, врожденную регенерацию и т.д.
     */
    onSpawn(hero: CDOTA_BaseNPC_Hero): void {
        print(`Axe spawned`);

        // Пример: дать Axe бонусную броню на старте
        // hero.AddNewModifier(hero, undefined, "modifier_bonus_armor", {});

        // Или добавить врожденную способность
        // hero.AddAbility("axe_battle_hunger_innate");
    },

    onDeath(hero: CDOTA_BaseNPC_Hero): void {
        print(`Axe died`);

        // Пример: спавнить эффект при смерти
        // ParticleManager.CreateParticle(...)
    }
};


