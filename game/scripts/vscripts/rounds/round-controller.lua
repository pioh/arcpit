local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__ArrayMap = ____lualib.__TS__ArrayMap
local __TS__ArraySome = ____lualib.__TS__ArraySome
local __TS__ArraySort = ____lualib.__TS__ArraySort
local __TS__StringStartsWith = ____lualib.__TS__StringStartsWith
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["12"] = 1,["13"] = 1,["14"] = 5,["15"] = 5,["18"] = 27,["19"] = 27,["20"] = 27,["21"] = 43,["22"] = 43,["23"] = 44,["24"] = 45,["25"] = 28,["26"] = 30,["27"] = 31,["28"] = 32,["29"] = 34,["30"] = 36,["31"] = 37,["32"] = 38,["33"] = 40,["34"] = 42,["35"] = 48,["36"] = 49,["37"] = 48,["38"] = 55,["39"] = 56,["40"] = 55,["41"] = 62,["42"] = 63,["43"] = 64,["44"] = 65,["47"] = 67,["48"] = 68,["51"] = 72,["52"] = 62,["53"] = 78,["54"] = 79,["57"] = 81,["58"] = 82,["59"] = 83,["60"] = 85,["61"] = 86,["64"] = 88,["65"] = 89,["68"] = 92,["69"] = 93,["70"] = 78,["71"] = 99,["72"] = 100,["75"] = 102,["76"] = 103,["77"] = 104,["80"] = 106,["81"] = 107,["84"] = 111,["85"] = 112,["86"] = 113,["87"] = 114,["88"] = 115,["89"] = 119,["90"] = 120,["91"] = 121,["92"] = 124,["93"] = 99,["94"] = 130,["95"] = 131,["98"] = 132,["99"] = 133,["102"] = 134,["105"] = 136,["106"] = 137,["107"] = 138,["110"] = 140,["111"] = 141,["114"] = 144,["115"] = 145,["116"] = 147,["117"] = 147,["118"] = 147,["119"] = 148,["120"] = 148,["122"] = 149,["123"] = 149,["125"] = 150,["126"] = 151,["127"] = 147,["128"] = 147,["129"] = 130,["130"] = 159,["131"] = 160,["132"] = 163,["134"] = 164,["135"] = 165,["136"] = 165,["138"] = 167,["139"] = 168,["140"] = 168,["142"] = 170,["143"] = 173,["144"] = 177,["145"] = 178,["146"] = 179,["147"] = 180,["148"] = 181,["149"] = 184,["150"] = 187,["151"] = 188,["153"] = 192,["154"] = 193,["155"] = 193,["156"] = 193,["157"] = 193,["158"] = 194,["159"] = 195,["160"] = 196,["164"] = 200,["165"] = 159,["166"] = 203,["167"] = 204,["168"] = 206,["169"] = 207,["170"] = 208,["173"] = 210,["174"] = 211,["177"] = 215,["178"] = 216,["181"] = 219,["182"] = 203,["183"] = 222,["184"] = 223,["185"] = 224,["186"] = 224,["187"] = 224,["188"] = 224,["189"] = 226,["190"] = 227,["191"] = 227,["193"] = 230,["194"] = 231,["195"] = 232,["196"] = 233,["198"] = 237,["199"] = 239,["200"] = 240,["202"] = 241,["203"] = 242,["204"] = 242,["206"] = 243,["207"] = 243,["209"] = 246,["210"] = 246,["211"] = 246,["212"] = 247,["213"] = 248,["214"] = 246,["215"] = 246,["216"] = 251,["217"] = 252,["218"] = 253,["220"] = 255,["225"] = 259,["226"] = 260,["227"] = 261,["229"] = 264,["230"] = 224,["231"] = 224,["232"] = 224,["233"] = 222,["234"] = 269,["235"] = 270,["236"] = 271,["239"] = 273,["240"] = 274,["241"] = 275,["242"] = 276,["243"] = 278,["244"] = 279,["245"] = 282,["246"] = 283,["247"] = 269,["248"] = 286,["249"] = 287,["250"] = 289,["251"] = 289,["252"] = 289,["253"] = 289,["255"] = 290,["256"] = 290,["257"] = 291,["258"] = 292,["259"] = 294,["260"] = 295,["261"] = 296,["262"] = 297,["263"] = 298,["265"] = 300,["267"] = 290,["270"] = 286,["271"] = 305,["272"] = 306,["275"] = 309,["276"] = 305,["277"] = 312,["278"] = 313,["279"] = 314,["280"] = 315,["281"] = 315,["282"] = 315,["283"] = 315,["284"] = 317,["285"] = 318,["286"] = 319,["287"] = 320,["289"] = 321,["290"] = 322,["291"] = 322,["293"] = 326,["294"] = 328,["295"] = 329,["296"] = 330,["297"] = 335,["298"] = 341,["299"] = 343,["300"] = 344,["301"] = 345,["303"] = 347,["304"] = 348,["306"] = 352,["307"] = 353,["309"] = 355,["310"] = 357,["311"] = 358,["312"] = 359,["314"] = 361,["315"] = 362,["317"] = 364,["318"] = 365,["321"] = 369,["322"] = 370,["323"] = 371,["325"] = 373,["326"] = 374,["328"] = 378,["329"] = 379,["335"] = 383,["336"] = 315,["337"] = 315,["338"] = 315,["339"] = 312,["340"] = 388,["341"] = 389,["344"] = 390,["347"] = 392,["349"] = 393,["350"] = 393,["352"] = 395,["353"] = 396,["354"] = 396,["356"] = 399,["357"] = 399,["358"] = 399,["359"] = 400,["360"] = 401,["361"] = 399,["362"] = 399,["363"] = 403,["364"] = 403,["366"] = 405,["367"] = 406,["368"] = 406,["370"] = 408,["371"] = 409,["372"] = 410,["373"] = 413,["374"] = 414,["375"] = 415,["377"] = 419,["378"] = 420,["379"] = 421,["380"] = 422,["381"] = 423,["382"] = 424,["383"] = 425,["384"] = 426,["389"] = 388,["390"] = 431,["391"] = 432,["394"] = 434,["396"] = 435,["397"] = 436,["398"] = 436,["400"] = 439,["402"] = 440,["403"] = 441,["404"] = 441,["406"] = 442,["407"] = 443,["408"] = 443,["413"] = 446,["414"] = 446,["416"] = 446,["423"] = 449,["424"] = 449,["426"] = 449,["433"] = 453,["434"] = 454,["438"] = 431,["439"] = 458,["440"] = 460,["443"] = 464,["444"] = 465,["445"] = 466,["446"] = 467,["449"] = 470,["450"] = 472,["451"] = 473,["452"] = 474,["453"] = 458,["454"] = 481,["455"] = 483,["456"] = 483,["457"] = 483,["458"] = 483,["459"] = 483,["460"] = 483,["461"] = 483,["462"] = 483,["463"] = 483,["464"] = 483,["465"] = 483,["466"] = 484,["467"] = 484,["468"] = 484,["469"] = 484,["470"] = 484,["471"] = 484,["472"] = 484,["473"] = 484,["474"] = 487,["475"] = 488,["476"] = 489,["477"] = 490,["478"] = 490,["481"] = 492,["484"] = 495,["485"] = 496,["486"] = 497,["488"] = 498,["491"] = 499,["492"] = 500,["493"] = 500,["495"] = 502,["496"] = 503,["497"] = 506,["500"] = 514,["503"] = 508,["504"] = 509,["505"] = 510,["506"] = 511,["513"] = 516,["514"] = 517,["519"] = 522,["521"] = 481,["522"] = 531,["523"] = 532,["524"] = 534,["525"] = 535,["526"] = 537,["528"] = 542,["529"] = 542,["531"] = 543,["532"] = 544,["533"] = 545,["534"] = 546,["535"] = 548,["536"] = 548,["537"] = 548,["538"] = 548,["539"] = 548,["540"] = 548,["541"] = 548,["542"] = 548,["543"] = 549,["544"] = 549,["546"] = 550,["547"] = 552,["548"] = 558,["549"] = 559,["550"] = 560,["551"] = 561,["552"] = 562,["553"] = 562,["554"] = 562,["555"] = 562,["556"] = 562,["557"] = 568,["560"] = 542,["563"] = 571,["564"] = 531,["565"] = 574,["566"] = 576,["567"] = 582,["568"] = 583,["569"] = 584,["572"] = 589,["573"] = 590,["574"] = 574,["575"] = 593,["576"] = 594,["577"] = 595,["581"] = 597,["582"] = 597,["584"] = 598,["585"] = 598,["587"] = 599,["590"] = 597,["593"] = 601,["594"] = 593,["595"] = 604,["596"] = 606,["597"] = 607,["598"] = 609,["599"] = 609,["600"] = 609,["601"] = 609,["602"] = 609,["603"] = 609,["604"] = 609,["605"] = 609,["606"] = 609,["607"] = 609,["608"] = 609,["609"] = 621,["610"] = 622,["611"] = 622,["612"] = 622,["613"] = 622,["614"] = 622,["617"] = 631,["618"] = 632,["619"] = 633,["620"] = 634,["621"] = 634,["622"] = 634,["623"] = 634,["624"] = 634,["626"] = 604,["627"] = 642,["628"] = 643,["629"] = 644,["632"] = 645,["633"] = 642,["634"] = 652,["635"] = 654,["636"] = 655,["637"] = 656,["639"] = 657,["640"] = 657,["641"] = 658,["642"] = 657,["646"] = 663,["647"] = 652,["648"] = 666,["649"] = 667,["650"] = 668,["653"] = 671,["654"] = 672,["656"] = 673,["657"] = 673,["659"] = 674,["660"] = 675,["661"] = 675,["663"] = 676,["664"] = 677,["665"] = 677,["667"] = 678,["668"] = 678,["670"] = 679,["671"] = 680,["673"] = 682,["677"] = 673,["680"] = 685,["683"] = 687,["684"] = 688,["685"] = 689,["687"] = 690,["688"] = 691,["691"] = 692,["692"] = 693,["693"] = 694,["694"] = 694,["696"] = 695,["697"] = 695,["699"] = 698,["700"] = 699,["701"] = 700,["702"] = 701,["703"] = 702,["707"] = 706,["708"] = 707,["709"] = 708,["710"] = 709,["712"] = 710,["713"] = 711,["714"] = 712,["715"] = 713,["716"] = 713,["718"] = 714,["719"] = 714,["721"] = 715,["722"] = 716,["723"] = 717,["724"] = 718,["729"] = 666,["730"] = 727,["731"] = 728,["732"] = 727,["733"] = 735,["734"] = 736,["735"] = 737,["738"] = 738,["739"] = 738,["740"] = 738,["741"] = 738,["742"] = 738,["743"] = 738,["744"] = 738,["745"] = 738,["746"] = 735});
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
    self.activeRoundStartedAt = nil
    self.playerStates = __TS__New(Map)
    self.roundPollTimerName = "RoundController_Poll"
    self.neutralPollTimerName = "RoundController_NeutralPeacePoll"
    self.botFunNextAt = __TS__New(Map)
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
    self.activeRoundStartedAt = GameRules:GetGameTime()
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
    self.activeRoundStartedAt = nil
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
            endTime = 0.2,
            callback = function()
                if self.activeRoundNumber ~= round then
                    return nil
                end
                local startedAt = self.activeRoundStartedAt or GameRules:GetGameTime()
                local elapsed = GameRules:GetGameTime() - startedAt
                if elapsed >= 80 then
                    self:forceFinishRoundByTimeout()
                end
                self:enforceBotsOnArenas()
                local allFinished = true
                for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
                    do
                        local st = self.playerStates:get(pid)
                        if not st then
                            goto __continue37
                        end
                        if st.finished then
                            goto __continue37
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
                    ::__continue37::
                end
                if allFinished then
                    self:endRound(round)
                    return nil
                end
                return 0.2
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
                local safeBounds = self.layout.neutral.bounds
                local extBounds = self.layout.neutral.extendedBounds
                for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
                    do
                        local hero = self.playerManager:getPlayerHero(pid) or PlayerResource:GetSelectedHeroEntity(pid)
                        if not hero or not IsValidEntity(hero) then
                            goto __continue57
                        end
                        self:autoDeliverStashItems(hero)
                        local o = hero:GetAbsOrigin()
                        local p = {x = o.x, y = o.y, z = o.z}
                        local inSafe = p.x >= safeBounds.mins.x and p.x <= safeBounds.maxs.x and p.y >= safeBounds.mins.y and p.y <= safeBounds.maxs.y
                        local inExtended = p.x >= extBounds.mins.x and p.x <= extBounds.maxs.x and p.y >= extBounds.mins.y and p.y <= extBounds.maxs.y
                        if inSafe then
                            self.peaceMode:applyToHero(hero)
                            if not hero:HasModifier("modifier_arcpit_neutral_regen") then
                                hero:AddNewModifier(hero, nil, "modifier_arcpit_neutral_regen", {})
                            end
                            if hero:HasModifier("modifier_arcpit_neutral_mana_regen") then
                                hero:RemoveModifierByName("modifier_arcpit_neutral_mana_regen")
                            end
                            if PlayerResource:IsFakeClient(pid) then
                                self:applyBotBaseFun(pid, hero)
                            end
                        elseif inExtended then
                            self.peaceMode:removeFromHero(hero)
                            if hero:HasModifier("modifier_arcpit_neutral_regen") then
                                hero:RemoveModifierByName("modifier_arcpit_neutral_regen")
                            end
                            if not hero:HasModifier("modifier_arcpit_neutral_mana_regen") then
                                hero:AddNewModifier(hero, nil, "modifier_arcpit_neutral_mana_regen", {})
                            end
                            if PlayerResource:IsFakeClient(pid) then
                                self:applyBotBaseFun(pid, hero)
                            end
                        else
                            self.peaceMode:removeFromHero(hero)
                            if hero:HasModifier("modifier_arcpit_neutral_regen") then
                                hero:RemoveModifierByName("modifier_arcpit_neutral_regen")
                            end
                            if hero:HasModifier("modifier_arcpit_neutral_mana_regen") then
                                hero:RemoveModifierByName("modifier_arcpit_neutral_mana_regen")
                            end
                            if PlayerResource:IsFakeClient(pid) then
                                self.botFunNextAt:delete(pid)
                            end
                        end
                    end
                    ::__continue57::
                end
                return 0.25
            end
        }
    )
