local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__ArrayMap = ____lualib.__TS__ArrayMap
local __TS__ArraySome = ____lualib.__TS__ArraySome
local __TS__ArraySort = ____lualib.__TS__ArraySort
local __TS__StringStartsWith = ____lualib.__TS__StringStartsWith
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["12"] = 1,["13"] = 1,["14"] = 5,["15"] = 5,["18"] = 27,["19"] = 27,["20"] = 27,["21"] = 41,["22"] = 41,["23"] = 42,["24"] = 43,["25"] = 28,["26"] = 30,["27"] = 31,["28"] = 33,["29"] = 35,["30"] = 36,["31"] = 38,["32"] = 40,["33"] = 46,["34"] = 47,["35"] = 46,["36"] = 53,["37"] = 54,["38"] = 53,["39"] = 60,["40"] = 61,["41"] = 62,["42"] = 63,["45"] = 65,["46"] = 66,["49"] = 70,["50"] = 60,["51"] = 76,["52"] = 77,["55"] = 79,["56"] = 80,["57"] = 82,["58"] = 83,["61"] = 85,["62"] = 86,["65"] = 89,["66"] = 90,["67"] = 76,["68"] = 96,["69"] = 97,["72"] = 99,["73"] = 100,["74"] = 101,["77"] = 103,["78"] = 104,["81"] = 108,["82"] = 109,["83"] = 110,["84"] = 111,["85"] = 112,["86"] = 116,["87"] = 117,["88"] = 118,["89"] = 121,["90"] = 96,["91"] = 127,["92"] = 128,["95"] = 129,["96"] = 130,["99"] = 131,["102"] = 133,["103"] = 134,["104"] = 135,["107"] = 137,["108"] = 138,["111"] = 141,["112"] = 142,["113"] = 144,["114"] = 144,["115"] = 144,["116"] = 145,["117"] = 145,["119"] = 146,["120"] = 146,["122"] = 147,["123"] = 148,["124"] = 144,["125"] = 144,["126"] = 127,["127"] = 156,["128"] = 157,["129"] = 160,["131"] = 161,["132"] = 162,["133"] = 162,["135"] = 164,["136"] = 165,["137"] = 165,["139"] = 167,["140"] = 170,["141"] = 174,["142"] = 175,["143"] = 176,["144"] = 177,["145"] = 178,["146"] = 181,["147"] = 184,["148"] = 185,["150"] = 189,["151"] = 190,["152"] = 190,["153"] = 190,["154"] = 190,["155"] = 191,["156"] = 192,["157"] = 193,["161"] = 197,["162"] = 156,["163"] = 200,["164"] = 201,["165"] = 203,["166"] = 204,["169"] = 206,["170"] = 207,["173"] = 211,["174"] = 212,["177"] = 215,["178"] = 200,["179"] = 218,["180"] = 219,["181"] = 220,["182"] = 220,["183"] = 220,["184"] = 220,["185"] = 222,["186"] = 223,["187"] = 223,["189"] = 225,["190"] = 226,["192"] = 227,["193"] = 228,["194"] = 228,["196"] = 229,["197"] = 229,["199"] = 232,["200"] = 232,["201"] = 232,["202"] = 233,["203"] = 234,["204"] = 232,["205"] = 232,["206"] = 237,["207"] = 238,["208"] = 239,["210"] = 241,["215"] = 245,["216"] = 246,["217"] = 247,["219"] = 250,["220"] = 220,["221"] = 220,["222"] = 220,["223"] = 218,["224"] = 255,["225"] = 256,["226"] = 257,["229"] = 259,["230"] = 260,["231"] = 261,["232"] = 262,["233"] = 264,["234"] = 265,["235"] = 268,["236"] = 269,["237"] = 255,["238"] = 272,["239"] = 273,["240"] = 275,["241"] = 275,["242"] = 275,["243"] = 275,["245"] = 276,["246"] = 276,["247"] = 277,["248"] = 278,["249"] = 280,["250"] = 281,["251"] = 282,["252"] = 283,["253"] = 284,["255"] = 286,["257"] = 276,["260"] = 272,["261"] = 291,["262"] = 292,["265"] = 295,["266"] = 291,["267"] = 298,["268"] = 299,["269"] = 300,["270"] = 301,["271"] = 301,["272"] = 301,["273"] = 301,["274"] = 303,["275"] = 304,["276"] = 305,["278"] = 306,["279"] = 307,["280"] = 307,["282"] = 309,["283"] = 310,["284"] = 311,["285"] = 317,["286"] = 318,["288"] = 321,["293"] = 324,["294"] = 301,["295"] = 301,["296"] = 301,["297"] = 298,["298"] = 333,["299"] = 334,["300"] = 336,["301"] = 337,["302"] = 339,["304"] = 344,["305"] = 344,["307"] = 345,["308"] = 346,["309"] = 347,["310"] = 348,["311"] = 350,["312"] = 350,["313"] = 350,["314"] = 350,["315"] = 350,["316"] = 350,["317"] = 350,["318"] = 350,["319"] = 351,["320"] = 351,["322"] = 352,["323"] = 354,["324"] = 360,["325"] = 361,["326"] = 362,["327"] = 363,["328"] = 364,["329"] = 364,["330"] = 364,["331"] = 364,["332"] = 364,["333"] = 370,["336"] = 344,["339"] = 373,["340"] = 333,["341"] = 376,["342"] = 378,["343"] = 384,["344"] = 385,["345"] = 386,["348"] = 391,["349"] = 392,["350"] = 376,["351"] = 395,["352"] = 396,["353"] = 397,["357"] = 399,["358"] = 399,["360"] = 400,["361"] = 400,["363"] = 401,["366"] = 399,["369"] = 403,["370"] = 395,["371"] = 406,["372"] = 408,["373"] = 409,["374"] = 411,["375"] = 411,["376"] = 411,["377"] = 411,["378"] = 411,["379"] = 411,["380"] = 411,["381"] = 411,["382"] = 411,["383"] = 411,["384"] = 411,["385"] = 423,["386"] = 424,["387"] = 424,["388"] = 424,["389"] = 424,["390"] = 424,["393"] = 433,["394"] = 434,["395"] = 435,["396"] = 436,["397"] = 436,["398"] = 436,["399"] = 436,["400"] = 436,["402"] = 406,["403"] = 444,["404"] = 445,["405"] = 446,["408"] = 447,["409"] = 444,["410"] = 454,["411"] = 456,["412"] = 457,["413"] = 458,["415"] = 459,["416"] = 459,["417"] = 460,["418"] = 459,["422"] = 465,["423"] = 454,["424"] = 468,["425"] = 469,["426"] = 470,["429"] = 473,["431"] = 474,["432"] = 474,["434"] = 475,["435"] = 476,["436"] = 476,["438"] = 477,["439"] = 478,["440"] = 478,["442"] = 479,["443"] = 479,["445"] = 480,["446"] = 480,["448"] = 481,["451"] = 474,["454"] = 483,["457"] = 485,["458"] = 486,["459"] = 487,["461"] = 488,["462"] = 489,["463"] = 490,["464"] = 491,["465"] = 491,["467"] = 492,["468"] = 492,["470"] = 495,["471"] = 496,["472"] = 497,["473"] = 498,["474"] = 499,["478"] = 468,["479"] = 507,["480"] = 508,["481"] = 507,["482"] = 515,["483"] = 516,["484"] = 517,["487"] = 518,["488"] = 518,["489"] = 518,["490"] = 518,["491"] = 518,["492"] = 518,["493"] = 518,["494"] = 518,["495"] = 515});
local ____exports = {}
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
local ____arena_2Dlayout = require("shared.arena-layout")
local buildLayout = ____arena_2Dlayout.buildLayout
--- Контроллер бесконечных раундов PvE (каждый игрок на своей арене vs крипы).
-- Это каркас: дальше сюда можно наращивать логику (награды, предметы, спец-правила и т.д.).
____exports.RoundController = __TS__Class()
local RoundController = ____exports.RoundController
RoundController.name = "RoundController"
function RoundController.prototype.____constructor(self, playerManager, spawnManager, peaceMode)
    self.playerManager = playerManager
    self.spawnManager = spawnManager
    self.peaceMode = peaceMode
    self.layout = nil
    self.nextRoundNumber = 1
    self.activeRoundNumber = nil
    self.playerStates = __TS__New(Map)
    self.roundPollTimerName = "RoundController_Poll"
    self.neutralPollTimerName = "RoundController_NeutralPeacePoll"
    self.stageManager = nil
