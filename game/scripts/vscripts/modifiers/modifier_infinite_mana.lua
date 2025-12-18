local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 5,["9"] = 5,["10"] = 5,["11"] = 7,["12"] = 8,["13"] = 7,["14"] = 8,["15"] = 9,["16"] = 10,["17"] = 9,["18"] = 13,["19"] = 14,["20"] = 13,["21"] = 17,["22"] = 18,["23"] = 17,["24"] = 21,["25"] = 22,["26"] = 21,["27"] = 25,["28"] = 26,["29"] = 25,["30"] = 31,["31"] = 32,["34"] = 34,["35"] = 35,["38"] = 38,["39"] = 38,["40"] = 38,["41"] = 39,["42"] = 40,["43"] = 38,["44"] = 38,["45"] = 31,["46"] = 44,["47"] = 45,["48"] = 44,["49"] = 8,["50"] = 8,["51"] = 8,["52"] = 7,["55"] = 8});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.modifier_infinite_mana = __TS__Class()
local modifier_infinite_mana = ____exports.modifier_infinite_mana
modifier_infinite_mana.name = "modifier_infinite_mana"
__TS__ClassExtends(modifier_infinite_mana, BaseModifier)
function modifier_infinite_mana.prototype.IsHidden(self)
    return false
end
function modifier_infinite_mana.prototype.IsDebuff(self)
    return false
end
function modifier_infinite_mana.prototype.IsPurgable(self)
    return true
end
function modifier_infinite_mana.prototype.RemoveOnDeath(self)
    return true
end
function modifier_infinite_mana.prototype.DeclareFunctions(self)
    return {MODIFIER_EVENT_ON_ABILITY_EXECUTED}
end
function modifier_infinite_mana.prototype.OnAbilityExecuted(self, event)
    if not IsServer() then
        return
    end
    local hero = self:GetParent()
    if event.unit ~= hero then
        return
    end
    Timers:CreateTimer(
        0.1,
        function()
            hero:SetMana(hero:GetMaxMana())
            return nil
        end
    )
end
function modifier_infinite_mana.prototype.GetTexture(self)
    return "item_arcane_boots"
end
modifier_infinite_mana = __TS__Decorate(
    modifier_infinite_mana,
    modifier_infinite_mana,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_infinite_mana"}
)
____exports.modifier_infinite_mana = modifier_infinite_mana
return ____exports
