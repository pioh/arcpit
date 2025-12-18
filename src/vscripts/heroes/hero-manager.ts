import { HERO_POOL } from "./hero-pool";
import { PlayerManager } from "../players/player-manager";
import { TeamAssignment } from "../players/team-assignment";
import { PeaceMode } from "../combat/peace-mode";

/**
 * Управление героями
 */
export class HeroManager {
    constructor(
        private playerManager: PlayerManager,
        private teamAssignment: TeamAssignment,
        private peaceMode: PeaceMode
    ) {}

    /**
     * Автоматический выбор героев для всех игроков
     */
    autoSelectForAllPlayers(onComplete?: () => void): void {
        print("=== Auto-selecting heroes for all players ===");

        // Проверяем что у всех есть текущий герой для замены
        let pending = 0;
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            
            const current = PlayerResource.GetSelectedHeroEntity(i);
            if (!current || !IsValidEntity(current)) {
                pending++;
                continue;
            }

            const team = this.teamAssignment.getPlayerTeam(i as PlayerID) || (DotaTeam.CUSTOM_1 + i) as DotaTeam;

            // Facets в Source2: если у игрока выбран facet, которого нет у нового героя — ReplaceHeroWith падает.
            // В логах: "facet=1 is invalid". На практике API сброса facet может быть не всегда доступен,
            // поэтому делаем несколько попыток ReplaceHeroWith с разными героями.
            let replaced: CDOTA_BaseNPC_Hero | undefined;
            const maxAttempts = 12;
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                const randomHero = this.getRandomHero();

                // best-effort: попробуем сбросить facet (если API есть)
                try { (PlayerResource as any).SetSelectedHeroFacet(i, 0); } catch (e) {}
                try { (PlayerResource as any).SetSelectedHero(i, randomHero); } catch (e) {}

                print(`Replacing hero attempt ${attempt}/${maxAttempts}: ${randomHero} for player ${i} on team ${team}`);

                const hero = PlayerResource.ReplaceHeroWith(i, randomHero, 0, 0);
                if (hero) {
                    replaced = hero;
                    break;
                }
            }

            if (replaced) {
                // Все друзья до боя
                replaced.SetTeam(DotaTeam.CUSTOM_1);
                replaced.SetControllableByPlayer(i, true);
                this.playerManager.setPlayerHero(i as PlayerID, replaced);
                this.peaceMode.applyToHero(replaced);
                print(`✓ Hero replaced for player ${i}`);
            } else {
                print(`✗ Failed to replace hero for player ${i} after retries (facet issue?)`);
            }
        }

        if (pending > 0) {
            print(`AutoSelectHeroes: ${pending} players without hero, retrying...`);
            Timers.CreateTimer(0.25, () => {
                this.autoSelectForAllPlayers(onComplete);
                return undefined;
            });
            return;
        }

        // Даем движку обновиться
        Timers.CreateTimer(0.5, () => {
            this.playerManager.saveCurrentHeroes();
            if (onComplete) onComplete();
            return undefined;
        });
    }

    private getRandomHero(): string {
        return HERO_POOL[RandomInt(0, HERO_POOL.length - 1)];
    }
}