end
function RoundController.prototype.setStageManager(self, stageManager)
    self.stageManager = stageManager
end
function RoundController.prototype.getNextRoundNumber(self)
    return self.nextRoundNumber
end
function RoundController.prototype.onPlanningStageStarted(self, duration)
    self:ensureLayout()
    self:preparePlayerStates()
    self:sendRoundState("planning", self.nextRoundNumber, duration)
    do
        pcall(function()
            GameRules.Addon.isRoundActive = false
            GameRules.Addon.currentRound = self.nextRoundNumber
        end)
    end
    self:startNeutralZoneEnforcer()
end
function RoundController.prototype.onCombatStageStarted(self)
    if self.activeRoundNumber ~= nil then
        return
    end
    self:ensureLayout()
    self.activeRoundNumber = self.nextRoundNumber
    local round = self.activeRoundNumber
    print(("=== RoundController: старт раунда " .. tostring(round)) .. " ===")
    do
        pcall(function()
            GameRules.Addon.isRoundActive = true
            GameRules.Addon.currentRound = round
        end)
    end
    self:sendRoundState("round", round, 0)
    self:startRound(round)
end
function RoundController.prototype.onNpcSpawned(self, unit)
    if not unit:IsRealHero() then
        return
    end
    local hero = unit
    local pid = hero:GetPlayerID()
    if pid == nil then
        return
    end
    local st = self.playerStates:get(pid)
    if not (st and st.pendingRespawnPos) then
        return
    end
    local p = st.pendingRespawnPos
    local pos = Vector(p.x, p.y, p.z)
    hero:SetAbsOrigin(pos)
    FindClearSpaceForUnit(hero, pos, true)
    st.pendingRespawnPos = nil
    self:stripSpawnProtection(hero)
    self:enforceExclusiveControl(hero)
    self:forceAutoAttack(pid, hero)
    self:focusCameraOnHero(pid, hero)
