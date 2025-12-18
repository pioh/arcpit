local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 13,["9"] = 13,["10"] = 13,["11"] = 15,["12"] = 17,["13"] = 18,["14"] = 17,["15"] = 18,["17"] = 18,["18"] = 20,["19"] = 21,["20"] = 22,["21"] = 17,["22"] = 24,["23"] = 24,["24"] = 24,["25"] = 25,["26"] = 25,["27"] = 25,["28"] = 26,["29"] = 26,["30"] = 26,["31"] = 29,["32"] = 30,["33"] = 29,["34"] = 33,["35"] = 35,["36"] = 33,["37"] = 38,["38"] = 39,["39"] = 38,["40"] = 44,["41"] = 45,["42"] = 44,["43"] = 48,["44"] = 49,["48"] = 51,["49"] = 51,["50"] = 51,["51"] = 51,["54"] = 52,["55"] = 53,["56"] = 48,["57"] = 60,["58"] = 61,["61"] = 62,["64"] = 63,["67"] = 65,["68"] = 66,["69"] = 70,["70"] = 72,["71"] = 73,["72"] = 74,["73"] = 76,["74"] = 76,["76"] = 79,["77"] = 80,["78"] = 81,["80"] = 60,["81"] = 85,["82"] = 86,["85"] = 88,["86"] = 89,["87"] = 91,["88"] = 92,["89"] = 93,["90"] = 94,["91"] = 95,["92"] = 95,["94"] = 96,["96"] = 100,["97"] = 101,["98"] = 103,["101"] = 108,["102"] = 109,["103"] = 110,["105"] = 113,["106"] = 114,["108"] = 85,["109"] = 18,["110"] = 18,["111"] = 18,["112"] = 17,["115"] = 18});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
local BUCKET_WINDOW_SECONDS = 180
____exports.modifier_temp_int_buckets = __TS__Class()
local modifier_temp_int_buckets = ____exports.modifier_temp_int_buckets
modifier_temp_int_buckets.name = "modifier_temp_int_buckets"
__TS__ClassExtends(modifier_temp_int_buckets, BaseModifier)
function modifier_temp_int_buckets.prototype.____constructor(self, ...)
    BaseModifier.prototype.____constructor(self, ...)
    self.buckets = {}
    self.total = 0
    self.lastExpireTime = 0
end
function modifier_temp_int_buckets.prototype.IsDebuff(self)
    return false
end
function modifier_temp_int_buckets.prototype.IsPurgable(self)
    return false
end
function modifier_temp_int_buckets.prototype.RemoveOnDeath(self)
    return false
end
function modifier_temp_int_buckets.prototype.IsHidden(self)
    return self:GetStackCount() <= 0
end
function modifier_temp_int_buckets.prototype.GetTexture(self)
    return "silencer_glaives_of_wisdom"
end
function modifier_temp_int_buckets.prototype.DeclareFunctions(self)
    return {MODIFIER_PROPERTY_STATS_INTELLECT_BONUS}
end
function modifier_temp_int_buckets.prototype.GetModifierBonusStats_Intellect(self)
    return self:GetStackCount()
end
function modifier_temp_int_buckets.prototype.OnCreated(self)
    if not IsServer() then
        return
    end
    do
        local i = 0
        while i < BUCKET_WINDOW_SECONDS do
            self.buckets[i + 1] = 0
            i = i + 1
        end
    end
    self:StartIntervalThink(1)
    self:SetStackCount(0)
end
function modifier_temp_int_buckets.prototype.addTempInt(self, amount, durationSec)
    if not IsServer() then
        return
    end
    if amount <= 0 then
        return
    end
    if durationSec <= 0 then
        return
    end
    local now = GameRules:GetGameTime()
    local expire = now + math.min(durationSec, BUCKET_WINDOW_SECONDS)
    local idx = math.floor(expire) % BUCKET_WINDOW_SECONDS
    self.buckets[idx + 1] = (self.buckets[idx + 1] or 0) + amount
    self.total = self.total + amount
    self:SetStackCount(self.total)
    if expire > self.lastExpireTime then
        self.lastExpireTime = expire
    end
    local remaining = self.lastExpireTime - now
    if remaining > 0 then
        self:SetDuration(remaining, true)
    end
end
function modifier_temp_int_buckets.prototype.OnIntervalThink(self)
    if not IsServer() then
        return
    end
    local now = GameRules:GetGameTime()
    local idx = math.floor(now) % BUCKET_WINDOW_SECONDS
    local due = self.buckets[idx + 1] or 0
    if due > 0 then
        self.buckets[idx + 1] = 0
        self.total = self.total - due
        if self.total < 0 then
            self.total = 0
        end
        self:SetStackCount(self.total)
    end
    if self.total <= 0 then
        self.lastExpireTime = 0
        self:SetDuration(0.1, true)
        return
    end
    local remaining = self.lastExpireTime - now
    if remaining > 0 then
        self:SetDuration(remaining, true)
    else
        self.lastExpireTime = 0
        self:SetDuration(0.1, true)
    end
end
modifier_temp_int_buckets = __TS__Decorate(
    modifier_temp_int_buckets,
    modifier_temp_int_buckets,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_temp_int_buckets"}
)
____exports.modifier_temp_int_buckets = modifier_temp_int_buckets
return ____exports
