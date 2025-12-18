local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["9"] = 6,["10"] = 6,["11"] = 6,["13"] = 7,["14"] = 8,["15"] = 6,["16"] = 10,["17"] = 11,["18"] = 10,["19"] = 14,["20"] = 15,["21"] = 14,["22"] = 18,["23"] = 19,["24"] = 18,["25"] = 25,["26"] = 28,["27"] = 29,["28"] = 25,["29"] = 35,["30"] = 36,["31"] = 37,["32"] = 35,["33"] = 43,["35"] = 44,["36"] = 44,["38"] = 45,["39"] = 45,["41"] = 47,["42"] = 48,["43"] = 49,["47"] = 44,["50"] = 43});
local ____exports = {}
local ____game_2Dconstants = require("config.game-constants")
local GAME_CONSTANTS = ____game_2Dconstants.GAME_CONSTANTS
--- Управление мирным режимом (без боя)
____exports.PeaceMode = __TS__Class()
local PeaceMode = ____exports.PeaceMode
PeaceMode.name = "PeaceMode"
function PeaceMode.prototype.____constructor(self)
    self.isPeaceMode = true
    self.modifierName = "modifier_arcpit_peace_mode"
end
function PeaceMode.prototype.isEnabled(self)
    return self.isPeaceMode
end
function PeaceMode.prototype.enable(self)
    self.isPeaceMode = true
end
function PeaceMode.prototype.disable(self)
    self.isPeaceMode = false
end
function PeaceMode.prototype.applyToHero(self, hero)
    hero:SetIdleAcquire(false)
    hero:SetAcquisitionRange(0)
end
function PeaceMode.prototype.removeFromHero(self, hero)
    hero:SetIdleAcquire(true)
    hero:SetAcquisitionRange(GAME_CONSTANTS.DEFAULT_ACQUISITION_RANGE)
end
function PeaceMode.prototype.applyToAll(self)
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue10
                end
                local hero = PlayerResource:GetSelectedHeroEntity(i)
                if hero and IsValidEntity(hero) then
                    self:applyToHero(hero)
                end
            end
            ::__continue10::
            i = i + 1
        end
    end
end
return ____exports
