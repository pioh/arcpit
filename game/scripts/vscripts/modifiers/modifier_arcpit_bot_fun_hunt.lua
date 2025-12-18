local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Decorate = ____lualib.__TS__Decorate
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 6,["9"] = 6,["10"] = 6,["11"] = 14,["12"] = 15,["13"] = 14,["14"] = 15,["15"] = 18,["16"] = 19,["17"] = 18,["18"] = 22,["19"] = 23,["20"] = 22,["21"] = 26,["22"] = 27,["23"] = 26,["24"] = 30,["25"] = 31,["26"] = 30,["27"] = 34,["28"] = 35,["31"] = 36,["32"] = 37,["33"] = 34,["34"] = 40,["35"] = 41,["38"] = 43,["39"] = 44,["41"] = 40,["42"] = 48,["43"] = 49,["46"] = 51,["47"] = 52,["50"] = 53,["53"] = 56,["54"] = 57,["55"] = 58,["56"] = 59,["57"] = 60,["60"] = 63,["61"] = 64,["62"] = 65,["63"] = 66,["64"] = 67,["65"] = 68,["69"] = 72,["72"] = 75,["73"] = 76,["77"] = 80,["78"] = 80,["79"] = 80,["80"] = 80,["81"] = 80,["82"] = 48,["83"] = 87,["84"] = 88,["85"] = 89,["88"] = 91,["89"] = 92,["90"] = 95,["91"] = 95,["92"] = 95,["93"] = 95,["94"] = 95,["95"] = 95,["96"] = 95,["97"] = 95,["98"] = 95,["99"] = 95,["100"] = 95,["101"] = 107,["102"] = 108,["104"] = 109,["105"] = 109,["107"] = 110,["108"] = 110,["110"] = 111,["111"] = 111,["113"] = 112,["117"] = 115,["118"] = 116,["121"] = 120,["122"] = 121,["123"] = 87,["124"] = 124,["126"] = 125,["127"] = 125,["129"] = 126,["130"] = 127,["131"] = 127,["133"] = 128,["134"] = 128,["136"] = 129,["137"] = 129,["139"] = 130,["140"] = 130,["142"] = 131,["143"] = 131,["145"] = 133,["146"] = 134,["147"] = 134,["149"] = 136,["150"] = 137,["151"] = 137,["152"] = 137,["153"] = 137,["154"] = 137,["155"] = 142,["157"] = 145,["158"] = 146,["159"] = 146,["160"] = 146,["161"] = 146,["162"] = 146,["163"] = 146,["164"] = 152,["166"] = 155,["167"] = 156,["168"] = 157,["169"] = 157,["170"] = 157,["171"] = 160,["172"] = 160,["173"] = 160,["174"] = 160,["175"] = 157,["176"] = 157,["177"] = 157,["178"] = 163,["182"] = 125,["185"] = 166,["186"] = 124,["187"] = 15,["188"] = 15,["189"] = 15,["190"] = 14,["193"] = 15});
local ____exports = {}
local ____dota_ts_adapter = require("lib.dota_ts_adapter")
local BaseModifier = ____dota_ts_adapter.BaseModifier
local registerModifier = ____dota_ts_adapter.registerModifier
____exports.modifier_arcpit_bot_fun_hunt = __TS__Class()
local modifier_arcpit_bot_fun_hunt = ____exports.modifier_arcpit_bot_fun_hunt
modifier_arcpit_bot_fun_hunt.name = "modifier_arcpit_bot_fun_hunt"
__TS__ClassExtends(modifier_arcpit_bot_fun_hunt, BaseModifier)
function modifier_arcpit_bot_fun_hunt.prototype.IsHidden(self)
    return true
end
function modifier_arcpit_bot_fun_hunt.prototype.IsDebuff(self)
    return false
end
function modifier_arcpit_bot_fun_hunt.prototype.IsPurgable(self)
    return false
end
function modifier_arcpit_bot_fun_hunt.prototype.RemoveOnDeath(self)
    return true
end
function modifier_arcpit_bot_fun_hunt.prototype.OnCreated(self)
    if not IsServer() then
        return
    end
    self:pickTarget()
    self:StartIntervalThink(0.35)
end
function modifier_arcpit_bot_fun_hunt.prototype.OnRefresh(self)
    if not IsServer() then
        return
    end
    if RandomInt(1, 100) <= 40 then
        self:pickTarget()
    end
