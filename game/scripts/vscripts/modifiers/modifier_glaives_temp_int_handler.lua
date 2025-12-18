local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 10,["9"] = 10,["10"] = 10,["11"] = 12,["12"] = 14,["13"] = 15,["14"] = 14,["15"] = 15,["16"] = 16,["17"] = 16,["18"] = 16,["19"] = 17,["20"] = 17,["21"] = 17,["22"] = 18,["23"] = 18,["24"] = 18,["25"] = 19,["26"] = 19,["27"] = 19,["28"] = 21,["29"] = 22,["30"] = 21,["31"] = 25,["32"] = 26,["35"] = 28,["36"] = 29,["39"] = 31,["42"] = 32,["43"] = 34,["44"] = 35,["47"] = 37,["48"] = 38,["51"] = 39,["52"] = 40,["55"] = 43,["58"] = 46,["59"] = 47,["62"] = 50,["63"] = 51,["64"] = 52,["66"] = 25,["67"] = 15,["68"] = 15,["69"] = 15,["70"] = 14,["73"] = 15});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
local GLAIVES_DURATION_SEC = 10
____exports.modifier_glaives_temp_int_handler = __TS__Class()
local modifier_glaives_temp_int_handler = ____exports.modifier_glaives_temp_int_handler
modifier_glaives_temp_int_handler.name = "modifier_glaives_temp_int_handler"
__TS__ClassExtends(modifier_glaives_temp_int_handler, BaseModifier)
function modifier_glaives_temp_int_handler.prototype.IsHidden(self)
    return true
end
function modifier_glaives_temp_int_handler.prototype.IsDebuff(self)
    return false
end
function modifier_glaives_temp_int_handler.prototype.IsPurgable(self)
    return false
end
function modifier_glaives_temp_int_handler.prototype.RemoveOnDeath(self)
    return false
end
function modifier_glaives_temp_int_handler.prototype.DeclareFunctions(self)
    return {MODIFIER_EVENT_ON_ATTACK_LANDED}
end
function modifier_glaives_temp_int_handler.prototype.OnAttackLanded(self, event)
    if not IsServer() then
        return
    end
    local parent = self:GetParent()
    if event.attacker ~= parent then
        return
    end
    if not parent:IsRealHero() then
        return
    end
    local hero = parent
    local target = event.target
    if not target or not IsValidEntity(target) then
        return
    end
    local glaives = hero:FindAbilityByName("silencer_glaives_of_wisdom")
    if not glaives then
        return
    end
    local level = glaives:GetLevel()
    if level <= 0 then
        return
    end
    if not glaives:GetAutoCastState() then
        return
    end
    local amount = level
    if amount <= 0 then
        return
    end
    local bucket = hero:FindModifierByName("modifier_temp_int_buckets")
    if bucket and bucket.addTempInt then
        bucket:addTempInt(amount, GLAIVES_DURATION_SEC)
    end
end
modifier_glaives_temp_int_handler = __TS__Decorate(
    modifier_glaives_temp_int_handler,
    modifier_glaives_temp_int_handler,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_glaives_temp_int_handler"}
)
____exports.modifier_glaives_temp_int_handler = modifier_glaives_temp_int_handler
return ____exports
