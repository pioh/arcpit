local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["8"] = 3,["9"] = 3,["11"] = 8,["12"] = 8,["13"] = 8,["14"] = 10,["15"] = 10,["16"] = 9,["17"] = 16,["18"] = 17,["20"] = 19,["21"] = 19,["23"] = 20,["24"] = 20,["26"] = 22,["27"] = 23,["28"] = 24,["29"] = 25,["30"] = 26,["31"] = 27,["34"] = 31,["35"] = 32,["37"] = 34,["41"] = 19,["44"] = 38,["45"] = 40,["46"] = 40,["47"] = 40,["48"] = 41,["49"] = 42,["50"] = 40,["51"] = 40,["53"] = 16,["54"] = 50,["55"] = 51,["57"] = 54,["58"] = 54,["59"] = 55,["60"] = 56,["61"] = 57,["63"] = 54,["66"] = 62,["67"] = 63,["68"] = 65,["69"] = 66,["70"] = 67,["71"] = 70,["72"] = 73,["74"] = 75,["77"] = 50,["78"] = 83,["79"] = 84,["80"] = 85,["81"] = 87,["82"] = 88,["83"] = 89,["84"] = 91,["85"] = 92,["87"] = 95,["88"] = 83});
local ____exports = {}
local ____ability_2Dpool = require("abilities.ability-pool")
local ABILITY_POOL = ____ability_2Dpool.ABILITY_POOL
local ____ability_2Dcustomizer = require("abilities.ability-customizer")
local AbilityCustomizer = ____ability_2Dcustomizer.AbilityCustomizer
--- Управление способностями героев
____exports.AbilityManager = __TS__Class()
local AbilityManager = ____exports.AbilityManager
AbilityManager.name = "AbilityManager"
function AbilityManager.prototype.____constructor(self, playerManager)
    self.playerManager = playerManager
end
function AbilityManager.prototype.autoSelectForAllPlayers(self, onComplete)
    print("=== Auto-selecting abilities for all players ===")
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue5
                end
                local hero = self.playerManager:getPlayerHero(i)
                if not hero or not IsValidEntity(hero) then
                    local selected = PlayerResource:GetSelectedHeroEntity(i)
                    if selected and IsValidEntity(selected) then
                        hero = selected
                        self.playerManager:setPlayerHero(i, hero)
                    end
                end
                if hero and IsValidEntity(hero) then
                    self:replaceAbilities(hero, i)
                else
                    print("✗ No hero found for player " .. tostring(i))
                end
            end
            ::__continue5::
            i = i + 1
        end
    end
    if onComplete then
        Timers:CreateTimer(
            0.1,
            function()
                onComplete(nil)
                return nil
            end
        )
    end
end
function AbilityManager.prototype.replaceAbilities(self, hero, playerID)
    print((("Processing abilities for player " .. tostring(playerID)) .. ", hero: ") .. hero:GetUnitName())
    do
        local j = hero:GetAbilityCount() - 1
        while j >= 0 do
            local ability = hero:GetAbilityByIndex(j)
            if ability then
                hero:RemoveAbility(ability:GetAbilityName())
            end
            j = j - 1
        end
    end
    local selectedAbilities = self:getRandomAbilities(5)
    print("  Selected abilities: " .. table.concat(selectedAbilities, ", "))
    for ____, abilityName in ipairs(selectedAbilities) do
        local ability = hero:AddAbility(abilityName)
        if ability ~= nil then
            print(("  ✓ Added ability: " .. abilityName) .. " (level 0, not skilled)")
            AbilityCustomizer:setupAbility(hero, abilityName)
        else
            print("  ✗ Failed to add ability: " .. abilityName)
        end
    end
end
function AbilityManager.prototype.getRandomAbilities(self, count)
    local pool = {unpack(ABILITY_POOL)}
    local result = {}
    while #result < count and #pool > 0 do
        local idx = RandomInt(0, #pool - 1)
        result[#result + 1] = pool[idx + 1]
        pool[idx + 1] = pool[#pool]
        table.remove(pool)
    end
    return result
end
return ____exports