end
function RoundController.prototype.enforceBotsOnArenas(self)
    if self.activeRoundNumber == nil then
        return
    end
    if not self.layout then
        return
    end
    for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
        do
            if not PlayerResource:IsFakeClient(pid) then
                goto __continue75
            end
            local st = self.playerStates:get(pid)
            if not st or st.finished then
                goto __continue75
            end
            local hasAliveCreeps = __TS__ArraySome(
                st.creeps,
                function(____, idx)
                    local ent = EntIndexToHScript(idx)
                    return ent and IsValidEntity(ent) and ent:IsAlive()
                end
            )
            if not hasAliveCreeps then
                goto __continue75
            end
            local hero = self.playerManager:getPlayerHero(pid) or PlayerResource:GetSelectedHeroEntity(pid)
            if not hero or not IsValidEntity(hero) then
                goto __continue75
            end
            local slot = self.layout.byId[st.arenaId]
            local ho = hero:GetAbsOrigin()
            local hpos = Vector(ho.x, ho.y, ho.z)
            if not hero:IsAlive() then
                st.pendingRespawnPos = Vector(slot.spawn.x, slot.spawn.y, slot.spawn.z)
                goto __continue75
            end
            local inArena = slot:contains2D({x = hpos.x, y = hpos.y, z = hpos.z})
            if not inArena then
                local spawn = Vector(slot.spawn.x, slot.spawn.y, slot.spawn.z)
                hero:SetAbsOrigin(spawn)
                FindClearSpaceForUnit(hero, spawn, true)
                st.lastCombatPos = Vector(spawn.x, spawn.y, spawn.z)
                self:enforceExclusiveControl(hero)
                self:forceAutoAttack(pid, hero)
            end
        end
        ::__continue75::
    end
