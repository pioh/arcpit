local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 5,["9"] = 5,["10"] = 5,["11"] = 7,["12"] = 8,["13"] = 7,["14"] = 8,["15"] = 9,["16"] = 10,["17"] = 9,["18"] = 13,["19"] = 14,["20"] = 13,["21"] = 17,["22"] = 18,["23"] = 17,["24"] = 21,["25"] = 22,["26"] = 21,["27"] = 25,["28"] = 26,["31"] = 27,["33"] = 27,["34"] = 27,["36"] = 27,["37"] = 28,["38"] = 25,["39"] = 31,["40"] = 32,["41"] = 31,["42"] = 38,["43"] = 40,["44"] = 38,["45"] = 43,["46"] = 45,["47"] = 43,["48"] = 8,["49"] = 8,["50"] = 8,["51"] = 7,["54"] = 8});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.modifier_round_creep_scaling = __TS__Class()
local modifier_round_creep_scaling = ____exports.modifier_round_creep_scaling
modifier_round_creep_scaling.name = "modifier_round_creep_scaling"
__TS__ClassExtends(modifier_round_creep_scaling, BaseModifier)
function modifier_round_creep_scaling.prototype.IsHidden(self)
    return true
end
function modifier_round_creep_scaling.prototype.IsDebuff(self)
    return false
end
function modifier_round_creep_scaling.prototype.IsPurgable(self)
    return false
end
function modifier_round_creep_scaling.prototype.RemoveOnDeath(self)
    return true
end
function modifier_round_creep_scaling.prototype.OnCreated(self, params)
    if not IsServer() then
        return
    end
    local ____tonumber_3 = tonumber
    local ____opt_result_2
    if params ~= nil then
        ____opt_result_2 = params.stacks
    end
    local stacks = ____tonumber_3(____opt_result_2) or 0
    self:SetStackCount(math.max(0, stacks))
end
function modifier_round_creep_scaling.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_EXTRA_HEALTH_PERCENTAGE, MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE}
end
function modifier_round_creep_scaling.prototype.GetModifierExtraHealthPercentage(self)
    return self:GetStackCount() * 10
end
function modifier_round_creep_scaling.prototype.GetModifierBaseDamageOutgoing_Percentage(self)
    return self:GetStackCount() * 6
end
modifier_round_creep_scaling = __TS__Decorate(
    modifier_round_creep_scaling,
    modifier_round_creep_scaling,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_round_creep_scaling"}
)
____exports.modifier_round_creep_scaling = modifier_round_creep_scaling
return ____exports