end
function RoundController.prototype.onEntityKilled(self, event)
    if event.entindex_killed == nil then
        return
    end
    local killed = EntIndexToHScript(event.entindex_killed)
    if not killed or not IsValidEntity(killed) then
        return
    end
    if not killed:IsRealHero() then
        return
    end
    local hero = killed
    local pid = hero:GetPlayerID()
    if pid == nil then
        return
    end
    local st = self.playerStates:get(pid)
    if not st then
        return
    end
    local o = hero:GetAbsOrigin()
    st.pendingRespawnPos = Vector(o.x, o.y, o.z)
    Timers:CreateTimer(
        3,
        function()
            if not IsValidEntity(hero) then
                return nil
            end
            if hero:IsAlive() then
                return nil
            end
            hero:RespawnHero(false, false)
            return nil
        end
    )
end
function RoundController.prototype.startRound(self, round)
    self:preparePlayerStates()
    for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
        do
            local hero = self.playerManager:getPlayerHero(pid) or PlayerResource:GetSelectedHeroEntity(pid)
            if not hero or not IsValidEntity(hero) then
                goto __continue24
            end
            local st = self.playerStates:get(pid)
            if not st then
                goto __continue24
            end
            local slot = self.layout.byId[st.arenaId]
            self.peaceMode:removeFromHero(hero)
            local arenaCenter = Vector(slot.center.x, slot.center.y, slot.center.z)
            local spawn = Vector(slot.spawn.x, slot.spawn.y, slot.spawn.z)
            hero:SetAbsOrigin(spawn)
            FindClearSpaceForUnit(hero, spawn, true)
            st.arenaCenter = Vector(arenaCenter.x, arenaCenter.y, arenaCenter.z)
            self:focusCameraOnHero(pid, hero)
            if PlayerResource:IsFakeClient(pid) then
                self:ensureBotLevelAndAutoSkills(hero)
            end
            local creeps = self:spawnCreepsForHero(round, {x = arenaCenter.x, y = arenaCenter.y, z = arenaCenter.z}, hero)
            st.creeps = __TS__ArrayMap(
                creeps,
                function(____, c) return c:entindex() end
            )
            st.finished = false
            local ho = hero:GetAbsOrigin()
            st.lastCombatPos = Vector(ho.x, ho.y, ho.z)
        end
        ::__continue24::
    end
    self:startRoundPoll(round)
