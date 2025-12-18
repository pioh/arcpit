local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 10,["9"] = 10,["10"] = 10,["11"] = 12,["12"] = 13,["13"] = 12,["14"] = 13,["15"] = 14,["16"] = 15,["17"] = 14,["18"] = 18,["19"] = 19,["20"] = 18,["21"] = 22,["22"] = 23,["23"] = 22,["24"] = 26,["25"] = 27,["26"] = 26,["27"] = 13,["28"] = 13,["29"] = 13,["30"] = 12,["33"] = 13});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.modifier_lina_dragon_slave_burn = __TS__Class()
local modifier_lina_dragon_slave_burn = ____exports.modifier_lina_dragon_slave_burn
modifier_lina_dragon_slave_burn.name = "modifier_lina_dragon_slave_burn"
__TS__ClassExtends(modifier_lina_dragon_slave_burn, BaseModifier)
function modifier_lina_dragon_slave_burn.prototype.IsHidden(self)
    return false
end
function modifier_lina_dragon_slave_burn.prototype.IsDebuff(self)
    return true
end
function modifier_lina_dragon_slave_burn.prototype.IsPurgable(self)
    return true
end
function modifier_lina_dragon_slave_burn.prototype.RemoveOnDeath(self)
    return true
end
modifier_lina_dragon_slave_burn = __TS__Decorate(
    modifier_lina_dragon_slave_burn,
    modifier_lina_dragon_slave_burn,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_lina_dragon_slave_burn"}
)
____exports.modifier_lina_dragon_slave_burn = modifier_lina_dragon_slave_burn
return ____exports
