local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__StringReplace = ____lualib.__TS__StringReplace
local __TS__Number = ____lualib.__TS__Number
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["11"] = 1,["12"] = 1,["13"] = 2,["14"] = 2,["15"] = 2,["16"] = 3,["17"] = 3,["18"] = 3,["19"] = 3,["20"] = 4,["21"] = 4,["22"] = 5,["23"] = 5,["24"] = 6,["25"] = 6,["26"] = 7,["27"] = 7,["28"] = 8,["29"] = 8,["30"] = 9,["31"] = 9,["32"] = 10,["33"] = 10,["34"] = 11,["35"] = 11,["36"] = 12,["37"] = 12,["38"] = 13,["39"] = 13,["40"] = 14,["41"] = 14,["42"] = 15,["43"] = 15,["44"] = 16,["45"] = 16,["46"] = 17,["47"] = 17,["48"] = 18,["49"] = 18,["50"] = 19,["51"] = 19,["52"] = 20,["53"] = 20,["54"] = 21,["55"] = 21,["56"] = 22,["57"] = 22,["60"] = 34,["61"] = 35,["62"] = 34,["64"] = 53,["65"] = 54,["66"] = 55,["67"] = 56,["68"] = 59,["69"] = 61,["70"] = 62,["71"] = 106,["72"] = 109,["73"] = 112,["74"] = 115,["75"] = 117,["76"] = 105,["77"] = 67,["78"] = 68,["81"] = 74,["82"] = 74,["83"] = 74,["85"] = 74,["86"] = 75,["87"] = 76,["88"] = 77,["89"] = 78,["92"] = 80,["93"] = 81,["94"] = 82,["95"] = 83,["96"] = 83,["101"] = 86,["102"] = 87,["103"] = 88,["104"] = 88,["107"] = 90,["110"] = 91,["118"] = 67,["119"] = 101,["120"] = 102,["121"] = 101,["122"] = 123,["123"] = 125,["124"] = 126,["125"] = 127,["126"] = 128,["127"] = 131,["128"] = 132,["129"] = 135,["130"] = 136,["131"] = 137,["132"] = 138,["133"] = 138,["134"] = 138,["135"] = 138,["136"] = 138,["137"] = 138,["138"] = 138,["139"] = 138,["140"] = 147,["141"] = 154,["142"] = 157,["143"] = 160,["144"] = 163,["145"] = 163,["146"] = 163,["147"] = 163,["148"] = 163,["149"] = 163,["150"] = 168,["151"] = 170,["152"] = 170,["153"] = 170,["154"] = 170,["155"] = 170,["156"] = 170,["157"] = 170,["158"] = 176,["159"] = 179,["160"] = 179,["161"] = 179,["162"] = 179,["163"] = 179,["164"] = 179,["165"] = 179,["166"] = 179,["167"] = 179,["168"] = 123,["169"] = 192,["170"] = 193,["171"] = 195,["172"] = 196,["173"] = 197,["174"] = 200,["175"] = 201,["176"] = 201,["177"] = 201,["178"] = 201,["179"] = 201,["180"] = 201,["181"] = 192,["182"] = 207,["183"] = 208,["184"] = 208,["185"] = 208,["186"] = 208,["187"] = 208,["188"] = 209,["189"] = 209,["190"] = 209,["191"] = 209,["192"] = 209,["193"] = 210,["194"] = 210,["195"] = 210,["196"] = 210,["197"] = 210,["198"] = 211,["199"] = 211,["200"] = 211,["201"] = 211,["202"] = 211,["203"] = 212,["204"] = 212,["205"] = 212,["206"] = 212,["207"] = 212,["208"] = 215,["209"] = 215,["210"] = 215,["211"] = 215,["212"] = 216,["213"] = 216,["214"] = 216,["215"] = 216,["216"] = 217,["217"] = 217,["218"] = 217,["219"] = 217,["220"] = 218,["221"] = 218,["222"] = 218,["223"] = 218,["224"] = 207,["225"] = 224,["226"] = 225,["227"] = 226,["228"] = 228,["229"] = 229,["231"] = 232,["232"] = 234,["233"] = 235,["234"] = 235,["235"] = 235,["236"] = 236,["237"] = 238,["239"] = 239,["240"] = 239,["242"] = 240,["243"] = 241,["244"] = 241,["246"] = 242,["247"] = 243,["250"] = 244,["256"] = 247,["257"] = 248,["259"] = 250,["260"] = 235,["261"] = 235,["263"] = 224,["264"] = 258,["265"] = 259,["266"] = 261,["267"] = 261,["268"] = 261,["269"] = 264,["270"] = 265,["271"] = 266,["272"] = 267,["274"] = 272,["275"] = 274,["276"] = 276,["277"] = 276,["278"] = 276,["279"] = 279,["280"] = 280,["281"] = 281,["282"] = 282,["283"] = 276,["284"] = 276,["285"] = 285,["286"] = 261,["287"] = 261,["288"] = 258,["289"] = 292,["290"] = 293,["291"] = 295,["292"] = 297,["293"] = 299,["294"] = 300,["295"] = 301,["296"] = 302,["298"] = 307,["299"] = 292,["300"] = 313,["301"] = 314,["302"] = 313,["303"] = 320,["304"] = 321,["307"] = 322,["308"] = 324,["309"] = 325,["310"] = 329,["311"] = 330,["312"] = 330,["313"] = 330,["316"] = 331,["321"] = 332,["324"] = 333,["325"] = 330,["326"] = 330,["327"] = 336,["328"] = 336,["329"] = 336,["332"] = 337,["337"] = 338,["340"] = 339,["341"] = 336,["342"] = 336,["343"] = 345,["345"] = 345,["346"] = 345,["349"] = 346,["351"] = 350,["352"] = 351,["354"] = 355,["356"] = 355,["358"] = 358,["359"] = 359,["361"] = 360,["362"] = 360,["364"] = 361,["365"] = 361,["367"] = 362,["370"] = 360,["373"] = 364,["375"] = 370,["376"] = 371,["377"] = 372,["378"] = 373,["379"] = 374,["382"] = 375,["387"] = 381,["388"] = 382,["389"] = 383,["390"] = 384,["391"] = 384,["392"] = 384,["393"] = 385,["394"] = 386,["395"] = 384,["396"] = 384,["400"] = 320,["401"] = 393,["405"] = 395,["406"] = 395,["408"] = 396,["409"] = 397,["410"] = 397,["412"] = 398,["413"] = 399,["414"] = 399,["418"] = 400,["423"] = 395,["428"] = 393,["429"] = 409,["430"] = 410,["433"] = 412,["434"] = 415,["437"] = 417,["438"] = 417,["439"] = 417,["441"] = 417,["442"] = 418,["443"] = 419,["444"] = 420,["445"] = 421,["446"] = 421,["451"] = 426,["452"] = 427,["453"] = 428,["454"] = 429,["457"] = 432,["460"] = 434,["463"] = 435,["466"] = 435,["472"] = 436,["477"] = 439,["482"] = 440,["485"] = 409,["486"] = 447,["487"] = 448,["490"] = 450,["491"] = 451,["494"] = 453,["497"] = 453,["498"] = 453,["499"] = 453,["501"] = 453,["503"] = 453,["509"] = 456,["511"] = 457,["513"] = 457,["514"] = 457,["515"] = 457,["517"] = 457,["520"] = 458,["523"] = 459,["526"] = 459,["527"] = 459,["528"] = 459,["530"] = 459,["532"] = 459,["540"] = 462,["541"] = 462,["542"] = 462,["544"] = 462,["546"] = 462,["547"] = 463,["550"] = 465,["555"] = 466,["561"] = 470,["563"] = 447,["564"] = 474,["565"] = 475,["566"] = 476,["569"] = 477,["570"] = 474,["571"] = 480,["572"] = 481,["573"] = 481,["574"] = 481,["576"] = 481,["577"] = 482,["578"] = 482,["579"] = 482,["581"] = 482,["582"] = 483,["585"] = 484,["586"] = 484,["587"] = 484,["589"] = 484,["590"] = 485,["591"] = 486,["592"] = 487,["593"] = 488,["594"] = 488,["597"] = 490,["598"] = 490,["602"] = 492,["605"] = 494,["606"] = 480,["607"] = 497,["608"] = 498,["609"] = 498,["610"] = 498,["612"] = 498,["613"] = 499,["614"] = 499,["615"] = 499,["617"] = 499,["618"] = 500,["621"] = 501,["622"] = 501,["623"] = 501,["625"] = 501,["626"] = 502,["627"] = 503,["628"] = 504,["629"] = 505,["630"] = 505,["633"] = 507,["634"] = 507,["638"] = 509,["641"] = 511,["642"] = 497,["643"] = 514,["644"] = 515,["646"] = 515,["648"] = 514,["649"] = 521,["650"] = 522,["651"] = 521,["652"] = 528,["653"] = 529,["654"] = 528,["655"] = 535,["656"] = 537,["657"] = 540,["658"] = 541,["659"] = 545,["660"] = 546,["661"] = 547,["662"] = 548,["664"] = 550,["665"] = 535,["666"] = 553,["667"] = 554,["668"] = 555,["670"] = 556,["671"] = 557,["672"] = 557,["674"] = 558,["675"] = 558,["677"] = 559,["678"] = 560,["679"] = 561,["681"] = 563,["682"] = 564,["687"] = 553,["688"] = 572,["689"] = 573,["690"] = 572,["691"] = 34,["692"] = 35});
local ____exports = {}
local ____tstl_2Dutils = require("lib.tstl-utils")
local reloadable = ____tstl_2Dutils.reloadable
local ____hero_2Dpool = require("heroes.hero-pool")
local HERO_POOL = ____hero_2Dpool.HERO_POOL
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
local ____hero_2Ddraft_2Dmanager = require("heroes.hero-draft-manager")
local HeroDraftManager = ____hero_2Ddraft_2Dmanager.HeroDraftManager
local ____ability_2Ddraft_2Dmanager = require("abilities.ability-draft-manager")
local AbilityDraftManager = ____ability_2Ddraft_2Dmanager.AbilityDraftManager
--- Главный класс игрового режима
-- Координирует работу всех подсистем
____exports.GameMode = __TS__Class()
local GameMode = ____exports.GameMode
GameMode.name = "GameMode"
function GameMode.prototype.____constructor(self)
    self.botsFilled = false
    self.thinkDtAcc = 0
    self.clearedDefaultAbilities = __TS__New(Map)
    self.controlEnforceAcc = 0
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
    do
        pcall(function()
            local ____LoadKeyValues_result_0 = LoadKeyValues("scripts/npc/npc_heroes.txt")
            if ____LoadKeyValues_result_0 == nil then
                ____LoadKeyValues_result_0 = {}
            end
            local kv = ____LoadKeyValues_result_0
            local precacheRes = _G.PrecacheResource
            if type(precacheRes) == "function" then
                for ____, unitName in ipairs(HERO_POOL) do
                    local model
                    do
                        pcall(function()
                            local entry = kv[unitName]
                            if entry and type(entry) == "table" then
                                local m = entry.Model
                                if type(m) == "string" and #m > 0 then
                                    model = m
                                end
                            end
                        end)
                    end
                    if not model then
                        local short = __TS__StringReplace(unitName, "npc_dota_hero_", "")
                        if short and #short > 0 then
                            model = ((("models/heroes/" .. short) .. "/") .. short) .. ".vmdl"
                        end
                    end
                    if model and #model > 0 then
                        do
                            pcall(function()
                                precacheRes(nil, "model", model, context)
                            end)
                        end
                    end
                end
            end
        end)
    end