end
function RoundController.prototype.endRound(self, round)
    print(("=== RoundController: раунд " .. tostring(round)) .. " завершён (все игроки справились) ===")
    self.activeRoundNumber = nil
    self.nextRoundNumber = self.nextRoundNumber + 1
    do
        pcall(function()
            GameRules.Addon.isRoundActive = false
            GameRules.Addon.currentRound = self.nextRoundNumber
        end)
    end
    if not self.stageManager then
        print("RoundController WARNING: stageManager is not set, cannot transition to planning")
        return
    end
    self.stageManager:startPreCombat(GAME_CONSTANTS.BETWEEN_ROUNDS_PLANNING_TIME)
end
function RoundController.prototype.startRoundPoll(self, round)
    Timers:RemoveTimer(self.roundPollTimerName)
    Timers:CreateTimer(
        self.roundPollTimerName,
        {
            endTime = 0.25,
            callback = function()
                if self.activeRoundNumber ~= round then
                    return nil
                end
                local allFinished = true
                for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
                    do
                        local st = self.playerStates:get(pid)
                        if not st then
                            goto __continue36
                        end
                        if st.finished then
                            goto __continue36
                        end
                        local alive = __TS__ArraySome(
                            st.creeps,
                            function(____, idx)
                                local ent = EntIndexToHScript(idx)
                                return ent and IsValidEntity(ent) and ent:IsAlive()
                            end
                        )
                        if not alive then
                            st.finished = true
                            self:returnPlayerToNeutral(pid)
                        else
                            allFinished = false
                        end
                    end
                    ::__continue36::
                end
                if allFinished then
                    self:endRound(round)
                    return nil
                end
                return 0.25
            end
        }
    )
end
function RoundController.prototype.returnPlayerToNeutral(self, pid)
    local hero = self.playerManager:getPlayerHero(pid) or PlayerResource:GetSelectedHeroEntity(pid)
    if not hero or not IsValidEntity(hero) then
        return
    end
    local spawn = self.spawnManager:getNeutralCenter()
    local dx = RandomInt(-200, 200)
    local dy = RandomInt(-200, 200)
    local pos = Vector(spawn.x + dx, spawn.y + dy, spawn.z)
    hero:SetAbsOrigin(pos)
    FindClearSpaceForUnit(hero, pos, true)
    self.peaceMode:applyToHero(hero)
    self:focusCameraOnHero(pid, hero)
end
function RoundController.prototype.preparePlayerStates(self)
    self:ensureLayout()
    local playerIDs = __TS__ArraySort(
        self.playerManager:getAllValidPlayerIDs(),
        function(____, a, b) return a - b end
    )
    do
        local i = 0
        while i < #playerIDs do
            local pid = playerIDs[i + 1]
            local arenaId = math.min(8, i + 1)
            local existing = self.playerStates:get(pid)
            if existing then
                existing.arenaId = arenaId
                existing.finished = false
                existing.creeps = {}
            else
                self.playerStates:set(pid, {arenaId = arenaId, finished = false, creeps = {}})
            end
            i = i + 1
        end
    end
