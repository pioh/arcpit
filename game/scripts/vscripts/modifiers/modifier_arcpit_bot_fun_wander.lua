local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 6,["9"] = 6,["10"] = 6,["11"] = 8,["12"] = 9,["13"] = 8,["14"] = 9,["15"] = 10,["16"] = 11,["17"] = 10,["18"] = 14,["19"] = 15,["20"] = 14,["21"] = 18,["22"] = 19,["23"] = 18,["24"] = 22,["25"] = 23,["26"] = 22,["27"] = 26,["28"] = 27,["31"] = 28,["32"] = 29,["33"] = 26,["34"] = 32,["35"] = 33,["38"] = 34,["39"] = 32,["40"] = 37,["41"] = 38,["42"] = 39,["45"] = 40,["48"] = 42,["49"] = 43,["50"] = 46,["51"] = 47,["52"] = 48,["53"] = 50,["54"] = 50,["55"] = 50,["56"] = 50,["57"] = 50,["58"] = 37,["59"] = 9,["60"] = 9,["61"] = 9,["62"] = 8,["65"] = 9});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.modifier_arcpit_bot_fun_wander = __TS__Class()
local modifier_arcpit_bot_fun_wander = ____exports.modifier_arcpit_bot_fun_wander
modifier_arcpit_bot_fun_wander.name = "modifier_arcpit_bot_fun_wander"
__TS__ClassExtends(modifier_arcpit_bot_fun_wander, BaseModifier)
function modifier_arcpit_bot_fun_wander.prototype.IsHidden(self)
    return true
end
function modifier_arcpit_bot_fun_wander.prototype.IsDebuff(self)
    return false
end
function modifier_arcpit_bot_fun_wander.prototype.IsPurgable(self)
    return false
end
function modifier_arcpit_bot_fun_wander.prototype.RemoveOnDeath(self)
    return true
end
function modifier_arcpit_bot_fun_wander.prototype.OnCreated(self)
    if not IsServer() then
        return
    end
    self:StartIntervalThink(0.75)
    self:issueRunOrder()
end
function modifier_arcpit_bot_fun_wander.prototype.OnIntervalThink(self)
    if not IsServer() then
        return
    end
    self:issueRunOrder()
end
function modifier_arcpit_bot_fun_wander.prototype.issueRunOrder(self)
    local parent = self:GetParent()
    if not parent or not IsValidEntity(parent) then
        return
    end
    if not parent:IsAlive() then
        return
    end
    local o = parent:GetAbsOrigin()
    local origin = Vector(o.x, o.y, o.z)
    local dx = RandomInt(-1, 1) == 0 and RandomInt(-1400, -900) or RandomInt(900, 1400)
    local dy = RandomInt(-1, 1) == 0 and RandomInt(-1400, -900) or RandomInt(900, 1400)
    local pos = Vector(origin.x + dx, origin.y + dy, origin.z)
    ExecuteOrderFromTable({
        UnitIndex = parent:entindex(),
        OrderType = DOTA_UNIT_ORDER_MOVE_TO_POSITION,
        Position = pos
    })
end
modifier_arcpit_bot_fun_wander = __TS__Decorate(
    modifier_arcpit_bot_fun_wander,
    modifier_arcpit_bot_fun_wander,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_arcpit_bot_fun_wander"}
)
____exports.modifier_arcpit_bot_fun_wander = modifier_arcpit_bot_fun_wander
return ____exports
