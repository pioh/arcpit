import { TeamAssignment } from "./team-assignment";
import { GAME_CONSTANTS } from "../config/game-constants";

/**
 * Управление игроками
 */
export class PlayerManager {
    private playerHeroes: Map<PlayerID, CDOTA_BaseNPC_Hero> = new Map();

    constructor(
        private teamAssignment: TeamAssignment
    ) {}

    getPlayerHero(playerID: PlayerID): CDOTA_BaseNPC_Hero | undefined {
        return this.playerHeroes.get(playerID);
    }

    setPlayerHero(playerID: PlayerID, hero: CDOTA_BaseNPC_Hero): void {
        this.playerHeroes.set(playerID, hero);
    }

    getAllPlayerHeroes(): Map<PlayerID, CDOTA_BaseNPC_Hero> {
        return this.playerHeroes;
    }

    /**
     * Обработка подключения игрока
     */
    onPlayerConnected(playerID: PlayerID): void {
        print(`Player ${playerID} connected`);
        
        // Назначаем команду
        const teamID = this.teamAssignment.assignTeamToPlayer(playerID);

        // Назначаем команду в движке (только в фазе сетапа)
        const state = GameRules.State_Get();
        if (state <= GameState.CUSTOM_GAME_SETUP) {
            PlayerResource.SetCustomTeamAssignment(playerID, teamID);
            print(`Assigned player ${playerID} to team ${teamID}`);
        } else {
            print(`WARNING: Player ${playerID} connected too late (state=${state})`);
        }
    }

    /**
     * Подсчёт живых игроков (не ботов)
     */
    getHumanPlayerCount(): number {
        let count = 0;
        for (let i = 0; i < PlayerResource.GetPlayerCount(); i++) {
            if (PlayerResource.IsValidPlayerID(i) && !PlayerResource.IsFakeClient(i)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Выдача золота всем игрокам
     */
    giveGoldToAll(amount: number): void {
        for (let i = 0; i < 64; i++) {
            if (!PlayerResource.IsValidPlayerID(i)) continue;
            PlayerResource.SetGold(i as PlayerID, amount, true);
        }
    }

    /**
     * Запрет шэринга юнитов между игроками
     */
    disableUnitSharing(): void {
        for (let a = 0; a < 64; a++) {
            if (!PlayerResource.IsValidPlayerID(a)) continue;
            for (let b = 0; b < 64; b++) {
                if (!PlayerResource.IsValidPlayerID(b)) continue;
                if (a === b) continue;
                for (let f = 0; f < 32; f++) {
                    PlayerResource.SetUnitShareMaskForPlayer(a as PlayerID, b as PlayerID, f, false);
                }
            }
        }
    }

    /**
     * Сохранение текущих героев игроков
     */
    saveCurrentHeroes(): void {
        for (let i = 0; i < PlayerResource.GetPlayerCount(); i++) {
            if (PlayerResource.IsValidPlayerID(i)) {
                const hero = PlayerResource.GetSelectedHeroEntity(i);
                if (hero && IsValidEntity(hero)) {
                    this.playerHeroes.set(i as PlayerID, hero);
                }
            }
        }
    }
}