end
function RoundController.prototype.ensureLayout(self)
    if self.layout then
        return
    end
    self.layout = buildLayout(nil, {debug = false, logPrefix = "[arena-layout]"})
end
function RoundController.prototype.startNeutralZoneEnforcer(self)
    self:ensureLayout()
    Timers:RemoveTimer(self.neutralPollTimerName)
    Timers:CreateTimer(
        self.neutralPollTimerName,
        {
            endTime = 0.25,
            callback = function()
                local neutralBounds = self.layout.neutral.bounds
                for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
                    do
                        local hero = self.playerManager:getPlayerHero(pid) or PlayerResource:GetSelectedHeroEntity(pid)
                        if not hero or not IsValidEntity(hero) then
                            goto __continue56
                        end
                        local o = hero:GetAbsOrigin()
                        local p = {x = o.x, y = o.y, z = o.z}
                        local inNeutral = p.x >= neutralBounds.mins.x and p.x <= neutralBounds.maxs.x and p.y >= neutralBounds.mins.y and p.y <= neutralBounds.maxs.y
                        if inNeutral then
                            self.peaceMode:applyToHero(hero)
                        else
                            self.peaceMode:removeFromHero(hero)
                        end
                    end
                    ::__continue56::
                end
                return 0.25
            end
        }
    )
