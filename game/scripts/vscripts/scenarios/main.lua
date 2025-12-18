local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 7,["8"] = 7,["9"] = 8,["10"] = 8,["11"] = 9,["12"] = 9,["14"] = 20,["15"] = 20,["16"] = 20,["17"] = 26,["18"] = 34,["19"] = 34,["20"] = 34,["21"] = 34,["22"] = 34,["23"] = 34,["24"] = 34,["25"] = 34,["26"] = 43,["27"] = 49,["28"] = 49,["29"] = 49,["30"] = 49,["31"] = 49,["32"] = 49,["33"] = 49,["34"] = 49,["35"] = 25,["36"] = 63,["37"] = 67,["38"] = 63,["39"] = 79,["40"] = 80,["41"] = 79});
local ____exports = {}
local ____scene_2Dbuilder = require("scenarios.scene-builder")
local SceneBuilder = ____scene_2Dbuilder.SceneBuilder
local ____default_2Dgame = require("scenarios.default-game")
local DefaultGameScenario = ____default_2Dgame.DefaultGameScenario
local ____test_2Dglaives_2Dvs_2Dcreeps = require("scenarios.test-glaives-vs-creeps")
local TestGlaivesVsCreeps = ____test_2Dglaives_2Dvs_2Dcreeps.TestGlaivesVsCreeps
--- Менеджер сценариев
____exports.ScenarioManager = __TS__Class()
local ScenarioManager = ____exports.ScenarioManager
ScenarioManager.name = "ScenarioManager"
function ScenarioManager.prototype.____constructor(self, playerManager, spawnManager, heroManager, abilityManager, peaceMode, stageManager)
    self.sceneBuilder = __TS__New(
        SceneBuilder,
        playerManager,
        spawnManager,
        heroManager,
        abilityManager,
        peaceMode
    )
    self.defaultGame = __TS__New(DefaultGameScenario, stageManager, playerManager, peaceMode)
    self.testGlaives = __TS__New(
        TestGlaivesVsCreeps,
        self.sceneBuilder,
        playerManager,
        peaceMode,
        heroManager,
        abilityManager
    )
end
function ScenarioManager.prototype.startSelectedScenario(self)
    self.defaultGame:start()
end
function ScenarioManager.prototype.getSceneBuilder(self)
    return self.sceneBuilder
end
return ____exports
