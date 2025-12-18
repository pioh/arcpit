local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["8"] = 2,["9"] = 2,["11"] = 8,["12"] = 8,["13"] = 8,["14"] = 10,["15"] = 10,["16"] = 9,["17"] = 13,["18"] = 14,["19"] = 13,["20"] = 17,["21"] = 18,["22"] = 20,["23"] = 25,["24"] = 25,["25"] = 25,["26"] = 26,["27"] = 27,["28"] = 25,["29"] = 25,["30"] = 17});
local ____exports = {}
local ____types = require("game-stages.types")
local GameStage = ____types.GameStage
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- Стадия выбора способностей
____exports.AbilitySelectionStage = __TS__Class()
local AbilitySelectionStage = ____exports.AbilitySelectionStage
AbilitySelectionStage.name = "AbilitySelectionStage"
function AbilitySelectionStage.prototype.____constructor(self, abilityManager)
    self.abilityManager = abilityManager
end
function AbilitySelectionStage.prototype.getName(self)
    return "Ability Selection"
end
function AbilitySelectionStage.prototype.start(self)
    print("=== Starting ability selection phase ===")
    CustomGameEventManager:Send_ServerToAllClients("stage_changed", {stage = GameStage.ABILITY_SELECTION, duration = GAME_CONSTANTS.ABILITY_SELECTION_TIME})
    Timers:CreateTimer(
        GAME_CONSTANTS.ABILITY_SELECTION_TIME,
        function()
            self.abilityManager:autoSelectForAllPlayers()
            return nil
        end
    )
end
return ____exports
