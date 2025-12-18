local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["9"] = 7,["10"] = 7,["11"] = 7,["12"] = 9,["13"] = 9,["14"] = 8,["15"] = 12,["16"] = 13,["17"] = 12,["18"] = 16,["19"] = 17,["20"] = 20,["21"] = 22,["22"] = 16});
local ____exports = {}
local ____types = require("game-stages.types")
local GameStage = ____types.GameStage
--- Боевая стадия
____exports.CombatStage = __TS__Class()
local CombatStage = ____exports.CombatStage
CombatStage.name = "CombatStage"
function CombatStage.prototype.____constructor(self, roundController)
    self.roundController = roundController
end
function CombatStage.prototype.getName(self)
    return "Combat"
end
function CombatStage.prototype.start(self)
    print("=== Starting combat phase ===")
    self.roundController:onCombatStageStarted()
    CustomGameEventManager:Send_ServerToAllClients("stage_changed", {stage = GameStage.COMBAT, duration = 0})
end
return ____exports
