local ____lualib = require("lualib_bundle")
local __TS__Number = ____lualib.__TS__Number
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["8"] = 2,["9"] = 2,["11"] = 7,["12"] = 8,["13"] = 11,["14"] = 12,["15"] = 13,["16"] = 20,["17"] = 21,["18"] = 22,["19"] = 23,["20"] = 24,["21"] = 25,["22"] = 28,["23"] = 29,["24"] = 30,["25"] = 32,["26"] = 7,["28"] = 38,["29"] = 39,["30"] = 41,["31"] = 42,["32"] = 43,["33"] = 44,["34"] = 45,["35"] = 46,["36"] = 49,["37"] = 50,["38"] = 55,["39"] = 56,["40"] = 57,["41"] = 58,["42"] = 59,["43"] = 58,["44"] = 60,["45"] = 61,["46"] = 60,["47"] = 63,["48"] = 63,["51"] = 65,["52"] = 66,["53"] = 66,["55"] = 70,["56"] = 71,["57"] = 72,["59"] = 73,["60"] = 74,["61"] = 74,["63"] = 75,["64"] = 76,["65"] = 76,["67"] = 77,["68"] = 79,["69"] = 79,["71"] = 80,["72"] = 80,["78"] = 84,["79"] = 85,["80"] = 85,["82"] = 86,["83"] = 87,["84"] = 87,["86"] = 89,["87"] = 90,["88"] = 91,["89"] = 98,["90"] = 99,["91"] = 99,["92"] = 99,["94"] = 99,["95"] = 99,["96"] = 99,["98"] = 99,["99"] = 100,["100"] = 100,["102"] = 102,["103"] = 103,["104"] = 103,["106"] = 106,["109"] = 110,["112"] = 108,["113"] = 109,["114"] = 109,["121"] = 112,["122"] = 113,["123"] = 114,["127"] = 118,["128"] = 120,["134"] = 126,["135"] = 127,["136"] = 128,["137"] = 129,["138"] = 130,["139"] = 131,["144"] = 125,["149"] = 138,["150"] = 139,["151"] = 140,["152"] = 141,["156"] = 137,["159"] = 145,["161"] = 151,["162"] = 151,["166"] = 64,["169"] = 153,["170"] = 63,["171"] = 63,["172"] = 63,["173"] = 156,["174"] = 156,["177"] = 159,["178"] = 160,["179"] = 161,["180"] = 161,["182"] = 163,["183"] = 164,["184"] = 165,["185"] = 165,["187"] = 167,["188"] = 168,["189"] = 169,["190"] = 169,["192"] = 171,["193"] = 172,["194"] = 175,["195"] = 175,["197"] = 178,["198"] = 179,["199"] = 180,["200"] = 181,["201"] = 181,["206"] = 157,["209"] = 184,["210"] = 156,["211"] = 156,["212"] = 156,["213"] = 187,["214"] = 187,["217"] = 189,["218"] = 189,["219"] = 189,["221"] = 189,["222"] = 190,["223"] = 191,["224"] = 191,["226"] = 192,["227"] = 193,["228"] = 193,["230"] = 195,["231"] = 196,["232"] = 196,["234"] = 198,["235"] = 199,["236"] = 200,["237"] = 203,["238"] = 204,["240"] = 206,["241"] = 207,["243"] = 211,["244"] = 212,["245"] = 213,["246"] = 214,["247"] = 215,["248"] = 216,["251"] = 219,["253"] = 223,["254"] = 224,["255"] = 225,["256"] = 226,["257"] = 227,["258"] = 228,["259"] = 229,["260"] = 230,["261"] = 231,["262"] = 232,["269"] = 188,["272"] = 238,["273"] = 187,["274"] = 187,["275"] = 187,["278"] = 249,["279"] = 250,["280"] = 251,["281"] = 252,["285"] = 38,["287"] = 260,["289"] = 262,["290"] = 262,["291"] = 263,["292"] = 264,["293"] = 262,["296"] = 260});
local ____exports = {}
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
local ____arena_2Dlayout = require("shared.arena-layout")
local buildLayout = ____arena_2Dlayout.buildLayout
--- Настройка правил игры
function ____exports.configureGameRules(self)
    print("=== Configuring GameRules ===")
    GameRules:SetHeroRespawnEnabled(false)
    GameRules:SetUseUniversalShopMode(true)
    GameRules:SetSameHeroSelectionEnabled(true)
    GameRules:SetHeroSelectionTime(0)
    GameRules:SetStrategyTime(5)
    GameRules:SetShowcaseTime(0)
    GameRules:SetPreGameTime(0)
    GameRules:SetCustomGameSetupAutoLaunchDelay(0)
    GameRules:SetCustomGameSetupTimeout(0)
    GameRules:SetStartingGold(GAME_CONSTANTS.STARTING_GOLD)
    GameRules:SetGoldPerTick(GAME_CONSTANTS.GOLD_PER_TICK)
    GameRules:SetGoldTickTime(GAME_CONSTANTS.GOLD_TICK_TIME)
    print("=== GameRules configured ===")
