local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["10"] = 13,["11"] = 13,["12"] = 13,["13"] = 17,["14"] = 17,["15"] = 14,["16"] = 16,["17"] = 20,["18"] = 21,["19"] = 22,["22"] = 23,["23"] = 25,["25"] = 26,["26"] = 30,["27"] = 31,["28"] = 32,["29"] = 32,["32"] = 35,["33"] = 36,["34"] = 36,["36"] = 37,["37"] = 37,["39"] = 39,["40"] = 39,["42"] = 41,["46"] = 20,["47"] = 45,["48"] = 46,["49"] = 47,["50"] = 48,["51"] = 50,["52"] = 50,["53"] = 50,["54"] = 50,["55"] = 50,["56"] = 50,["57"] = 50,["58"] = 50,["59"] = 50,["60"] = 50,["61"] = 50,["62"] = 62,["65"] = 63,["67"] = 66,["68"] = 66,["70"] = 67,["71"] = 68,["72"] = 68,["74"] = 69,["75"] = 69,["77"] = 70,["78"] = 70,["80"] = 71,["81"] = 71,["83"] = 72,["84"] = 72,["86"] = 74,["87"] = 75,["88"] = 76,["89"] = 76,["90"] = 76,["91"] = 76,["92"] = 76,["95"] = 83,["96"] = 84,["97"] = 84,["98"] = 84,["99"] = 84,["100"] = 84,["101"] = 84,["104"] = 92,["105"] = 93,["106"] = 94,["107"] = 94,["108"] = 94,["109"] = 94,["110"] = 94,["111"] = 94,["116"] = 66,["119"] = 104,["120"] = 104,["121"] = 104,["122"] = 104,["123"] = 104,["124"] = 45});
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
            local isBot = PlayerResource:IsFakeClient(pid)
            if not isBot then
                local connected = PlayerResource:GetPlayer(pid) ~= nil
                if connected then
                    goto __continue5
                end
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
