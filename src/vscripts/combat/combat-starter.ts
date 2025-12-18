import { GAME_CONSTANTS } from "../config/game-constants";
import { PeaceMode } from "./peace-mode";
import { BotManager } from "../bots/bot-manager";
import { TeamAssignment } from "../players/team-assignment";
import { PlayerManager } from "../players/player-manager";

/**
 * Запуск боя
 */
export class CombatStarter {
    constructor(
        private peaceMode: PeaceMode,
        private botManager: BotManager,
        private teamAssignment: TeamAssignment,
        private playerManager: PlayerManager
    ) {}

    /**
     * Начать боевую фазу
     */
    startCombat(): void {
        print("=== Starting combat phase - everyone is now enemies! ===");
        
        this.botManager.enableBotCombat();
        this.peaceMode.disable();

        // Возвращаем всех в свои команды
        this.assignPlayersToTeams();
        
        // Заставляем всех атаковать
        this.issueAttackOrders();
    }

    /**
     * Назначить игроков в их команды
     */
    private assignPlayersToTeams(): void {
        const playerHeroes = this.playerManager.getAllPlayerHeroes();
        
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            
            const hero = playerHeroes.get(i as PlayerID);
            const team = this.teamAssignment.getPlayerTeam(i as PlayerID) || (DotaTeam.CUSTOM_1 + i) as DotaTeam;
            
            if (hero && IsValidEntity(hero)) {
                hero.SetTeam(team);
                this.peaceMode.removeFromHero(hero);
                print(`Player ${i} set to team ${team} - now enemies!`);
            } else {
                print(`✗ Hero not found for player ${i}`);
            }
        }
    }

    /**
     * Отдать приказ всем атаковать
     */
    private issueAttackOrders(): void {
        const playerHeroes = this.playerManager.getAllPlayerHeroes();
        const c = Entities.FindByClassname(undefined, "info_player_start_dota")?.GetAbsOrigin();
        const center = c ? Vector(c.x, c.y, c.z) : Vector(0, 0, 128);
        
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            
            const hero = playerHeroes.get(i as PlayerID);
            if (!hero || !IsValidEntity(hero) || !hero.IsAlive()) continue;

            // Нормализуем origin (иногда возвращается vectorws)
            const ho = hero.GetAbsOrigin();
            const heroOrigin = Vector(ho.x, ho.y, ho.z);

            const enemies = FindUnitsInRadius(
                hero.GetTeamNumber(),
                heroOrigin,
                undefined,
                GAME_CONSTANTS.COMBAT_SEARCH_RADIUS,
                UnitTargetTeam.ENEMY,
                UnitTargetType.HERO,
                UnitTargetFlags.NONE,
                FindOrder.CLOSEST,
                false
            );

            if (enemies.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: hero.entindex(),
                    OrderType: UnitOrder.ATTACK_TARGET,
                    TargetIndex: enemies[0].entindex(),
                });
            } else {
                ExecuteOrderFromTable({
                    UnitIndex: hero.entindex(),
                    OrderType: UnitOrder.ATTACK_MOVE,
                    Position: center,
                });
            }
        }
    }
}

