local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 1,["8"] = 1,["9"] = 2,["10"] = 2,["12"] = 9,["13"] = 9,["14"] = 9,["15"] = 11,["16"] = 11,["17"] = 12,["18"] = 13,["19"] = 10,["20"] = 16,["21"] = 17,["22"] = 16,["23"] = 20,["24"] = 21,["25"] = 24,["26"] = 30,["27"] = 30,["28"] = 30,["29"] = 31,["30"] = 34,["31"] = 31,["32"] = 36,["33"] = 30,["34"] = 30,["35"] = 20});
local ____exports = {}
local ____types = require("game-stages.types")
local GameStage = ____types.GameStage
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- Стадия выбора героя
____exports.HeroSelectionStage = __TS__Class()
local HeroSelectionStage = ____exports.HeroSelectionStage
HeroSelectionStage.name = "HeroSelectionStage"
function HeroSelectionStage.prototype.____constructor(self, heroManager, spawnManager, playerHeroes)
    self.heroManager = heroManager
    self.spawnManager = spawnManager
    self.playerHeroes = playerHeroes
end
function HeroSelectionStage.prototype.getName(self)
    return "Hero Selection"
end
function HeroSelectionStage.prototype.start(self)
    print("=== Starting hero selection phase ===")
    CustomGameEventManager:Send_ServerToAllClients("stage_changed", {stage = GameStage.HERO_SELECTION, duration = GAME_CONSTANTS.HERO_SELECTION_TIME})
    Timers:CreateTimer(
        GAME_CONSTANTS.HERO_SELECTION_TIME,
        function()
            self.heroManager:autoSelectForAllPlayers(function()
                self.spawnManager:scatterHeroesInNeutral(self.playerHeroes)
            end)
            return nil
        end
    )
end
return ____exports
