import { GAME_CONSTANTS } from "./game-constants";

/**
 * Настройка правил игры
 */
export function configureGameRules(): void {
    print("=== Configuring GameRules ===");
    
    // Основные правила
    GameRules.SetHeroRespawnEnabled(false);
    GameRules.SetUseUniversalShopMode(true);
    GameRules.SetSameHeroSelectionEnabled(true);
    
    // Пропускаем стандартный пик героев
    GameRules.SetHeroSelectionTime(0);
    GameRules.SetStrategyTime(0);
    GameRules.SetShowcaseTime(0);
    GameRules.SetPreGameTime(3);
    GameRules.SetCustomGameSetupAutoLaunchDelay(0);
    GameRules.SetCustomGameSetupTimeout(0);
    
    // Экономика
    GameRules.SetStartingGold(GAME_CONSTANTS.STARTING_GOLD);
    GameRules.SetGoldPerTick(GAME_CONSTANTS.GOLD_PER_TICK);
    GameRules.SetGoldTickTime(GAME_CONSTANTS.GOLD_TICK_TIME);
    
    print("=== GameRules configured ===");
}

/**
 * Настройка игрового режима
 */
export function configureGameMode(): void {
    const gameMode = GameRules.GetGameModeEntity();
    
    gameMode.SetBuybackEnabled(false);
    gameMode.SetTopBarTeamValuesVisible(false);
    gameMode.SetAnnouncerDisabled(true);
    gameMode.SetKillingSpreeAnnouncerDisabled(true);
    gameMode.SetRecommendedItemsDisabled(true);
    gameMode.SetBotThinkingEnabled(false);
    
    // Всегда видна вся карта (убрать fog of war)
    gameMode.SetFogOfWarDisabled(true);
    gameMode.SetUnseenFogOfWarEnabled(false);
    
    // Временный герой для форс-спавна
    gameMode.SetCustomGameForceHero("npc_dota_hero_wisp");
}

/**
 * Настройка команд
 */
export function configureTeams(): void {
    // Только CUSTOM_1..CUSTOM_8
    for (let i = 0; i < GAME_CONSTANTS.MAX_PLAYERS; i++) {
        const team = (DotaTeam.CUSTOM_1 + i) as DotaTeam;
        GameRules.SetCustomGameTeamMaxPlayers(team, 1);
    }
}

