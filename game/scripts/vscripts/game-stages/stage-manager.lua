local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 5,["11"] = 5,["13"] = 11,["14"] = 11,["15"] = 11,["16"] = 17,["17"] = 12,["18"] = 13,["19"] = 22,["20"] = 23,["21"] = 24,["22"] = 25,["23"] = 16,["24"] = 28,["25"] = 29,["26"] = 28,["27"] = 32,["28"] = 33,["29"] = 36,["30"] = 36,["31"] = 36,["32"] = 38,["33"] = 39,["34"] = 36,["35"] = 36,["36"] = 32,["37"] = 43,["38"] = 43,["39"] = 43,["41"] = 44,["42"] = 47,["43"] = 52,["45"] = 52,["47"] = 54,["48"] = 54,["49"] = 54,["50"] = 55,["51"] = 56,["52"] = 54,["53"] = 54,["54"] = 43,["55"] = 60,["56"] = 61,["57"] = 60,["58"] = 64,["59"] = 65,["60"] = 66,["61"] = 68,["62"] = 69,["63"] = 70,["64"] = 71,["66"] = 73,["68"] = 64});
local ____exports = {}
local ____types = require("game-stages.types")
local GameStage = ____types.GameStage
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- Управление переходами между стадиями
____exports.StageManager = __TS__Class()
local StageManager = ____exports.StageManager
StageManager.name = "StageManager"
function StageManager.prototype.____constructor(self, heroSelectionStage, preCombatStage, combatStage, roundController)
    self.currentStage = GameStage.INIT
    self.stages = __TS__New(Map)
    self.stages:set(GameStage.HERO_SELECTION, heroSelectionStage)
    self.stages:set(GameStage.PRE_COMBAT, preCombatStage)
    self.stages:set(GameStage.COMBAT, combatStage)
    self.roundController = roundController
end
function StageManager.prototype.getCurrentStage(self)
    return self.currentStage
end
function StageManager.prototype.startHeroSelection(self)
    self:transitionTo(GameStage.HERO_SELECTION)
    Timers:CreateTimer(
        GAME_CONSTANTS.HERO_SELECTION_TIME,
        function()
            self:startPreCombat(GAME_CONSTANTS.PRE_COMBAT_TIME)
            return nil
        end
    )
end
function StageManager.prototype.startPreCombat(self, duration)
    if duration == nil then
        duration = GAME_CONSTANTS.PRE_COMBAT_TIME
    end
    self:transitionTo(GameStage.PRE_COMBAT)
    CustomGameEventManager:Send_ServerToAllClients("stage_changed", {stage = GameStage.PRE_COMBAT, duration = duration})
    local ____opt_0 = self.roundController
    if ____opt_0 ~= nil then
        ____opt_0:onPlanningStageStarted(duration)
    end
    Timers:CreateTimer(
        duration,
        function()
            self:startCombat()
            return nil
        end
    )
end
function StageManager.prototype.startCombat(self)
    self:transitionTo(GameStage.COMBAT)
end
function StageManager.prototype.transitionTo(self, stage)
    print(((("=== Transitioning from " .. tostring(self.currentStage)) .. " to ") .. tostring(stage)) .. " ===")
    self.currentStage = stage
    local handler = self.stages:get(stage)
    if handler then
        print("Starting stage: " .. handler:getName())
        handler:start()
    else
        print("WARNING: No handler for stage " .. tostring(stage))
    end
end
return ____exports
