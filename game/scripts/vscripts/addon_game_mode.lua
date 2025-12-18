local ____lualib = require("lualib_bundle")
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 2,["8"] = 2,["9"] = 3,["10"] = 6,["11"] = 6,["12"] = 6,["13"] = 6,["14"] = 11,["15"] = 13});
local ____exports = {}
require("lib.timers")
local ____GameMode = require("GameMode")
local GameMode = ____GameMode.GameMode
require("modifiers.modifiers")
__TS__ObjectAssign(
    getfenv(),
    {Activate = GameMode.Activate, Precache = GameMode.Precache}
)
if GameRules.Addon ~= nil then
    GameRules.Addon:Reload()
end
return ____exports
