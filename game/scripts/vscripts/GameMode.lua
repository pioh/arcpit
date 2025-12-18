local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 2,["11"] = 2,["12"] = 3,["13"] = 3,["14"] = 3,["15"] = 3,["16"] = 4,["17"] = 4,["18"] = 5,["19"] = 5,["20"] = 6,["21"] = 6,["22"] = 7,["23"] = 7,["24"] = 8,["25"] = 8,["26"] = 9,["27"] = 9,["28"] = 10,["29"] = 10,["30"] = 11,["31"] = 11,["32"] = 12,["33"] = 12,["34"] = 13,["35"] = 13,["36"] = 14,["37"] = 14,["38"] = 15,["39"] = 15,["40"] = 16,["41"] = 16,["42"] = 17,["43"] = 17,["44"] = 18,["45"] = 18,["46"] = 19,["47"] = 19,["48"] = 20,["49"] = 20,["50"] = 21,["51"] = 21,["54"] = 33,["55"] = 34,["56"] = 33,["58"] = 50,["59"] = 51,["60"] = 54,["61"] = 56,["62"] = 57,["63"] = 74,["64"] = 77,["65"] = 80,["66"] = 83,["67"] = 85,["68"] = 73,["69"] = 62,["70"] = 63,["71"] = 62,["72"] = 69,["73"] = 70,["74"] = 69,["75"] = 91,["76"] = 93,["77"] = 94,["78"] = 95,["79"] = 96,["80"] = 99,["81"] = 100,["82"] = 103,["83"] = 104,["84"] = 107,["85"] = 114,["86"] = 117,["87"] = 120,["88"] = 120,["89"] = 120,["90"] = 120,["91"] = 120,["92"] = 120,["93"] = 125,["94"] = 126,["95"] = 126,["96"] = 126,["97"] = 126,["98"] = 126,["99"] = 126,["100"] = 131,["101"] = 133,["102"] = 133,["103"] = 133,["104"] = 133,["105"] = 133,["106"] = 133,["107"] = 133,["108"] = 133,["109"] = 140,["110"] = 143,["111"] = 143,["112"] = 143,["113"] = 143,["114"] = 143,["115"] = 143,["116"] = 143,["117"] = 143,["118"] = 143,["119"] = 91,["120"] = 156,["121"] = 157,["122"] = 159,["123"] = 160,["124"] = 161,["125"] = 164,["126"] = 165,["127"] = 165,["128"] = 165,["129"] = 165,["130"] = 165,["131"] = 165,["132"] = 156,["133"] = 171,["134"] = 172,["135"] = 172,["136"] = 172,["137"] = 172,["138"] = 172,["139"] = 173,["140"] = 173,["141"] = 173,["142"] = 173,["143"] = 173,["144"] = 174,["145"] = 174,["146"] = 174,["147"] = 174,["148"] = 174,["149"] = 175,["150"] = 175,["151"] = 175,["152"] = 175,["153"] = 175,["154"] = 178,["155"] = 178,["156"] = 178,["157"] = 178,["158"] = 179,["159"] = 179,["160"] = 179,["161"] = 179,["162"] = 171,["163"] = 185,["164"] = 186,["165"] = 187,["166"] = 189,["167"] = 190,["169"] = 193,["170"] = 194,["171"] = 195,["172"] = 195,["173"] = 195,["174"] = 196,["175"] = 197,["176"] = 195,["177"] = 195,["179"] = 185,["180"] = 205,["181"] = 206,["182"] = 208,["183"] = 208,["184"] = 208,["185"] = 211,["186"] = 212,["187"] = 213,["188"] = 214,["190"] = 217,["191"] = 218,["192"] = 219,["193"] = 208,["194"] = 208,["195"] = 205,["196"] = 226,["197"] = 227,["198"] = 229,["199"] = 231,["200"] = 233,["201"] = 234,["202"] = 235,["203"] = 236,["205"] = 241,["206"] = 226,["207"] = 247,["208"] = 248,["209"] = 247,["210"] = 254,["211"] = 255,["214"] = 256,["215"] = 258,["216"] = 259,["217"] = 263,["219"] = 263,["220"] = 263,["223"] = 264,["224"] = 265,["226"] = 269,["227"] = 270,["228"] = 271,["230"] = 275,["232"] = 275,["234"] = 278,["235"] = 279,["237"] = 280,["238"] = 280,["240"] = 281,["241"] = 281,["243"] = 282,["246"] = 280,["249"] = 284,["252"] = 254,["253"] = 289,["254"] = 290,["256"] = 290,["258"] = 289,["259"] = 296,["260"] = 297,["261"] = 296,["262"] = 303,["263"] = 304,["264"] = 303,["265"] = 310,["266"] = 312,["267"] = 315,["268"] = 316,["269"] = 317,["270"] = 310,["271"] = 323,["272"] = 324,["273"] = 323,["274"] = 33,["275"] = 34});
local ____exports = {}
local ____tstl_2Dutils = require("lib.tstl-utils")
local reloadable = ____tstl_2Dutils.reloadable
local ____hero_2Dpool = require("heroes.hero-pool")
local precacheHeroes = ____hero_2Dpool.precacheHeroes
local ____game_2Drules = require("config.game-rules")
local configureGameRules = ____game_2Drules.configureGameRules
local configureGameMode = ____game_2Drules.configureGameMode
local configureTeams = ____game_2Drules.configureTeams
local ____team_2Dassignment = require("players.team-assignment")
local TeamAssignment = ____team_2Dassignment.TeamAssignment
local ____player_2Dmanager = require("players.player-manager")
local PlayerManager = ____player_2Dmanager.PlayerManager
local ____bot_2Dmanager = require("bots.bot-manager")
local BotManager = ____bot_2Dmanager.BotManager
local ____peace_2Dmode = require("combat.peace-mode")
local PeaceMode = ____peace_2Dmode.PeaceMode
local ____hero_2Dmanager = require("heroes.hero-manager")
local HeroManager = ____hero_2Dmanager.HeroManager
local ____ability_2Dmanager = require("abilities.ability-manager")
local AbilityManager = ____ability_2Dmanager.AbilityManager
local ____spawn_2Dmanager = require("map.spawn-manager")
local SpawnManager = ____spawn_2Dmanager.SpawnManager
local ____shopkeeper = require("map.shopkeeper")
local ShopkeeperManager = ____shopkeeper.ShopkeeperManager
local ____stage_2Dmanager = require("game-stages.stage-manager")
local StageManager = ____stage_2Dmanager.StageManager
local ____hero_2Dselection = require("game-stages.hero-selection")
local HeroSelectionStage = ____hero_2Dselection.HeroSelectionStage
local ____ability_2Dselection = require("game-stages.ability-selection")
local AbilitySelectionStage = ____ability_2Dselection.AbilitySelectionStage
local ____pre_2Dcombat = require("game-stages.pre-combat")
local PreCombatStage = ____pre_2Dcombat.PreCombatStage
local ____combat = require("game-stages.combat")
local CombatStage = ____combat.CombatStage
local ____main = require("scenarios.main")
local ScenarioManager = ____main.ScenarioManager
local ____round_2Dcontroller = require("rounds.round-controller")
local RoundController = ____round_2Dcontroller.RoundController
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
local ____ai_2Dtakeover_2Dcontroller = require("bots.ai-takeover-controller")
local AiTakeoverController = ____ai_2Dtakeover_2Dcontroller.AiTakeoverController
local ____lighting_2Dmanager = require("map.lighting-manager")
local LightingManager = ____lighting_2Dmanager.LightingManager
--- Главный класс игрового режима
-- Координирует работу всех подсистем
____exports.GameMode = __TS__Class()
local GameMode = ____exports.GameMode
GameMode.name = "GameMode"
function GameMode.prototype.____constructor(self)
    self.botsFilled = false
    self.thinkDtAcc = 0
    self.botCombatEnabled = false
    self.isRoundActive = false
    self.currentRound = 0
    print("=== Initializing GameMode ===")
    self:initializeSystems()
    self:configure()
    self:setupEventListeners()
    print("=== GameMode initialized ===")
