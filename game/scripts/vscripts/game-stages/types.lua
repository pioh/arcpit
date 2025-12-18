local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 2,["6"] = 3,["7"] = 3,["8"] = 4,["9"] = 4,["10"] = 5,["11"] = 5,["12"] = 6,["13"] = 6,["14"] = 7,["15"] = 7});
local ____exports = {}
____exports.GameStage = GameStage or ({})
____exports.GameStage.INIT = 0
____exports.GameStage[____exports.GameStage.INIT] = "INIT"
____exports.GameStage.HERO_SELECTION = 1
____exports.GameStage[____exports.GameStage.HERO_SELECTION] = "HERO_SELECTION"
____exports.GameStage.ABILITY_SELECTION = 2
____exports.GameStage[____exports.GameStage.ABILITY_SELECTION] = "ABILITY_SELECTION"
____exports.GameStage.PRE_COMBAT = 3
____exports.GameStage[____exports.GameStage.PRE_COMBAT] = "PRE_COMBAT"
____exports.GameStage.COMBAT = 4
____exports.GameStage[____exports.GameStage.COMBAT] = "COMBAT"
return ____exports