end
function GameMode.Activate()
    GameRules.Addon = __TS__New(____exports.GameMode)
end
function GameMode.prototype.initializeSystems(self)
    self.teamAssignment = __TS__New(TeamAssignment)
    self.playerManager = __TS__New(PlayerManager, self.teamAssignment)
    self.botManager = __TS__New(BotManager, self.teamAssignment)
    self.peaceMode = __TS__New(PeaceMode)
    self.spawnManager = __TS__New(SpawnManager, self.peaceMode)
    self.shopkeeperManager = __TS__New(ShopkeeperManager)
    self.heroManager = __TS__New(HeroManager, self.playerManager, self.teamAssignment, self.peaceMode)
    self.abilityManager = __TS__New(AbilityManager, self.playerManager)
    self.abilityDraft = __TS__New(AbilityDraftManager, self.playerManager)
    self.heroDraft = __TS__New(
        HeroDraftManager,
        self.playerManager,
        self.teamAssignment,
        self.peaceMode,
        self.spawnManager,
        self.abilityDraft
    )
    self.roundController = __TS__New(RoundController, self.playerManager, self.spawnManager, self.peaceMode)
    self.aiTakeover = __TS__New(AiTakeoverController, self.playerManager)
    self.lighting = __TS__New(LightingManager)
    local heroSelectionStage = __TS__New(HeroSelectionStage, self.heroDraft)
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
    ListenToGameEvent(
        "dota_player_gained_level",
        function(event) return self:onPlayerGainedLevel(event) end,
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
    CustomGameEventManager:RegisterListener(
        "arcpit_hero_pick",
        function(src, data) return self:onHeroPick(src, data) end
    )
    CustomGameEventManager:RegisterListener(
        "arcpit_ability_pick",
        function(src, data) return self:onAbilityPick(src, data) end
    )
end
function GameMode.prototype.onStateChange(self)
    local state = GameRules:State_Get()
    print(("=== Game state changed to: " .. tostring(state)) .. " ===")
    if state == DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP then
        self:handleCustomGameSetup()
    end
    if state == DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
        print("[arcpit] GAME_IN_PROGRESS: starting scenario + initial ability offers")
        Timers:CreateTimer(
            0.25,
            function()
                self:startGame()
                for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
                    do
                        if self.clearedDefaultAbilities:get(pid) then
                            goto __continue33
                        end
                        local hero = self.playerManager:getPlayerHero(pid) or PlayerResource:GetSelectedHeroEntity(pid)
                        if not hero or not IsValidEntity(hero) then
                            goto __continue33
                        end
                        self.clearedDefaultAbilities:set(pid, true)
                        self:clearAllHeroAbilities(hero)
                        do
                            pcall(function()
                                print((("[arcpit][Abilities] cleared default abilities on GAME_IN_PROGRESS pid=" .. tostring(pid)) .. " hero=") .. hero:GetUnitName())
                            end)
                        end
                    end
                    ::__continue33::
                end
                for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
                    self.abilityDraft:maybeOffer(pid)
                end
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
            print(("[arcpit] CUSTOM_GAME_SETUP: starting custom hero draft for " .. tostring(GAME_CONSTANTS.HERO_SELECTION_TIME)) .. "s")
            self.heroDraft:start(GAME_CONSTANTS.HERO_SELECTION_TIME, true)
            Timers:CreateTimer({
                useGameTime = false,
                endTime = GAME_CONSTANTS.HERO_SELECTION_TIME + 0.35,
                callback = function()
                    print("Finishing custom game setup...")
                    GameRules:FinishCustomGameSetup()
                    return nil
                end
            })
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
        local hero = unit
        Timers:CreateTimer(
            0,
            function()
                do
                    pcall(function()
                        self:stripWearables(hero)
                    end)
                end
                do
                    pcall(function()
                        self:forceDefaultHeroModel(hero)
                    end)
                end
                return nil
            end
        )
        Timers:CreateTimer(
            0.2,
            function()
                do
                    pcall(function()
                        self:stripWearables(hero)
                    end)
                end
                do
                    pcall(function()
                        self:forceDefaultHeroModel(hero)
                    end)
                end
                return nil
            end
        )
        local ____temp_3 = not self.isRoundActive
        if ____temp_3 then
            local ____opt_1 = self.peaceMode
            ____temp_3 = ____opt_1 and ____opt_1:isEnabled()
        end
        if ____temp_3 then
            self.peaceMode:applyToHero(hero)
        end
        if not hero:HasModifier("modifier_temp_int_buckets") then
            hero:AddNewModifier(hero, nil, "modifier_temp_int_buckets", {})
        end
        local ____opt_4 = self.roundController
        if ____opt_4 ~= nil then
            ____opt_4:onNpcSpawned(hero)
        end
        local pid = hero:GetPlayerID()
        if pid ~= nil then
            do
                local p = 0
                while p < 64 do
                    do
                        if not PlayerResource:IsValidPlayerID(p) then
                            goto __continue60
                        end
                        hero:SetControllableByPlayer(p, false)
                    end
                    ::__continue60::
                    p = p + 1
                end
            end
            hero:SetControllableByPlayer(pid, true)
        end
        if pid ~= nil and PlayerResource:IsValidPlayerID(pid) then
            local state = GameRules:State_Get()
            if state >= DOTA_GAMERULES_STATE_GAME_IN_PROGRESS and not self.clearedDefaultAbilities:get(pid) then
                self.clearedDefaultAbilities:set(pid, true)
                self:clearAllHeroAbilities(hero)
                do
                    pcall(function()
                        print((("[arcpit][Abilities] cleared default abilities for pid=" .. tostring(pid)) .. " hero=") .. hero:GetUnitName())
                    end)
                end
            end
        end
        if pid ~= nil and PlayerResource:IsValidPlayerID(pid) then
            local state = GameRules:State_Get()
            if state >= DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
                Timers:CreateTimer(
                    0.35,
                    function()
                        self.abilityDraft:maybeOffer(pid)
                        return nil
                    end
                )
            end
        end
    end
end
function GameMode.prototype.clearAllHeroAbilities(self, hero)
    do
        pcall(function()
            do
                local j = hero:GetAbilityCount() - 1
                while j >= 0 do
                    do
                        local ab = hero:GetAbilityByIndex(j)
                        if not ab then
                            goto __continue71
                        end
                        local name = ab:GetAbilityName()
                        if not name or #name <= 0 then
                            goto __continue71
                        end
                        do
                            pcall(function()
                                hero:RemoveAbility(name)
                            end)
                        end
                    end
                    ::__continue71::
                    j = j - 1
                end
            end
        end)
    end
end
function GameMode.prototype.forceDefaultHeroModel(self, hero)
    if not hero or not IsValidEntity(hero) then
        return
    end
    local unitName = hero:GetUnitName()
    local defaultModel
    do
        pcall(function()
            local ____LoadKeyValues_result_6 = LoadKeyValues("scripts/npc/npc_heroes.txt")
            if ____LoadKeyValues_result_6 == nil then
                ____LoadKeyValues_result_6 = {}
            end
            local kv = ____LoadKeyValues_result_6
            local entry = kv[unitName]
            if entry and type(entry) == "table" then
                local m = entry.Model
                if type(m) == "string" and #m > 0 then
                    defaultModel = m
                end
            end
        end)
    end
    if not defaultModel then
        local short = __TS__StringReplace(unitName, "npc_dota_hero_", "")
        if short and #short > 0 then
            defaultModel = ((("models/heroes/" .. short) .. "/") .. short) .. ".vmdl"
        end
    end
    if not defaultModel or #defaultModel <= 0 then
        return
    end
    local current
    do
        local function ____catch(e)
            current = nil
        end
        local ____try, ____hasReturned = pcall(function()
            current = hero:GetModelName()
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
    if current == defaultModel then
        return
    end
    do
        pcall(function()
            hero:SetOriginalModel(defaultModel)
        end)
    end
    do
        pcall(function()
            hero:SetModel(defaultModel)
        end)
    end
end
function GameMode.prototype.stripWearables(self, hero)
    if not hero or not IsValidEntity(hero) then
        return
    end
    local h = hero
    local child = nil
    do
        local function ____catch(e)
            child = nil
        end
        local ____try, ____hasReturned = pcall(function()
            local ____h_FirstMoveChild_7
            if h.FirstMoveChild then
                ____h_FirstMoveChild_7 = h:FirstMoveChild()
            else
                ____h_FirstMoveChild_7 = nil
            end
            child = ____h_FirstMoveChild_7
        end)
        if not ____try then
            ____catch(____hasReturned)
        end
    end
    local guard = 0
    while true do
        local ____child_11 = child
        if ____child_11 then
            local ____guard_10 = guard
            guard = ____guard_10 + 1
            ____child_11 = ____guard_10 < 512
        end
        if not ____child_11 then
            break
        end
        local next = nil
        do
            local function ____catch(e)
                next = nil
            end
            local ____try, ____hasReturned = pcall(function()
                local ____child_NextMovePeer_8
                if child.NextMovePeer then
                    ____child_NextMovePeer_8 = child:NextMovePeer()
                else
                    ____child_NextMovePeer_8 = nil
                end
                next = ____child_NextMovePeer_8
            end)
            if not ____try then
                ____catch(____hasReturned)
            end
        end
        do
            pcall(function()
                local ____child_GetClassname_9
                if child.GetClassname then
                    ____child_GetClassname_9 = child:GetClassname()
                else
                    ____child_GetClassname_9 = ""
                end
                local cn = ____child_GetClassname_9
                if cn == "dota_item_wearable" then
                    do
                        pcall(function()
                            _G:UTIL_Remove(child)
                        end)
                    end
                    do
                        pcall(function()
                            child:RemoveSelf()
                        end)
                    end
                end
            end)
        end
        child = next
    end
end
function GameMode.prototype.onPlayerGainedLevel(self, event)
    local pid = event.player_id
    if pid == nil or not PlayerResource:IsValidPlayerID(pid) then
        return
    end
    self.abilityDraft:maybeOffer(pid)
end
function GameMode.prototype.onHeroPick(self, playerID, data)
    local ____data_offerId_12 = data.offerId
    if ____data_offerId_12 == nil then
        ____data_offerId_12 = 0
    end
    local offerId = __TS__Number(____data_offerId_12)
    local ____data_heroName_13 = data.heroName
    if ____data_heroName_13 == nil then
        ____data_heroName_13 = ""
    end
    local heroName = tostring(____data_heroName_13)
    if not heroName then
        return
    end
    local ____data_playerID_14 = data.playerID
    if ____data_playerID_14 == nil then
        ____data_playerID_14 = -1
    end
    local pidFromData = __TS__Number(____data_playerID_14)
    local pid = PlayerResource:IsValidPlayerID(pidFromData) and pidFromData or nil
    if pid == nil then
        local fromOffer = self.heroDraft:getOfferOwnerByOfferId(offerId)
        if fromOffer ~= nil then
            pid = fromOffer
        end
    end
    if pid == nil then
        pid = playerID
    end
    do
        pcall(function()
            print((((((((("[arcpit][HeroPick] src=" .. tostring(playerID)) .. " dataPid=") .. tostring(data.playerID)) .. " -> pid=") .. tostring(pid)) .. " offerId=") .. tostring(offerId)) .. " heroName=") .. heroName)
        end)
    end
    self.heroDraft:onClientPick(pid, offerId, heroName)
end
function GameMode.prototype.onAbilityPick(self, playerID, data)
    local ____data_offerId_15 = data.offerId
    if ____data_offerId_15 == nil then
        ____data_offerId_15 = 0
    end
    local offerId = __TS__Number(____data_offerId_15)
    local ____data_abilityName_16 = data.abilityName
    if ____data_abilityName_16 == nil then
        ____data_abilityName_16 = ""
    end
    local abilityName = tostring(____data_abilityName_16)
    if not abilityName then
        return
    end
    local ____data_playerID_17 = data.playerID
    if ____data_playerID_17 == nil then
        ____data_playerID_17 = -1
    end
    local pidFromData = __TS__Number(____data_playerID_17)
    local pid = PlayerResource:IsValidPlayerID(pidFromData) and pidFromData or nil
    if pid == nil then
        local fromOffer = self.abilityDraft:getOfferOwnerByOfferId(offerId)
        if fromOffer ~= nil then
            pid = fromOffer
        end
    end
    if pid == nil then
        pid = playerID
    end
    do
        pcall(function()
            print((((((((("[arcpit][AbilityPick] src=" .. tostring(playerID)) .. " dataPid=") .. tostring(data.playerID)) .. " -> pid=") .. tostring(pid)) .. " offerId=") .. tostring(offerId)) .. " abilityName=") .. abilityName)
        end)
    end
    self.abilityDraft:onClientPick(pid, offerId, abilityName)
end
function GameMode.prototype.onEntityKilled(self, event)
    local ____opt_18 = self.roundController
    if ____opt_18 ~= nil then
        ____opt_18:onEntityKilled(event)
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
    self.controlEnforceAcc = self.controlEnforceAcc + 0.1
    if self.controlEnforceAcc >= 1 then
        self.controlEnforceAcc = 0
        self:enforceExclusiveControlAll()
    end
    return 0.1
end
function GameMode.prototype.enforceExclusiveControlAll(self)
    local ids = self.playerManager:getAllValidPlayerIDs()
    for ____, pid in ipairs(ids) do
        do
            local hero = self.playerManager:getPlayerHero(pid) or PlayerResource:GetSelectedHeroEntity(pid)
            if not hero or not IsValidEntity(hero) then
                goto __continue119
            end
            if not hero:IsRealHero() then
                goto __continue119
            end
            local owner = hero:GetPlayerID()
            for ____, p in ipairs(ids) do
                hero:SetControllableByPlayer(p, false)
            end
            if owner ~= nil then
                hero:SetControllableByPlayer(owner, true)
            end
        end
        ::__continue119::
    end
end
function GameMode.prototype.Reload(self)
    print("Script reloaded!")
end
GameMode = __TS__Decorate(GameMode, GameMode, {reloadable}, {kind = "class", name = "GameMode"})
____exports.GameMode = GameMode
return ____exports
