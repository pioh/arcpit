local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["8"] = 2,["9"] = 2,["11"] = 8,["12"] = 8,["13"] = 8,["14"] = 10,["15"] = 10,["16"] = 9,["17"] = 13,["18"] = 14,["19"] = 13,["20"] = 17,["21"] = 18,["22"] = 21,["23"] = 27,["24"] = 17});
local ____exports = {}
local ____types = require("game-stages.types")
local GameStage = ____types.GameStage
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- Стадия выбора героя
____exports.HeroSelectionStage = __TS__Class()
local HeroSelectionStage = ____exports.HeroSelectionStage
HeroSelectionStage.name = "HeroSelectionStage"
function HeroSelectionStage.prototype.____constructor(self, heroDraft)
    self.heroDraft = heroDraft
end
function HeroSelectionStage.prototype.getName(self)
    return "Hero Selection"
end
function HeroSelectionStage.prototype.start(self)
    print("=== Starting hero selection phase ===")
    CustomGameEventManager:Send_ServerToAllClients("stage_changed", {stage = GameStage.HERO_SELECTION, duration = GAME_CONSTANTS.HERO_SELECTION_TIME})
    self.heroDraft:start(GAME_CONSTANTS.HERO_SELECTION_TIME)
end
return ____exports
