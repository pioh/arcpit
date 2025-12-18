local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 1,["8"] = 1,["10"] = 10,["11"] = 10,["12"] = 10,["13"] = 12,["14"] = 12,["15"] = 13,["16"] = 14,["17"] = 15,["18"] = 11,["19"] = 21,["20"] = 22,["21"] = 24,["22"] = 25,["23"] = 28,["24"] = 31,["25"] = 21,["26"] = 37,["27"] = 38,["29"] = 40,["30"] = 40,["32"] = 41,["33"] = 41,["35"] = 43,["36"] = 44,["37"] = 46,["38"] = 47,["39"] = 48,["40"] = 49,["42"] = 51,["46"] = 40,["49"] = 37,["50"] = 59,["51"] = 60,["52"] = 61,["54"] = 63,["55"] = 63,["57"] = 64,["58"] = 64,["60"] = 66,["61"] = 67,["62"] = 67,["64"] = 70,["65"] = 71,["66"] = 73,["67"] = 73,["68"] = 73,["69"] = 73,["70"] = 73,["71"] = 73,["72"] = 73,["73"] = 73,["74"] = 73,["75"] = 73,["76"] = 73,["77"] = 85,["78"] = 86,["79"] = 86,["80"] = 86,["81"] = 86,["82"] = 86,["84"] = 92,["85"] = 92,["86"] = 92,["87"] = 92,["88"] = 92,["92"] = 63,["95"] = 59});
local ____exports = {}
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- Запуск боя
____exports.CombatStarter = __TS__Class()
local CombatStarter = ____exports.CombatStarter
CombatStarter.name = "CombatStarter"
function CombatStarter.prototype.____constructor(self, peaceMode, botManager, teamAssignment, playerManager)
    self.peaceMode = peaceMode
    self.botManager = botManager
    self.teamAssignment = teamAssignment
    self.playerManager = playerManager
end
function CombatStarter.prototype.startCombat(self)
    print("=== Starting combat phase - everyone is now enemies! ===")
    self.botManager:enableBotCombat()
    self.peaceMode:disable()
    self:assignPlayersToTeams()
    self:issueAttackOrders()
end
function CombatStarter.prototype.assignPlayersToTeams(self)
    local playerHeroes = self.playerManager:getAllPlayerHeroes()
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue6
                end
                local hero = playerHeroes:get(i)
                local team = self.teamAssignment:getPlayerTeam(i) or DOTA_TEAM_CUSTOM_1 + i
                if hero and IsValidEntity(hero) then
                    hero:SetTeam(team)
                    self.peaceMode:removeFromHero(hero)
                    print(((("Player " .. tostring(i)) .. " set to team ") .. tostring(team)) .. " - now enemies!")
                else
                    print("✗ Hero not found for player " .. tostring(i))
                end
            end
            ::__continue6::
            i = i + 1
        end
    end
end
function CombatStarter.prototype.issueAttackOrders(self)
    local playerHeroes = self.playerManager:getAllPlayerHeroes()
    local center = Vector(0, 0, 128)
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue12
                end
                local hero = playerHeroes:get(i)
                if not hero or not IsValidEntity(hero) or not hero:IsAlive() then
                    goto __continue12
                end
                local ho = hero:GetAbsOrigin()
                local heroOrigin = Vector(ho.x, ho.y, ho.z)
                local enemies = FindUnitsInRadius(
                    hero:GetTeamNumber(),
                    heroOrigin,
                    nil,
                    GAME_CONSTANTS.COMBAT_SEARCH_RADIUS,
                    DOTA_UNIT_TARGET_TEAM_ENEMY,
                    DOTA_UNIT_TARGET_HERO,
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
                else
                    ExecuteOrderFromTable({
                        UnitIndex = hero:entindex(),
                        OrderType = DOTA_UNIT_ORDER_ATTACK_MOVE,
                        Position = center
                    })
                end
            end
            ::__continue12::
            i = i + 1
        end
    end
end
return ____exports