end
function RoundController.prototype.spawnCreepsForHero(self, round, center, hero)
    local creeps = {}
    local countBase = 6
    local count = countBase + math.floor((round - 1) * 0.75) + RandomInt(0, 2)
    local creepPool = {"npc_dota_creep_badguys_melee", "npc_dota_creep_badguys_ranged"}
    do
        local i = 0
        while i < count do
            do
                local unitName = creepPool[RandomInt(0, #creepPool - 1) + 1]
                local dx = RandomInt(-450, 450)
                local dy = RandomInt(-450, 450)
                local pos = Vector(center.x + dx, center.y + dy, center.z)
                local creep = CreateUnitByName(
                    unitName,
                    pos,
                    true,
                    nil,
                    nil,
                    DOTA_TEAM_BADGUYS
                )
                if not creep then
                    goto __continue63
                end
                FindClearSpaceForUnit(creep, pos, true)
                self:applyCreepScaling(creep, round)
                creep:SetIdleAcquire(true)
                creep:SetAcquisitionRange(2500)
                local ho = hero:GetAbsOrigin()
                local heroPos = Vector(ho.x, ho.y, ho.z)
                ExecuteOrderFromTable({
                    UnitIndex = creep:entindex(),
                    OrderType = DOTA_UNIT_ORDER_ATTACK_MOVE,
                    Position = heroPos
                })
                creeps[#creeps + 1] = creep
            end
            ::__continue63::
            i = i + 1
        end
    end
    return creeps
end
function RoundController.prototype.stripSpawnProtection(self, hero)
    local toRemove = {"modifier_invulnerable", "modifier_fountain_invulnerability", "modifier_fountain_aura_buff", "modifier_respawn_protection"}
    for ____, name in ipairs(toRemove) do
        while hero:HasModifier(name) do
            hero:RemoveModifierByName(name)
        end
    end
    hero:SetIdleAcquire(true)
    hero:SetAcquisitionRange(GAME_CONSTANTS.DEFAULT_ACQUISITION_RANGE)
end
function RoundController.prototype.enforceExclusiveControl(self, hero)
    local owner = hero:GetPlayerID()
    if owner == nil then
        return
    end
    do
        local p = 0
        while p < 64 do
            do
                if not PlayerResource:IsValidPlayerID(p) then
                    goto __continue72
                end
                hero:SetControllableByPlayer(p, false)
            end
            ::__continue72::
            p = p + 1
        end
    end
    hero:SetControllableByPlayer(owner, true)
end
function RoundController.prototype.forceAutoAttack(self, pid, hero)
    local o = hero:GetAbsOrigin()
    local origin = Vector(o.x, o.y, o.z)
    local enemies = FindUnitsInRadius(
        hero:GetTeamNumber(),
        origin,
        nil,
        GAME_CONSTANTS.BOT_SEARCH_RADIUS,
        DOTA_UNIT_TARGET_TEAM_ENEMY,
        DOTA_UNIT_TARGET_BASIC,
        DOTA_UNIT_TARGET_FLAG_NONE,
        FIND_CLOSEST,
        false
    )
    if #enemies > 0 then
        ExecuteOrderFromTable({
            UnitIndex = hero:entindex(),
            OrderType = DOTA_UNIT_ORDER_ATTACK_TARGET,
            TargetIndex = enemies[1]:entindex()
        })
        return
    end
    local st = self.playerStates:get(pid)
    local center = st and st.arenaCenter or st and st.lastCombatPos
    if center then
        ExecuteOrderFromTable({
            UnitIndex = hero:entindex(),
            OrderType = DOTA_UNIT_ORDER_ATTACK_MOVE,
            Position = center
        })
    end
end
function RoundController.prototype.applyCreepScaling(self, creep, round)
    local stacks = math.max(0, round - 1)
    if stacks <= 0 then
        return
    end
    creep:AddNewModifier(creep, nil, "modifier_round_creep_scaling", {stacks = stacks})
end
function RoundController.prototype.ensureBotLevelAndAutoSkills(self, hero)
    local target = GAME_CONSTANTS.BOT_START_LEVEL
    local cur = hero:GetLevel()
    if cur < target then
        do
            local i = cur
            while i < target do
                hero:HeroLevelUp(false)
                i = i + 1
            end
        end
    end
    self:autoLevelAbilitiesEvenly(hero)
end
function RoundController.prototype.autoLevelAbilitiesEvenly(self, hero)
    local points = hero:GetAbilityPoints()
    if points <= 0 then
        return
    end
    local abil = {}
    do
        local i = 0
        while i < hero:GetAbilityCount() do
            do
                local a = hero:GetAbilityByIndex(i)
                if not a then
                    goto __continue86
                end
                local name = a:GetAbilityName()
                if not name then
                    goto __continue86
                end
                if __TS__StringStartsWith(name, "special_bonus_") then
                    goto __continue86
                end
                if a:GetMaxLevel() <= 0 then
                    goto __continue86
                end
                abil[#abil + 1] = a
            end
            ::__continue86::
            i = i + 1
        end
    end
    if #abil == 0 then
        return
    end
    local guard = 0
    local idx = 0
    while points > 0 and guard < 5000 do
        do
            guard = guard + 1
            local a = abil[idx % #abil + 1]
            idx = idx + 1
            if not a then
                goto __continue92
            end
            if a:GetLevel() >= a:GetMaxLevel() then
                goto __continue92
            end
            local newLevel = a:GetLevel() + 1
            a:SetLevel(newLevel)
            points = hero:GetAbilityPoints()
            hero:SetAbilityPoints(math.max(0, points - 1))
            points = hero:GetAbilityPoints()
        end
        ::__continue92::
    end
end
function RoundController.prototype.sendRoundState(self, phase, round, duration)
    CustomGameEventManager:Send_ServerToAllClients("round_state_changed", {phase = phase, round = round, duration = duration})
end
function RoundController.prototype.focusCameraOnHero(self, pid, hero)
    local player = PlayerResource:GetPlayer(pid)
    if not player then
        return
    end
    CustomGameEventManager:Send_ServerToPlayer(
        player,
        "camera_focus_hero",
        {
            entindex = hero:entindex(),
            duration = 0.35
        }
    )
end
return ____exports