end
--- Настройка игрового режима
function ____exports.configureGameMode(self)
    local gameMode = GameRules:GetGameModeEntity()
    gameMode:SetBuybackEnabled(false)
    gameMode:SetTopBarTeamValuesVisible(false)
    gameMode:SetAnnouncerDisabled(true)
    gameMode:SetKillingSpreeAnnouncerDisabled(true)
    gameMode:SetRecommendedItemsDisabled(true)
    gameMode:SetBotThinkingEnabled(false)
    gameMode:SetFogOfWarDisabled(true)
    gameMode:SetUnseenFogOfWarEnabled(false)
    local layout = buildLayout(nil, {debug = false, logPrefix = "[arena-layout]"})
    local safeB = layout.neutral.bounds
    local extB = layout.neutral.extendedBounds
    local function inNeutralSafe2D(____, pos)
        return pos.x >= safeB.mins.x and pos.x <= safeB.maxs.x and pos.y >= safeB.mins.y and pos.y <= safeB.maxs.y
    end
    local function inNeutralExtended2D(____, pos)
        return pos.x >= extB.mins.x and pos.x <= extB.maxs.x and pos.y >= extB.mins.y and pos.y <= extB.maxs.y
    end
    gameMode:SetExecuteOrderFilter(
        function(____, keys)
            do
                local ____try, ____hasReturned, ____returnValue = pcall(function()
                    local units = keys.units
                    if not units or #units <= 0 then
                        return true, true
                    end
                    local issuerPid = keys.issuer_player_id_const
                    if issuerPid ~= nil and PlayerResource:IsValidPlayerID(issuerPid) then
                        for ____, idx in ipairs(units) do
                            do
                                local ent = EntIndexToHScript(idx)
                                if not ent or not IsValidEntity(ent) then
                                    goto __continue10
                                end
                                local u2 = ent
                                if not u2.IsHero or not u2:IsHero() then
                                    goto __continue10
                                end
                                local owner = u2:GetPlayerID()
                                if owner == nil then
                                    return true, false
                                end
                                if owner ~= issuerPid then
                                    return true, false
                                end
                            end
                            ::__continue10::
                        end
                    end
                    local unit = EntIndexToHScript(units[1])
                    if not unit or not IsValidEntity(unit) then
                        return true, true
                    end
                    local u = unit
                    if not u.IsHero or not u:IsHero() then
                        return true, true
                    end
                    local o = u:GetAbsOrigin()
                    local pos = Vector(o.x, o.y, o.z)
                    local order = keys.order_type
                    if order == DOTA_UNIT_ORDER_PURCHASE_ITEM then
                        local ____keys_shop_item_name_0 = keys.shop_item_name
                        if ____keys_shop_item_name_0 == nil then
                            ____keys_shop_item_name_0 = keys.ShopItemName
                        end
                        local ____keys_shop_item_name_0_1 = ____keys_shop_item_name_0
                        if ____keys_shop_item_name_0_1 == nil then
                            ____keys_shop_item_name_0_1 = ""
                        end
                        local itemName = tostring(____keys_shop_item_name_0_1)
                        if not itemName or #itemName <= 0 then
                            return true, false
                        end
                        local hero = u
                        if not hero or not IsValidEntity(hero) then
                            return true, false
                        end
                        local cost = 0
                        do
                            local function ____catch(e)
                                cost = 0
                            end
                            local ____try, ____hasReturned = pcall(function()
                                local getCost = _G.GetItemCost
                                if type(getCost) == "function" then
                                    cost = __TS__Number(getCost(nil, itemName) or 0)
                                end
                            end)
                            if not ____try then
                                ____catch(____hasReturned)
                            end
                        end
                        local gold = hero:GetGold()
                        if cost > 0 and gold < cost then
                            return true, false
                        end
                        do
                            pcall(function()
                                if cost > 0 then
                                    hero:SpendGold(cost, 0)
                                end
                            end)
                        end
                        do
                            local ____try, ____hasReturned, ____returnValue = pcall(function()
                                local create = _G.CreateItem
                                if type(create) == "function" then
                                    local item = create(nil, itemName, hero, hero)
                                    if item ~= nil and item ~= nil then
                                        hero:AddItem(item)
                                        return true, false
                                    end
                                end
                            end)
                            if ____try and ____hasReturned then
                                return true, ____returnValue
                            end
                        end
                        do
                            local ____try, ____hasReturned, ____returnValue = pcall(function()
                                local h = hero
                                if type(h.AddItemByName) == "function" then
                                    h:AddItemByName(itemName)
                                    return true, false
                                end
                            end)
                            if ____try and ____hasReturned then
                                return true, ____returnValue
                            end
                        end
                        return true, false
                    end
                    if not inNeutralExtended2D(nil, pos) then
                        return true, true
                    end
                end)
                if ____try and ____hasReturned then
                    return ____returnValue
                end
            end
            return true
        end,
        gameMode
    )
    gameMode:SetDamageFilter(
        function(____, keys)
            do
                local ____try, ____hasReturned, ____returnValue = pcall(function()
                    local vIdx = keys.entindex_victim_const
                    local aIdx = keys.entindex_attacker_const
                    if vIdx == nil or aIdx == nil then
                        return true, true
                    end
                    local victim = EntIndexToHScript(vIdx)
                    local attacker = EntIndexToHScript(aIdx)
                    if not victim or not attacker then
                        return true, true
                    end
                    local v = victim
                    local a = attacker
                    if not v.IsHero or not v:IsHero() then
                        return true, true
                    end
                    local vo = v:GetAbsOrigin()
                    local vpos = Vector(vo.x, vo.y, vo.z)
                    if inNeutralSafe2D(nil, vpos) then
                        return true, false
                    end
                    if a and a.IsHero and a:IsHero() then
                        local ao = a:GetAbsOrigin()
                        local apos = Vector(ao.x, ao.y, ao.z)
                        if inNeutralSafe2D(nil, apos) then
                            return true, false
                        end
                    end
                end)
                if ____try and ____hasReturned then
                    return ____returnValue
                end
            end
            return true
        end,
        gameMode
    )
    gameMode:SetModifierGainedFilter(
        function(____, keys)
            do
                local ____try, ____hasReturned, ____returnValue = pcall(function()
                    local ____keys_name_const_2 = keys.name_const
                    if ____keys_name_const_2 == nil then
                        ____keys_name_const_2 = ""
                    end
                    local modifierName = tostring(____keys_name_const_2)
                    local parentIdx = keys.entindex_parent_const
                    if parentIdx == nil then
                        return true, true
                    end
                    local parent = EntIndexToHScript(parentIdx)
                    if not parent or not IsValidEntity(parent) then
                        return true, true
                    end
                    local p = parent
                    if not p.IsHero or not p:IsHero() then
                        return true, true
                    end
                    local po = p:GetAbsOrigin()
                    local ppos = Vector(po.x, po.y, po.z)
                    local parentInNeutralSafe = inNeutralSafe2D(nil, ppos)
                    if modifierName == "modifier_arcpit_neutral_regen" then
                        return true, true
                    end
                    if modifierName == "modifier_arcpit_neutral_mana_regen" then
                        return true, true
                    end
                    if parentInNeutralSafe then
                        local casterIdx = keys.entindex_caster_const
                        if casterIdx ~= nil then
                            local caster = EntIndexToHScript(casterIdx)
                            if caster and IsValidEntity(caster) and caster == parent then
                                return true, true
                            end
                        end
                        return true, false
                    end
                    local casterIdx = keys.entindex_caster_const
                    if casterIdx ~= nil then
                        local caster = EntIndexToHScript(casterIdx)
                        if caster ~= nil and caster ~= nil and IsValidEntity(caster) then
                            local c = caster
                            if c.GetAbsOrigin ~= nil and c.GetAbsOrigin ~= nil then
                                local co = c:GetAbsOrigin()
                                local cpos = Vector(co.x, co.y, co.z)
                                if inNeutralSafe2D(nil, cpos) then
                                    return true, false
                                end
                            end
                        end
                    end
                end)
                if ____try and ____hasReturned then
                    return ____returnValue
                end
            end
            return true
        end,
        gameMode
    )
    do
        pcall(function()
            local send = _G.SendToServerConsole
            if type(send) == "function" then
                send(nil, "dota_npc_disable_wearables 1")
                send(nil, "dota_disable_cosmetics 1")
            end
        end)
    end
end
--- Настройка команд
function ____exports.configureTeams(self)
    do
        local i = 0
        while i < GAME_CONSTANTS.MAX_PLAYERS do
            local team = DOTA_TEAM_CUSTOM_1 + i
            GameRules:SetCustomGameTeamMaxPlayers(team, 1)
            i = i + 1
        end
    end
end
return ____exports