end
function GameMode.Precache(context)
    precacheHeroes(nil, context)
end
function GameMode.Activate()
    GameRules.Addon = __TS__New(____exports.GameMode)
end
function GameMode.prototype.initializeSystems(self)
    self.teamAssignment = __TS__New(TeamAssignment)
    self.playerManager = __TS__New(PlayerManager, self.teamAssignment)
    self.botManager = __TS__New(BotManager, self.teamAssignment)
    self.peaceMode = __TS__New(PeaceMode)
    self.heroManager = __TS__New(HeroManager, self.playerManager, self.teamAssignment, self.peaceMode)
    self.abilityManager = __TS__New(AbilityManager, self.playerManager)
    self.spawnManager = __TS__New(SpawnManager, self.peaceMode)
    self.shopkeeperManager = __TS__New(ShopkeeperManager)
    self.roundController = __TS__New(RoundController, self.playerManager, self.spawnManager, self.peaceMode)
    self.aiTakeover = __TS__New(AiTakeoverController, self.playerManager)
    self.lighting = __TS__New(LightingManager)
    local heroSelectionStage = __TS__New(
        HeroSelectionStage,
        self.heroManager,
        self.spawnManager,
        self.playerManager:getAllPlayerHeroes()
    )
    local abilitySelectionStage = __TS__New(AbilitySelectionStage, self.abilityManager)
    local preCombatStage = __TS__New(
        PreCombatStage,
        self.spawnManager,
        self.shopkeeperManager,
        self.playerManager:getAllPlayerHeroes()
    )
    local combatStage = __TS__New(CombatStage, self.roundController)
    self.stageManager = __TS__New(
        StageManager,
        heroSelectionStage,
        abilitySelectionStage,
        preCombatStage,
        combatStage,
        self.roundController
    )
    self.roundController:setStageManager(self.stageManager)
    self.scenarioManager = __TS__New(
        ScenarioManager,
        self.playerManager,
        self.spawnManager,
        self.heroManager,
        self.abilityManager,
        self.peaceMode,
        self.stageManager
    )
