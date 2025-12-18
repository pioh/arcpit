local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 2,["6"] = 2,["7"] = 2,["8"] = 2,["9"] = 2,["10"] = 2,["11"] = 2,["12"] = 2,["13"] = 2,["14"] = 2,["15"] = 2,["16"] = 2,["17"] = 2,["18"] = 2});
local ____exports = {}
____exports.GAME_CONSTANTS = {
    MAX_PLAYERS = 8,
    BOT_START_LEVEL = 30,
    HERO_SELECTION_TIME = 5,
    ABILITY_SELECTION_TIME = 5,
    PRE_COMBAT_TIME = 5,
    BETWEEN_ROUNDS_PLANNING_TIME = 10,
    STARTING_GOLD = 2000,
    GOLD_PER_TICK = 2,
    GOLD_TICK_TIME = 1,
    DEFAULT_ACQUISITION_RANGE = 800,
    BOT_SEARCH_RADIUS = 2500,
    COMBAT_SEARCH_RADIUS = 8000
}
return ____exports
