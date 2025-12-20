import { TeamAssignment } from "../players/team-assignment";

/**
 * Управление ботами
 */
export class BotManager {
    private botCombatEnabled: boolean = false;
    private botPlayerIDs: PlayerID[] = [];
    private nextPseudoID: number = -1;

    constructor(
        private teamAssignment: TeamAssignment
    ) {}

    isBotCombatEnabled(): boolean {
        return this.botCombatEnabled;
    }

    enableBotCombat(): void {
        this.botCombatEnabled = true;
    }

    disableBotCombat(): void {
        this.botCombatEnabled = false;
    }

    getBotPlayerIDs(): PlayerID[] {
        return [...this.botPlayerIDs];
    }

    getBotCount(): number {
        return this.botPlayerIDs.length;
    }

    /**
     * Добавление бота в игру
     */
    addBot(name: string = "ArcpitBot"): PlayerID | undefined {
        // TeamAssignment требует уникальный ключ — для ботов используем отрицательные pseudo-id
        const pseudoID = this.nextPseudoID as PlayerID;
        this.nextPseudoID--;

        const team = this.teamAssignment.assignTeamToPlayer(pseudoID);
        print(`Adding bot player "${name}" on team ${team}...`);
        
        const botHero = GameRules.AddBotPlayerWithEntityScript(
            "npc_dota_hero_wisp", // временный герой
            name,
            team as unknown as DOTATeam_t,
            "bot/arcpit_bot_ai.lua",
            false
        );

        if (!botHero) {
            print("✗ Failed to create bot player");
            return;
        }

        const botPlayerID = botHero.GetPlayerID();
        if (botPlayerID !== undefined) {
            this.teamAssignment.setPlayerTeam(botPlayerID, team);
            // Назначаем команду боту
            const state = GameRules.State_Get();
            if (state <= GameState.CUSTOM_GAME_SETUP) {
                PlayerResource.SetCustomTeamAssignment(botPlayerID, team);
            }
            print(`✓ Bot created. PlayerID=${botPlayerID}, team=${team}`);
            this.botPlayerIDs.push(botPlayerID);
            return botPlayerID;
        } else {
            print("WARNING: Bot hero has no PlayerID");
        }
        return undefined;
    }

    /**
     * Автоматически добить игроков ботами до maxPlayers,
     * используя список реально подключённых людей (не полагаясь на 0..maxPlayers-1).
     */
    ensureBotsToFillFromConnectedHumans(maxPlayers: number, connectedHumanPlayerIDs: PlayerID[]): void {
        const currentHumans = connectedHumanPlayerIDs.length;
        const currentBots = this.getBotCount();
        const need = math.max(0, maxPlayers - (currentHumans + currentBots));
        if (need <= 0) return;

        print(`ensureBotsToFillFromConnectedHumans: humans=${currentHumans}, bots=${currentBots}, max=${maxPlayers}, need=${need}`);
        for (let k = 0; k < need; k++) {
            this.addBot(`Bot${k + 1}`);
        }
    }
}