end
function RoundController.prototype.forceFinishRoundByTimeout(self)
    if self.activeRoundNumber == nil then
        return
    end
    for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
        do
            local st = self.playerStates:get(pid)
            if not st or st.finished then
                goto __continue86
            end
            for ____, idx in ipairs(st.creeps) do
                do
                    local ent = EntIndexToHScript(idx)
                    if not ent or not IsValidEntity(ent) then
                        goto __continue88
                    end
                    local creep = ent
                    if not creep:IsAlive() then
                        goto __continue88
                    end
                    do
                        pcall(function()
                            local ____this_3
                            ____this_3 = creep
                            local ____opt_2 = ____this_3.RemoveSelf
                            if ____opt_2 ~= nil then
                                ____opt_2(____this_3)
                            end
                        end)
                    end
                    do
                        pcall(function()
                            local ____this_5
                            ____this_5 = _G
                            local ____opt_4 = ____this_5.UTIL_Remove
                            if ____opt_4 ~= nil then
                                ____opt_4(____this_5, creep)
                            end
                        end)
                    end
                end
                ::__continue88::
            end
            st.finished = true
            self:returnPlayerToNeutral(pid)
        end
        ::__continue86::
    end
end
function RoundController.prototype.applyBotBaseFun(self, pid, hero)
    if hero:HasModifier("modifier_arcpit_bot_fun_hunt") or hero:HasModifier("modifier_arcpit_bot_fun_wander") then
        return
    end
    local now = GameRules:GetGameTime()
    local prev = self.botFunNextAt:get(pid)
    local nextAt = prev ~= nil and prev or 0
    if now < nextAt then
        return
    end
    self.botFunNextAt:set(pid, now + 5)
    local roll = RandomInt(1, 100)
    local name = roll <= 50 and "modifier_arcpit_bot_fun_hunt" or "modifier_arcpit_bot_fun_wander"
    hero:AddNewModifier(hero, nil, name, {duration = 5})