end
function modifier_arcpit_bot_fun_hunt.prototype.OnIntervalThink(self)
    if not IsServer() then
        return
    end
    local parent = self:GetParent()
    if not parent or not IsValidEntity(parent) then
        return
    end
    if not parent:IsAlive() then
        return
    end
    local target
    if self.targetEntIndex ~= nil then
        local e = EntIndexToHScript(self.targetEntIndex)
        if e and IsValidEntity(e) and e:IsRealHero() and e:IsAlive() then
            target = e
        end
    end
    if not target then
        self:pickTarget()
        if self.targetEntIndex ~= nil then
            local e2 = EntIndexToHScript(self.targetEntIndex)
            if e2 and IsValidEntity(e2) and e2:IsRealHero() and e2:IsAlive() then
                target = e2
            end
        end
    end
    if not target or not IsValidEntity(target) then
        return
    end
    if RandomInt(1, 100) <= 70 then
        if self:tryCastAnyAbility(parent, target) then
            return
        end
    end
    ExecuteOrderFromTable({
        UnitIndex = parent:entindex(),
        OrderType = DOTA_UNIT_ORDER_ATTACK_TARGET,
        TargetIndex = target:entindex()
    })
end
function modifier_arcpit_bot_fun_hunt.prototype.pickTarget(self)
    local parent = self:GetParent()
    if not parent or not IsValidEntity(parent) then
        return
    end
    local o = parent:GetAbsOrigin()
    local origin = Vector(o.x, o.y, o.z)
    local units = FindUnitsInRadius(
        parent:GetTeamNumber(),
        origin,
        nil,
        4000,
        DOTA_UNIT_TARGET_TEAM_BOTH,
        DOTA_UNIT_TARGET_HERO,
        DOTA_UNIT_TARGET_FLAG_NONE,
        FIND_ANY_ORDER,
        false
    )
    local heroes = {}
    for ____, u in ipairs(units) do
        do
            if not u or not IsValidEntity(u) then
                goto __continue25
            end
            if not u:IsRealHero() then
                goto __continue25
            end
            if u:entindex() == parent:entindex() then
                goto __continue25
            end
            heroes[#heroes + 1] = u
        end
        ::__continue25::
    end
    if #heroes <= 0 then
        self.targetEntIndex = nil
        return
    end
    local pick = heroes[RandomInt(0, #heroes - 1) + 1]
    self.targetEntIndex = pick:entindex()
end
function modifier_arcpit_bot_fun_hunt.prototype.tryCastAnyAbility(self, caster, target)
    do
        local i = 0
        while i < caster:GetAbilityCount() do
            do
                local ab = caster:GetAbilityByIndex(i)
                if not ab then
                    goto __continue33
                end
                if ab:GetLevel() <= 0 then
                    goto __continue33
                end
                if ab.IsPassive and ab:IsPassive() then
                    goto __continue33
                end
                if ab:IsCooldownReady() ~= true then
                    goto __continue33
                end
                if ab:IsFullyCastable() ~= true then
                    goto __continue33
                end
                local behavior = ab:GetBehavior() or 0
                if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_TOGGLE) ~= 0 then
                    goto __continue33
                end
                if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_NO_TARGET) ~= 0 then
                    ExecuteOrderFromTable({
                        UnitIndex = caster:entindex(),
                        OrderType = DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex = ab:entindex()
                    })
                    return true
                end
                if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) ~= 0 then
                    ExecuteOrderFromTable({
                        UnitIndex = caster:entindex(),
                        OrderType = DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex = target:entindex(),
                        AbilityIndex = ab:entindex()
                    })
                    return true
                end
                if bit.band(behavior, DOTA_ABILITY_BEHAVIOR_POINT) ~= 0 then
                    local to = target:GetAbsOrigin()
                    ExecuteOrderFromTable({
                        UnitIndex = caster:entindex(),
                        OrderType = DOTA_UNIT_ORDER_CAST_POSITION,
                        Position = Vector(
                            to.x + RandomInt(-120, 120),
                            to.y + RandomInt(-120, 120),
                            to.z
                        ),
                        AbilityIndex = ab:entindex()
                    })
                    return true
                end
            end
            ::__continue33::
            i = i + 1
        end
    end
    return false
end
modifier_arcpit_bot_fun_hunt = __TS__Decorate(
    modifier_arcpit_bot_fun_hunt,
    modifier_arcpit_bot_fun_hunt,
    {registerModifier(nil)},
    {kind = "class", name = "modifier_arcpit_bot_fun_hunt"}
)
____exports.modifier_arcpit_bot_fun_hunt = modifier_arcpit_bot_fun_hunt
return ____exports
