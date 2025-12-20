import { GAME_CONSTANTS } from "../config/game-constants";

/**
 * Управление назначением команд
 */
export class TeamAssignment {
    private playerTeams: Map<PlayerID, DotaTeam> = new Map();

    getPlayerTeam(playerID: PlayerID): DotaTeam | undefined {
        return this.playerTeams.get(playerID);
    }

    setPlayerTeam(playerID: PlayerID, team: DotaTeam): void {
        this.playerTeams.set(playerID, team);
    }

    assignTeamToPlayer(playerID: PlayerID): DotaTeam {
        const team = this.getAvailableTeam();
        this.playerTeams.set(playerID, team);
        return team;
    }

    getAllPlayerTeams(): Map<PlayerID, DotaTeam> {
        return this.playerTeams;
    }

    private getAvailableTeam(): DotaTeam {
        const usedTeams = new Set(this.playerTeams.values());
        for (let i = 0; i < GAME_CONSTANTS.MAX_PLAYERS; i++) {
            const team = (DotaTeam.CUSTOM_1 + i) as DotaTeam;
            if (!usedTeams.has(team)) {
                return team;
            }
        }
        return DotaTeam.CUSTOM_1;
    }
}

