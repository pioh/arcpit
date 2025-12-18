import { TeamAssignment } from "../players/team-assignment";

/**
 * Управление ботами
 */
export class BotManager {
    private botCombatEnabled: boolean = false;
    private botAdded: boolean = false;

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

    wasBotAdded(): boolean {
        return this.botAdded;
    }

    /**
     * Добавление бота в игру
     */
    addBot(): void {
        const team = this.teamAssignment.assignTeamToPlayer(-1 as PlayerID);

        print(`Adding bot player on team ${team}...`);
        
        const botHero = GameRules.AddBotPlayerWithEntityScript(
            "npc_dota_hero_wisp", // временный герой
            "ArcpitBot",
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
            // Назначаем команду боту
            const state = GameRules.State_Get();
            if (state <= GameState.CUSTOM_GAME_SETUP) {
                PlayerResource.SetCustomTeamAssignment(botPlayerID, team);
            }
            print(`✓ Bot created. PlayerID=${botPlayerID}, team=${team}`);
        } else {
            print("WARNING: Bot hero has no PlayerID");
        }

        this.botAdded = true;
    }

    /**
     * Автоматическое добавление бота если игрок один
     */
    tryAddBotIfSinglePlayer(humanPlayerCount: number): void {
        if (!this.botAdded && humanPlayerCount === 1) {
            this.addBot();
        }
    }
}