end
function GameMode.prototype.configure(self)
    print("=== Configuring Game ===")
    configureGameRules(nil)
    configureGameMode(nil)
    configureTeams(nil)
    local gameMode = GameRules:GetGameModeEntity()
    gameMode:SetThink(
        function() return self:onThink() end,
        self,
        "GameThink",
        0.1
    )
end
function GameMode.prototype.setupEventListeners(self)
    ListenToGameEvent(
        "game_rules_state_change",
        function() return self:onStateChange() end,
        nil
    )
    ListenToGameEvent(
        "npc_spawned",
        function(event) return self:onNpcSpawned(event) end,
        nil
    )
    ListenToGameEvent(
        "player_connect_full",
        function(event) return self:onPlayerConnected(event) end,
        nil
    )
    ListenToGameEvent(
        "entity_killed",
        function(event) return self:onEntityKilled(event) end,
        nil
    )
    CustomGameEventManager:RegisterListener(
        "hero_selected",
        function(_, data) return self:onHeroSelected(data) end
    )
    CustomGameEventManager:RegisterListener(
        "abilities_selected",
        function(_, data) return self:onAbilitiesSelected(data) end
    )
end
function GameMode.prototype.onStateChange(self)
    local state = GameRules:State_Get()
    print(("=== Game state changed to: " .. tostring(state)) .. " ===")
    if state == DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP then
        self:handleCustomGameSetup()
    end
    if state == DOTA_GAMERULES_STATE_PRE_GAME then
        print("PRE_GAME state - starting custom game")
        Timers:CreateTimer(
            2,
            function()
                self:startGame()
                return nil
            end
        )
    end
end
function GameMode.prototype.handleCustomGameSetup(self)
    print("CUSTOM_GAME_SETUP state - auto finishing...")
    Timers:CreateTimer(
        0.1,
        function()
            if not self.botsFilled then
                local connectedHumans = self.playerManager:getConnectedHumanPlayerIDs()
                self.botManager:ensureBotsToFillFromConnectedHumans(GAME_CONSTANTS.MAX_PLAYERS, connectedHumans)
                self.botsFilled = true
            end
            print("Finishing custom game setup...")
            GameRules:FinishCustomGameSetup()
            return nil
        end
    )
end
function GameMode.prototype.startGame(self)
    print("=== Game starting! ===")
    self.lighting:ensureLights()
    self.botManager:disableBotCombat()
    if not self.botsFilled then
        local connectedHumans = self.playerManager:getConnectedHumanPlayerIDs()
        self.botManager:ensureBotsToFillFromConnectedHumans(GAME_CONSTANTS.MAX_PLAYERS, connectedHumans)
        self.botsFilled = true
    end
    self.scenarioManager:startSelectedScenario()
end
function GameMode.prototype.onPlayerConnected(self, event)
    self.playerManager:onPlayerConnected(event.PlayerID)
end
function GameMode.prototype.onNpcSpawned(self, event)
    if event.entindex == nil then
        return
    end
    local unit = EntIndexToHScript(event.entindex)
    if unit:IsRealHero() then
        print("Hero spawned: " .. unit:GetUnitName())
        local ____temp_2 = not self.isRoundActive
        if ____temp_2 then
            local ____opt_0 = self.peaceMode
            ____temp_2 = ____opt_0 and ____opt_0:isEnabled()
        end
        if ____temp_2 then
            local hero = unit
            self.peaceMode:applyToHero(hero)
        end
        local hero = unit
        if not hero:HasModifier("modifier_temp_int_buckets") then
            hero:AddNewModifier(hero, nil, "modifier_temp_int_buckets", {})
        end
        local ____opt_3 = self.roundController
        if ____opt_3 ~= nil then
            ____opt_3:onNpcSpawned(hero)
        end
        local pid = hero:GetPlayerID()
        if pid ~= nil then
            do
                local p = 0
                while p < 64 do
                    do
                        if not PlayerResource:IsValidPlayerID(p) then
                            goto __continue32
                        end
                        hero:SetControllableByPlayer(p, false)
                    end
                    ::__continue32::
                    p = p + 1
                end
            end
            hero:SetControllableByPlayer(pid, true)
        end
    end
end
function GameMode.prototype.onEntityKilled(self, event)
    local ____opt_5 = self.roundController
    if ____opt_5 ~= nil then
        ____opt_5:onEntityKilled(event)
    end
end
function GameMode.prototype.onHeroSelected(self, data)
    print(("Player " .. tostring(data.PlayerID)) .. " selected hero")
end
function GameMode.prototype.onAbilitiesSelected(self, data)
    print(("Player " .. tostring(data.PlayerID)) .. " selected abilities")
end
function GameMode.prototype.onThink(self)
    self.botCombatEnabled = self.botManager:isBotCombatEnabled()
    self.thinkDtAcc = self.thinkDtAcc + 0.1
    self.aiTakeover:tick(0.1, self.isRoundActive)
    return 0.1
end
function GameMode.prototype.Reload(self)
    print("Script reloaded!")
end
GameMode = __TS__Decorate(GameMode, GameMode, {reloadable}, {kind = "class", name = "GameMode"})
____exports.GameMode = GameMode
return ____exports
