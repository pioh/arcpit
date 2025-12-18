local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 12,["8"] = 12,["9"] = 12,["10"] = 14,["11"] = 14,["12"] = 15,["13"] = 16,["14"] = 13,["15"] = 22,["16"] = 23,["17"] = 26,["18"] = 27,["19"] = 30,["20"] = 33,["21"] = 36,["22"] = 39,["23"] = 39,["24"] = 39,["25"] = 40,["26"] = 41,["27"] = 39,["28"] = 39,["29"] = 22});
local ____exports = {}
--- Основной режим игры
____exports.DefaultGameScenario = __TS__Class()
local DefaultGameScenario = ____exports.DefaultGameScenario
DefaultGameScenario.name = "DefaultGameScenario"
function DefaultGameScenario.prototype.____constructor(self, stageManager, playerManager, peaceMode)
    self.stageManager = stageManager
    self.playerManager = playerManager
    self.peaceMode = peaceMode
end
function DefaultGameScenario.prototype.start(self)
    print("=== Starting DEFAULT GAME scenario ===")
    self.peaceMode:enable()
    self.peaceMode:applyToAll()
    self.playerManager:giveGoldToAll(2000)
    self.playerManager:disableUnitSharing()
    self.playerManager:saveCurrentHeroes()
    Timers:CreateTimer(
        0.5,
        function()
            self.stageManager:startHeroSelection()
            return nil
        end
    )
end
return ____exports
