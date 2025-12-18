local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 1,["10"] = 6,["11"] = 6,["13"] = 12,["14"] = 12,["15"] = 12,["16"] = 18,["17"] = 13,["18"] = 14,["19"] = 24,["20"] = 25,["21"] = 26,["22"] = 27,["23"] = 28,["24"] = 17,["25"] = 31,["26"] = 32,["27"] = 31,["28"] = 35,["29"] = 36,["30"] = 39,["31"] = 39,["32"] = 39,["33"] = 40,["34"] = 41,["35"] = 39,["36"] = 39,["37"] = 35,["38"] = 45,["39"] = 46,["40"] = 48,["41"] = 48,["42"] = 48,["43"] = 49,["44"] = 50,["45"] = 48,["46"] = 48,["47"] = 45,["48"] = 54,["49"] = 54,["50"] = 54,["52"] = 55,["53"] = 58,["54"] = 63,["56"] = 63,["58"] = 65,["59"] = 65,["60"] = 65,["61"] = 66,["62"] = 67,["63"] = 65,["64"] = 65,["65"] = 54,["66"] = 71,["67"] = 72,["68"] = 71,["69"] = 75,["70"] = 76,["71"] = 77,["72"] = 79,["73"] = 80,["74"] = 81,["75"] = 82,["77"] = 84,["79"] = 75});
local ____exports = {}
local ____types = require("game-stages.types")
local GameStage = ____types.GameStage
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- Управление переходами между стадиями
____exports.StageManager = __TS__Class()
local StageManager = ____exports.StageManager
StageManager.name = "StageManager"
function StageManager.prototype.____constructor(self, heroSelectionStage, abilitySelectionStage, preCombatStage, combatStage, roundController)
    self.currentStage = GameStage.INIT
    self.stages = __TS__New(Map)
    self.stages:set(GameStage.HERO_SELECTION, heroSelectionStage)
    self.stages:set(GameStage.ABILITY_SELECTION, abilitySelectionStage)
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
            self:startAbilitySelection()
            return nil
        end
    )
end
function StageManager.prototype.startAbilitySelection(self)
    self:transitionTo(GameStage.ABILITY_SELECTION)
    Timers:CreateTimer(
        GAME_CONSTANTS.ABILITY_SELECTION_TIME,
        function()
            self:startPreCombat()
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
