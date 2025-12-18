local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["10"] = 13,["11"] = 13,["12"] = 13,["13"] = 17,["14"] = 17,["15"] = 14,["16"] = 16,["17"] = 20,["18"] = 21,["19"] = 22,["22"] = 23,["23"] = 25,["25"] = 26,["26"] = 26,["28"] = 29,["29"] = 30,["30"] = 30,["32"] = 32,["33"] = 33,["34"] = 33,["36"] = 34,["37"] = 34,["39"] = 36,["40"] = 36,["42"] = 38,["46"] = 20,["47"] = 42,["48"] = 43,["49"] = 44,["50"] = 45,["51"] = 47,["52"] = 47,["53"] = 47,["54"] = 47,["55"] = 47,["56"] = 47,["57"] = 47,["58"] = 47,["59"] = 47,["60"] = 47,["61"] = 47,["62"] = 59,["65"] = 60,["67"] = 63,["68"] = 63,["70"] = 64,["71"] = 65,["72"] = 65,["74"] = 66,["75"] = 66,["77"] = 67,["78"] = 67,["80"] = 68,["81"] = 68,["83"] = 69,["84"] = 69,["86"] = 71,["87"] = 72,["88"] = 73,["89"] = 73,["90"] = 73,["91"] = 73,["92"] = 73,["95"] = 80,["96"] = 81,["97"] = 81,["98"] = 81,["99"] = 81,["100"] = 81,["101"] = 81,["104"] = 89,["105"] = 90,["106"] = 91,["107"] = 91,["108"] = 91,["109"] = 91,["110"] = 91,["111"] = 91,["116"] = 63,["119"] = 101,["120"] = 101,["121"] = 101,["122"] = 101,["123"] = 101,["124"] = 42});
local ____exports = {}
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- AI takeover для героев людей, которые дисконнектнулись.
-- Важно: НЕ создаёт новых bot-слотов — просто отдаёт приказы герою.
____exports.AiTakeoverController = __TS__Class()
local AiTakeoverController = ____exports.AiTakeoverController
AiTakeoverController.name = "AiTakeoverController"
function AiTakeoverController.prototype.____constructor(self, playerManager)
    self.playerManager = playerManager
    self.tickAccumulator = 0
end
function AiTakeoverController.prototype.tick(self, dt, isRoundActive)
    self.tickAccumulator = self.tickAccumulator + dt
    if self.tickAccumulator < 0.25 then
        return
    end
    self.tickAccumulator = 0
    for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
        do
            if PlayerResource:IsFakeClient(pid) then
                goto __continue5
            end
            local connected = PlayerResource:GetPlayer(pid) ~= nil
            if connected then
                goto __continue5
            end
            local hero = self.playerManager:getPlayerHero(pid) or PlayerResource:GetSelectedHeroEntity(pid)
            if not hero or not IsValidEntity(hero) then
                goto __continue5
            end
            if not hero:IsAlive() then
                goto __continue5
            end
            if not isRoundActive then
                goto __continue5
            end
            self:think(hero)
        end
        ::__continue5::
    end
end
function AiTakeoverController.prototype.think(self, hero)
    local team = hero:GetTeamNumber()
    local o = hero:GetAbsOrigin()
    local origin = Vector(o.x, o.y, o.z)
    local enemies = FindUnitsInRadius(
        team,
        origin,
        nil,
        GAME_CONSTANTS.BOT_SEARCH_RADIUS,
        DOTA_UNIT_TARGET_TEAM_ENEMY,
        DOTA_UNIT_TARGET_BASIC,
        DOTA_UNIT_TARGET_FLAG_NONE,
        FIND_CLOSEST,
        false
    )
    if #enemies <= 0 then
        return
    end
    local target = enemies[1]
    do
        local i = 0
        while i < hero:GetAbilityCount() do
            do
                local ab = hero:GetAbilityByIndex(i)
                if not ab then
                    goto __continue15
                end
                if ab:GetLevel() <= 0 then
                    goto __continue15
                end
                if ab:IsCooldownReady() ~= true then
                    goto __continue15
                end
                if ab:IsFullyCastable() ~= true then
                    goto __continue15
                end
                if ab.IsPassive and ab:IsPassive() then
                    goto __continue15
                end
                local behavior = ab:GetBehavior()
                if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_NO_TARGET) ~= 0 then
                    ExecuteOrderFromTable({
                        UnitIndex = hero:entindex(),
                        OrderType = DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex = ab:entindex()
                    })
                    return
                end
                if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) ~= 0 then
                    ExecuteOrderFromTable({
                        UnitIndex = hero:entindex(),
                        OrderType = DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex = target:entindex(),
                        AbilityIndex = ab:entindex()
                    })
                    return
                end
                if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_POINT) ~= 0 then
                    local to = target:GetAbsOrigin()
                    ExecuteOrderFromTable({
                        UnitIndex = hero:entindex(),
                        OrderType = DOTA_UNIT_ORDER_CAST_POSITION,
                        Position = Vector(to.x, to.y, to.z),
                        AbilityIndex = ab:entindex()
                    })
                    return
                end
            end
            ::__continue15::
            i = i + 1
        end
    end
    ExecuteOrderFromTable({
        UnitIndex = hero:entindex(),
        OrderType = DOTA_UNIT_ORDER_ATTACK_TARGET,
        TargetIndex = target:entindex()
    })
end
return ____exports
