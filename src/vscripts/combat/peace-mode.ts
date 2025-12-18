import { GAME_CONSTANTS } from "../config/game-constants";

/**
 * Управление мирным режимом (без боя)
 */
export class PeaceMode {
    private isPeaceMode: boolean = true;

    isEnabled(): boolean {
        return this.isPeaceMode;
    }

    enable(): void {
        this.isPeaceMode = true;
    }

    disable(): void {
        this.isPeaceMode = false;
    }

    /**
     * Применить мирный режим к герою
     */
    applyToHero(hero: CDOTA_BaseNPC_Hero): void {
        hero.SetIdleAcquire(false);
        hero.SetAcquisitionRange(0);
        hero.AddNewModifier(hero, undefined, "modifier_disarmed", {});
    }

    /**
     * Снять мирный режим с героя
     */
    removeFromHero(hero: CDOTA_BaseNPC_Hero): void {
        // На некоторых стадиях/спавнах disarm может повеситься несколько раз.
        // RemoveModifierByName() не всегда гарантирует снятие всех экземпляров, поэтому чистим в цикле.
        while (hero.HasModifier("modifier_disarmed")) {
            hero.RemoveModifierByName("modifier_disarmed");
        }
        hero.SetIdleAcquire(true);
        hero.SetAcquisitionRange(GAME_CONSTANTS.DEFAULT_ACQUISITION_RANGE);
    }

    /**
     * Применить мирный режим ко всем героям
     */
    applyToAll(): void {
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            
            const hero = PlayerResource.GetSelectedHeroEntity(i);
            if (hero && IsValidEntity(hero)) {
                this.applyToHero(hero);
            }
        }
    }
}

