local ____lualib = require("lualib_bundle")
local Set = ____lualib.Set
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 1,["8"] = 1,["9"] = 2,["10"] = 2,["12"] = 7,["13"] = 8,["14"] = 11,["15"] = 12,["16"] = 13,["17"] = 16,["18"] = 17,["19"] = 18,["20"] = 19,["21"] = 20,["22"] = 21,["23"] = 24,["24"] = 25,["25"] = 26,["26"] = 28,["27"] = 7,["29"] = 34,["30"] = 35,["31"] = 37,["32"] = 38,["33"] = 39,["34"] = 40,["35"] = 41,["36"] = 42,["37"] = 45,["38"] = 46,["39"] = 50,["40"] = 51,["41"] = 52,["42"] = 52,["43"] = 52,["44"] = 54,["45"] = 54,["48"] = 56,["49"] = 57,["50"] = 57,["52"] = 61,["53"] = 62,["54"] = 63,["56"] = 64,["57"] = 65,["58"] = 65,["60"] = 66,["61"] = 67,["62"] = 67,["64"] = 68,["65"] = 69,["66"] = 70,["72"] = 75,["73"] = 76,["74"] = 76,["76"] = 77,["77"] = 78,["78"] = 78,["80"] = 80,["81"] = 81,["82"] = 82,["83"] = 82,["85"] = 84,["86"] = 88,["87"] = 88,["88"] = 88,["89"] = 88,["90"] = 88,["91"] = 88,["92"] = 88,["93"] = 88,["94"] = 88,["95"] = 88,["96"] = 88,["97"] = 100,["98"] = 101,["102"] = 55,["105"] = 104,["106"] = 54,["107"] = 54,["108"] = 54,["109"] = 107,["110"] = 107,["113"] = 110,["114"] = 111,["115"] = 112,["116"] = 112,["118"] = 114,["119"] = 115,["120"] = 116,["121"] = 116,["123"] = 118,["124"] = 119,["125"] = 120,["126"] = 120,["128"] = 122,["129"] = 123,["130"] = 126,["131"] = 127,["135"] = 108,["138"] = 130,["139"] = 107,["140"] = 107,["141"] = 107,["142"] = 133,["143"] = 133,["146"] = 135,["147"] = 136,["148"] = 136,["150"] = 137,["151"] = 138,["152"] = 138,["154"] = 140,["155"] = 141,["156"] = 141,["158"] = 143,["159"] = 144,["160"] = 145,["161"] = 145,["163"] = 149,["166"] = 134,["169"] = 151,["170"] = 133,["171"] = 133,["172"] = 133,["173"] = 155,["174"] = 34,["176"] = 161,["178"] = 163,["179"] = 163,["180"] = 164,["181"] = 165,["182"] = 163,["185"] = 161});
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
    GameRules:SetStrategyTime(0)
    GameRules:SetShowcaseTime(0)
    GameRules:SetPreGameTime(3)
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
    local nb = layout.neutral.bounds
    local function inNeutral2D(____, pos)
        return pos.x >= nb.mins.x and pos.x <= nb.maxs.x and pos.y >= nb.mins.y and pos.y <= nb.maxs.y
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
                                    goto __continue9
                                end
                                local u = ent
                                if not u.IsHero or not u:IsHero() then
                                    goto __continue9
                                end
                                local owner = u:GetPlayerID()
                                if owner ~= nil and owner ~= issuerPid then
                                    return true, false
                                end
                            end
                            ::__continue9::
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
                    if not inNeutral2D(nil, pos) then
                        return true, true
                    end
                    local order = keys.order_type
                    local blocked = __TS__New(Set, {
                        DOTA_UNIT_ORDER_ATTACK_TARGET,
                        DOTA_UNIT_ORDER_ATTACK_MOVE,
                        DOTA_UNIT_ORDER_CAST_TARGET,
                        DOTA_UNIT_ORDER_CAST_POSITION,
                        DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        DOTA_UNIT_ORDER_CAST_TOGGLE,
                        DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
                        DOTA_UNIT_ORDER_CAST_RUNE,
                        DOTA_UNIT_ORDER_CAST_TARGET_TREE
                    })
                    if blocked:has(order) then
                        return true, false
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
                    if inNeutral2D(nil, vpos) then
                        return true, false
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
                    if not inNeutral2D(nil, ppos) then
                        return true, true
                    end
                    return true, false
                end)
                if ____try and ____hasReturned then
                    return ____returnValue
                end
            end
            return true
        end,
        gameMode
    )
    gameMode:SetCustomGameForceHero("npc_dota_hero_wisp")
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
