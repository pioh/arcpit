import { GAME_CONSTANTS } from "../config/game-constants";

/**
 * Управление мирным режимом (без боя)
 */
export class PeaceMode {
    private isPeaceMode: boolean = true;
    private readonly modifierName: string = "modifier_arcpit_peace_mode";

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
        // В нейтральной зоне нам не нужно "запрещать игру": игроки должны уметь жать абилки/предметы.
        // Ставим только мягкие ограничения на авто-агр, а безопасность (без урона герой-в-героя) решаем через союзные команды + damage filter.
        hero.SetIdleAcquire(false);
        hero.SetAcquisitionRange(0);
    }

    /**
     * Снять мирный режим с героя
     */
    removeFromHero(hero: CDOTA_BaseNPC_Hero): void {
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

