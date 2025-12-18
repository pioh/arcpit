local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 5,["9"] = 5,["10"] = 5,["11"] = 7,["12"] = 8,["13"] = 7,["14"] = 8,["15"] = 9,["16"] = 10,["17"] = 9,["18"] = 13,["19"] = 14,["20"] = 13,["21"] = 17,["22"] = 18,["23"] = 17,["24"] = 21,["25"] = 22,["26"] = 21,["27"] = 25,["28"] = 26,["29"] = 25,["30"] = 29,["31"] = 30,["32"] = 29,["33"] = 35,["34"] = 36,["35"] = 35,["36"] = 8,["37"] = 8,["38"] = 8,["39"] = 7,["42"] = 8});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.modifier_arcpit_neutral_mana_regen = __TS__Class()
local modifier_arcpit_neutral_mana_regen = ____exports.modifier_arcpit_neutral_mana_regen
modifier_arcpit_neutral_mana_regen.name = "modifier_arcpit_neutral_mana_regen"
__TS__ClassExtends(modifier_arcpit_neutral_mana_regen, BaseModifier)
function modifier_arcpit_neutral_mana_regen.prototype.IsHidden(self)
    return false
end
function modifier_arcpit_neutral_mana_regen.prototype.IsDebuff(self)
    return false
end
function modifier_arcpit_neutral_mana_regen.prototype.IsPurgable(self)
    return false
end
function modifier_arcpit_neutral_mana_regen.prototype.RemoveOnDeath(self)
    return false
end
function modifier_arcpit_neutral_mana_regen.prototype.GetTexture(self)
    return "item_void_stone"
end
function modifier_arcpit_neutral_mana_regen.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_MANA_REGEN_CONSTANT}
end
function modifier_arcpit_neutral_mana_regen.prototype.GetModifierConstantManaRegen(self)
    return 100
end
modifier_arcpit_neutral_mana_regen = __TS__Decorate(
    modifier_arcpit_neutral_mana_regen,
    modifier_arcpit_neutral_mana_regen,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_arcpit_neutral_mana_regen"}
)
____exports.modifier_arcpit_neutral_mana_regen = modifier_arcpit_neutral_mana_regen
return ____exports
