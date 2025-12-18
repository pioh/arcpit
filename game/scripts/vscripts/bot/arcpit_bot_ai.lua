local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 6,["6"] = 6,["7"] = 16,["8"] = 17,["9"] = 17,["11"] = 18,["12"] = 18,["14"] = 21,["15"] = 22,["16"] = 23,["18"] = 26,["19"] = 29,["20"] = 29,["21"] = 32,["22"] = 33,["23"] = 34,["24"] = 29,["25"] = 29,["26"] = 29,["27"] = 29,["28"] = 29,["29"] = 29,["30"] = 29,["31"] = 29,["32"] = 29,["33"] = 45,["34"] = 46,["36"] = 49,["37"] = 49,["39"] = 50,["40"] = 51,["41"] = 51,["43"] = 52,["44"] = 52,["46"] = 53,["47"] = 53,["49"] = 54,["50"] = 54,["52"] = 55,["53"] = 55,["55"] = 57,["56"] = 59,["57"] = 60,["58"] = 60,["59"] = 60,["60"] = 60,["61"] = 60,["62"] = 65,["64"] = 69,["65"] = 70,["66"] = 70,["67"] = 70,["68"] = 70,["69"] = 70,["70"] = 70,["71"] = 76,["73"] = 80,["74"] = 81,["75"] = 82,["76"] = 82,["77"] = 82,["78"] = 82,["79"] = 82,["80"] = 82,["81"] = 88,["85"] = 49,["88"] = 92,["89"] = 92,["90"] = 92,["91"] = 92,["92"] = 92,["93"] = 97,["95"] = 100,["96"] = 16,["97"] = 104,["98"] = 105});
local ____exports = {}
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
local function BotThink(self)
    if not thisEntity or not IsValidEntity(thisEntity) then
        return 0.5
    end
    if not thisEntity:IsAlive() then
        return 0.5
    end
    local addon = GameRules.Addon
    if not (addon and addon.isRoundActive) then
        return 0.5
    end
    local team = thisEntity:GetTeamNumber()
    local enemies = FindUnitsInRadius(
        team,
        (function()
            local o = thisEntity:GetAbsOrigin()
            return Vector(o.x, o.y, o.z)
        end)(nil),
        nil,
        GAME_CONSTANTS.BOT_SEARCH_RADIUS,
        DOTA_UNIT_TARGET_TEAM_ENEMY,
        DOTA_UNIT_TARGET_BASIC,
        DOTA_UNIT_TARGET_FLAG_NONE,
        FIND_CLOSEST,
        false
    )
    if #enemies > 0 then
        local target = enemies[1]
        do
            local i = 0
            while i < thisEntity:GetAbilityCount() do
                do
                    local ab = thisEntity:GetAbilityByIndex(i)
                    if not ab then
                        goto __continue9
                    end
                    if ab:GetLevel() <= 0 then
                        goto __continue9
                    end
                    if ab:IsCooldownReady() ~= true then
                        goto __continue9
                    end
                    if ab:IsFullyCastable() ~= true then
                        goto __continue9
                    end
                    if ab.IsPassive and ab:IsPassive() then
                        goto __continue9
                    end
                    local behavior = ab:GetBehavior()
                    if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_NO_TARGET) ~= 0 then
                        ExecuteOrderFromTable({
                            UnitIndex = thisEntity:entindex(),
                            OrderType = DOTA_UNIT_ORDER_CAST_NO_TARGET,
                            AbilityIndex = ab:entindex()
                        })
                        return 0.35
                    end
                    if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) ~= 0 then
                        ExecuteOrderFromTable({
                            UnitIndex = thisEntity:entindex(),
                            OrderType = DOTA_UNIT_ORDER_CAST_TARGET,
                            TargetIndex = target:entindex(),
                            AbilityIndex = ab:entindex()
                        })
                        return 0.35
                    end
                    if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_POINT) ~= 0 then
                        local to = target:GetAbsOrigin()
                        ExecuteOrderFromTable({
                            UnitIndex = thisEntity:entindex(),
                            OrderType = DOTA_UNIT_ORDER_CAST_POSITION,
                            Position = Vector(to.x, to.y, to.z),
                            AbilityIndex = ab:entindex()
                        })
                        return 0.35
                    end
                end
                ::__continue9::
                i = i + 1
            end
        end
        ExecuteOrderFromTable({
            UnitIndex = thisEntity:entindex(),
            OrderType = DOTA_UNIT_ORDER_ATTACK_TARGET,
            TargetIndex = target:entindex()
        })
        return 0.25
    end
    return 0.5
end
if thisEntity and IsValidEntity(thisEntity) then
    thisEntity:SetContextThink("ArcpitBotThink", BotThink, 0.5)
end
return ____exports
