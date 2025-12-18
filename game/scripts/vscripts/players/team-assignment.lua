local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local Set = ____lualib.Set
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["9"] = 1,["10"] = 1,["12"] = 6,["13"] = 6,["14"] = 6,["16"] = 7,["17"] = 6,["18"] = 9,["19"] = 10,["20"] = 9,["21"] = 13,["22"] = 14,["23"] = 13,["24"] = 17,["25"] = 18,["26"] = 19,["27"] = 20,["28"] = 17,["29"] = 23,["30"] = 24,["31"] = 23,["32"] = 27,["33"] = 28,["34"] = 28,["35"] = 28,["36"] = 28,["38"] = 29,["39"] = 29,["40"] = 30,["41"] = 31,["42"] = 32,["44"] = 29,["47"] = 35,["48"] = 27});
local ____exports = {}
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- Управление назначением команд
____exports.TeamAssignment = __TS__Class()
local TeamAssignment = ____exports.TeamAssignment
TeamAssignment.name = "TeamAssignment"
function TeamAssignment.prototype.____constructor(self)
    self.playerTeams = __TS__New(Map)
end
function TeamAssignment.prototype.getPlayerTeam(self, playerID)
    return self.playerTeams:get(playerID)
end
function TeamAssignment.prototype.setPlayerTeam(self, playerID, team)
    self.playerTeams:set(playerID, team)
end
function TeamAssignment.prototype.assignTeamToPlayer(self, playerID)
    local team = self:getAvailableTeam()
    self.playerTeams:set(playerID, team)
    return team
end
function TeamAssignment.prototype.getAllPlayerTeams(self)
    return self.playerTeams
end
function TeamAssignment.prototype.getAvailableTeam(self)
    local usedTeams = __TS__New(
        Set,
        self.playerTeams:values()
    )
    do
        local i = 0
        while i < GAME_CONSTANTS.MAX_PLAYERS do
            local team = DOTA_TEAM_CUSTOM_1 + i
            if not usedTeams:has(team) then
                return team
            end
            i = i + 1
        end
    end
    return DOTA_TEAM_CUSTOM_1
end
return ____exports