end
function RoundController.prototype.autoDeliverStashItems(self, hero)
    local MAIN_AND_BACKPACK = {
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
    }
    local STASH = {
        9,
        10,
        11,
        12,
        13,
        14
    }
    local free = {}
    for ____, s in ipairs(MAIN_AND_BACKPACK) do
        local it = hero:GetItemInSlot(s)
        if not it then
            free[#free + 1] = s
        end
    end
    if #free <= 0 then
        return
    end
    local moved = 0
    local freeIdx = 0
    for ____, stashSlot in ipairs(STASH) do
        do
            if freeIdx >= #free then
                break
            end
            local it = hero:GetItemInSlot(stashSlot)
            if not it then
                goto __continue103
            end
            local dst = free[freeIdx + 1]
            freeIdx = freeIdx + 1
            local swapped = false
            do
                local function ____catch(e)
                    swapped = false
                end
                local ____try, ____hasReturned = pcall(function()
                    local h = hero
                    if type(h.SwapItems) == "function" then
                        h:SwapItems(stashSlot, dst)
                        swapped = true
                    end
                end)
                if not ____try then
                    ____catch(____hasReturned)
                end
            end
            if swapped then
                moved = moved + 1
            end
        end
        ::__continue103::
    end
    if moved > 0 then
    end
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
                    goto __continue114
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
            ::__continue114::
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
                    goto __continue123
                end
                hero:SetControllableByPlayer(p, false)
            end
            ::__continue123::
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
    local talents = {}
    do
        local i = 0
        while i < hero:GetAbilityCount() do
            do
                local a = hero:GetAbilityByIndex(i)
                if not a then
                    goto __continue137
                end
                local name = a:GetAbilityName()
                if not name then
                    goto __continue137
                end
                if a:GetMaxLevel() <= 0 then
                    goto __continue137
                end
                if __TS__StringStartsWith(name, "special_bonus_") then
                    talents[#talents + 1] = a
                else
                    abil[#abil + 1] = a
                end
            end
            ::__continue137::
            i = i + 1
        end
    end
    if #abil == 0 and #talents == 0 then
        return
    end
    local guard = 0
    local idx = 0
    while points > 0 and guard < 5000 do
        do
            guard = guard + 1
            if #abil <= 0 then
                break
            end
            local a = abil[idx % #abil + 1]
            idx = idx + 1
            if not a then
                goto __continue144
            end
            if a:GetLevel() >= a:GetMaxLevel() then
                goto __continue144
            end
            local newLevel = a:GetLevel() + 1
            a:SetLevel(newLevel)
            points = hero:GetAbilityPoints()
            hero:SetAbilityPoints(math.max(0, points - 1))
            points = hero:GetAbilityPoints()
        end
        ::__continue144::
    end
    if points > 0 and #talents > 0 then
        local tguard = 0
        local tidx = 0
        while points > 0 and tguard < 256 do
            do
                tguard = tguard + 1
                local t = talents[tidx % #talents + 1]
                tidx = tidx + 1
                if not t then
                    goto __continue149
                end
                if t:GetLevel() >= t:GetMaxLevel() then
                    goto __continue149
                end
                t:SetLevel(t:GetLevel() + 1)
                points = hero:GetAbilityPoints()
                hero:SetAbilityPoints(math.max(0, points - 1))
                points = hero:GetAbilityPoints()
            end
            ::__continue149::
        end
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
