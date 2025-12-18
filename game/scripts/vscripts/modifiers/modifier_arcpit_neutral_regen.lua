local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 6,["9"] = 6,["10"] = 6,["11"] = 8,["12"] = 9,["13"] = 8,["14"] = 9,["15"] = 10,["16"] = 11,["17"] = 10,["18"] = 14,["19"] = 15,["20"] = 14,["21"] = 18,["22"] = 19,["23"] = 18,["24"] = 22,["25"] = 23,["26"] = 22,["27"] = 26,["28"] = 27,["29"] = 26,["30"] = 30,["31"] = 31,["32"] = 30,["33"] = 37,["34"] = 38,["35"] = 37,["36"] = 41,["37"] = 42,["38"] = 41,["39"] = 9,["40"] = 9,["41"] = 9,["42"] = 8,["45"] = 9});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.modifier_arcpit_neutral_regen = __TS__Class()
local modifier_arcpit_neutral_regen = ____exports.modifier_arcpit_neutral_regen
modifier_arcpit_neutral_regen.name = "modifier_arcpit_neutral_regen"
__TS__ClassExtends(modifier_arcpit_neutral_regen, BaseModifier)
function modifier_arcpit_neutral_regen.prototype.IsHidden(self)
    return false
end
function modifier_arcpit_neutral_regen.prototype.IsDebuff(self)
    return false
end
function modifier_arcpit_neutral_regen.prototype.IsPurgable(self)
    return false
end
function modifier_arcpit_neutral_regen.prototype.RemoveOnDeath(self)
    return false
end
function modifier_arcpit_neutral_regen.prototype.GetTexture(self)
    return "item_ring_of_health"
end
function modifier_arcpit_neutral_regen.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT, MODIFIER_PROPERTY_MANA_REGEN_CONSTANT}
end
function modifier_arcpit_neutral_regen.prototype.GetModifierConstantHealthRegen(self)
    return 200
end
function modifier_arcpit_neutral_regen.prototype.GetModifierConstantManaRegen(self)
    return 100
end
modifier_arcpit_neutral_regen = __TS__Decorate(
    modifier_arcpit_neutral_regen,
    modifier_arcpit_neutral_regen,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_arcpit_neutral_regen"}
)
____exports.modifier_arcpit_neutral_regen = modifier_arcpit_neutral_regen
return ____exports
