local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 6,["9"] = 6,["10"] = 6,["12"] = 6,["13"] = 16,["14"] = 17,["15"] = 19,["16"] = 20,["17"] = 23,["19"] = 16,["20"] = 30,["22"] = 31,["23"] = 31,["24"] = 32,["25"] = 33,["26"] = 34,["27"] = 35,["29"] = 31,["32"] = 30,["33"] = 43,["34"] = 44,["35"] = 45,["36"] = 46,["37"] = 47,["40"] = 43,["41"] = 8});
local ____exports = {}
--- Система кастомизации способностей
-- Автоматически применяет модификаторы и логику к конкретным способностям
____exports.AbilityCustomizer = __TS__Class()
local AbilityCustomizer = ____exports.AbilityCustomizer
AbilityCustomizer.name = "AbilityCustomizer"
function AbilityCustomizer.prototype.____constructor(self)
end
function AbilityCustomizer.setupAbility(self, hero, abilityName)
    local modifierName = self.ABILITY_MODIFIERS[abilityName]
    if modifierName ~= nil then
        print((("[AbilityCustomizer] Applying custom modifier " .. modifierName) .. " for ") .. abilityName)
        hero:AddNewModifier(hero, nil, modifierName, {})
    end
end
function AbilityCustomizer.setupHeroAbilities(self, hero)
    do
        local i = 0
        while i < hero:GetAbilityCount() do
            local ability = hero:GetAbilityByIndex(i)
            if ability then
                local abilityName = ability:GetAbilityName()
                self:setupAbility(hero, abilityName)
            end
            i = i + 1
        end
    end
end
function AbilityCustomizer.setupAllHeroes(self)
    local heroes = Entities:FindAllByClassname("npc_dota_hero")
    for ____, hero in ipairs(heroes) do
        if hero and IsValidEntity(hero) and hero:IsRealHero() then
            self:setupHeroAbilities(hero)
        end
    end
end
AbilityCustomizer.ABILITY_MODIFIERS = {silencer_glaives_of_wisdom = "modifier_glaives_temp_int_handler"}
return ____exports
