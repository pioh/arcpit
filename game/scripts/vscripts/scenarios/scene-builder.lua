local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 14,["8"] = 14,["9"] = 14,["10"] = 16,["11"] = 16,["12"] = 17,["13"] = 18,["14"] = 19,["15"] = 20,["16"] = 15,["17"] = 26,["19"] = 27,["20"] = 27,["22"] = 28,["23"] = 28,["25"] = 29,["26"] = 29,["28"] = 31,["29"] = 32,["30"] = 33,["34"] = 27,["37"] = 36,["38"] = 26,["39"] = 42,["40"] = 42,["41"] = 42,["43"] = 43,["44"] = 44,["45"] = 45,["46"] = 46,["47"] = 49,["48"] = 50,["49"] = 51,["51"] = 53,["54"] = 56,["56"] = 42,["57"] = 63,["58"] = 64,["59"] = 65,["63"] = 68,["64"] = 68,["65"] = 69,["66"] = 68,["69"] = 72,["70"] = 63,["71"] = 78,["72"] = 79,["73"] = 80,["74"] = 78,["75"] = 86,["76"] = 90,["77"] = 90,["79"] = 92,["81"] = 94,["82"] = 94,["83"] = 95,["84"] = 96,["85"] = 98,["86"] = 100,["87"] = 100,["88"] = 100,["89"] = 100,["90"] = 100,["91"] = 100,["92"] = 100,["93"] = 100,["94"] = 109,["95"] = 110,["96"] = 111,["98"] = 94,["101"] = 115,["102"] = 116,["103"] = 86,["104"] = 123,["105"] = 123,["106"] = 123,["108"] = 124,["109"] = 125,["110"] = 125,["111"] = 125,["112"] = 125,["113"] = 125,["114"] = 125,["115"] = 125,["116"] = 125,["117"] = 126,["118"] = 126,["120"] = 128,["121"] = 130,["122"] = 131,["123"] = 132,["124"] = 123,["125"] = 139,["126"] = 139,["127"] = 139,["129"] = 140,["130"] = 140,["131"] = 140,["132"] = 140,["133"] = 140,["134"] = 140,["135"] = 140,["136"] = 148,["137"] = 149,["138"] = 150,["140"] = 153,["141"] = 139,["142"] = 159,["143"] = 160,["144"] = 161,["145"] = 162,["146"] = 163,["147"] = 166,["148"] = 166,["149"] = 166,["150"] = 166,["151"] = 166,["154"] = 173,["155"] = 159,["156"] = 179,["157"] = 181,["158"] = 182,["159"] = 183,["160"] = 179,["161"] = 189,["163"] = 190,["164"] = 190,["165"] = 191,["166"] = 192,["167"] = 193,["169"] = 190,["172"] = 189,["173"] = 201,["174"] = 202,["175"] = 201,["176"] = 208,["177"] = 209,["178"] = 208,["179"] = 215,["180"] = 216,["181"] = 217,["182"] = 215,["183"] = 223,["185"] = 224,["186"] = 224,["188"] = 225,["189"] = 225,["191"] = 226,["192"] = 227,["193"] = 228,["197"] = 224,["200"] = 231,["201"] = 223});
local ____exports = {}
--- Утилиты для построения тестовых сценариев
____exports.SceneBuilder = __TS__Class()
local SceneBuilder = ____exports.SceneBuilder
SceneBuilder.name = "SceneBuilder"
function SceneBuilder.prototype.____constructor(self, playerManager, spawnManager, heroManager, abilityManager, peaceMode)
    self.playerManager = playerManager
    self.spawnManager = spawnManager
    self.heroManager = heroManager
    self.abilityManager = abilityManager
    self.peaceMode = peaceMode
end
function SceneBuilder.prototype.getMainPlayer(self)
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue5
                end
                if PlayerResource:IsFakeClient(i) then
                    goto __continue5
                end
                local hero = self.playerManager:getPlayerHero(i)
                if hero and IsValidEntity(hero) then
                    return {playerID = i, hero = hero}
                end
            end
            ::__continue5::
            i = i + 1
        end
    end
    return nil
end
function SceneBuilder.prototype.giveAbility(self, hero, abilityName, level)
    if level == nil then
        level = 1
    end
    local ability = hero:AddAbility(abilityName)
    if ability ~= nil then
        local maxLevel = ability:GetMaxLevel()
        local targetLevel = math.min(level, maxLevel)
        if targetLevel > 0 then
            ability:SetLevel(targetLevel)
            print((((("✓ Added " .. abilityName) .. " level ") .. tostring(targetLevel)) .. " to ") .. hero:GetUnitName())
        else
            print((("✓ Added " .. abilityName) .. " (level 0, not skilled) to ") .. hero:GetUnitName())
        end
    else
        print("✗ Failed to add " .. abilityName)
    end
end
function SceneBuilder.prototype.setHeroLevel(self, hero, level)
    local currentLevel = hero:GetLevel()
    if level <= currentLevel then
        return
    end
    do
        local i = currentLevel
        while i < level do
            hero:HeroLevelUp(false)
            i = i + 1
        end
    end
    print(((((("✓ " .. hero:GetUnitName()) .. " level set to ") .. tostring(level)) .. " (") .. tostring(level - currentLevel)) .. " ability points available)")
end
function SceneBuilder.prototype.healHero(self, hero)
    hero:SetHealth(hero:GetMaxHealth())
    hero:SetMana(hero:GetMaxMana())
end
function SceneBuilder.prototype.spawnCreeps(self, unitName, count, position, team)
    if team == nil then
        team = DOTA_TEAM_NEUTRALS
    end
    local creeps = {}
    do
        local i = 0
        while i < count do
            local dx = RandomInt(-300, 300)
            local dy = RandomInt(-300, 300)
            local spawnPos = Vector(position.x + dx, position.y + dy, position.z)
            local creep = CreateUnitByName(
                unitName,
                spawnPos,
                true,
                nil,
                nil,
                team
            )
            if creep ~= nil then
                FindClearSpaceForUnit(creep, spawnPos, true)
                creeps[#creeps + 1] = creep
            end
            i = i + 1
        end
    end
    print((("✓ Spawned " .. tostring(#creeps)) .. "x ") .. unitName)
    return creeps
end
function SceneBuilder.prototype.spawnEnemyHeroDummy(self, heroName, position, team)
    if team == nil then
        team = DOTA_TEAM_BADGUYS
    end
    local pos = Vector(position.x, position.y, position.z)
    local unit = CreateUnitByName(
        heroName,
        pos,
        true,
        nil,
        nil,
        team
    )
    if not unit then
        return nil
    end
    FindClearSpaceForUnit(unit, pos, true)
    unit:SetIdleAcquire(true)
    unit:SetAcquisitionRange(1200)
    return unit
end
function SceneBuilder.prototype.addPlayerBot(self, name, team, entityScript)
    if entityScript == nil then
        entityScript = "bot/arcpit_bot_ai.lua"
    end
    local botHero = GameRules:AddBotPlayerWithEntityScript(
        "npc_dota_hero_wisp",
        name,
        team,
        entityScript,
        false
    )
    if not botHero then
        print("✗ Failed to create bot player via AddBotPlayerWithEntityScript")
        return nil
    end
    return botHero
end
function SceneBuilder.prototype.makeCreepsAggressive(self, creeps, target)
    for ____, creep in ipairs(creeps) do
        if IsValidEntity(creep) then
            creep:SetAcquisitionRange(2000)
            creep:SetIdleAcquire(true)
            ExecuteOrderFromTable({
                UnitIndex = creep:entindex(),
                OrderType = DOTA_UNIT_ORDER_ATTACK_TARGET,
                TargetIndex = target:entindex()
            })
        end
    end
    print((("✓ " .. tostring(#creeps)) .. " creeps now aggressive to ") .. target:GetUnitName())
end
function SceneBuilder.prototype.teleportHero(self, hero, position)
    local pos = Vector(position.x, position.y, position.z)
    hero:SetAbsOrigin(pos)
    FindClearSpaceForUnit(hero, pos, true)
end
function SceneBuilder.prototype.clearAbilities(self, hero)
    do
        local i = hero:GetAbilityCount() - 1
        while i >= 0 do
            local ability = hero:GetAbilityByIndex(i)
            if ability then
                hero:RemoveAbility(ability:GetAbilityName())
            end
            i = i - 1
        end
    end
end
function SceneBuilder.prototype.giveUnlimitedMana(self, hero)
    hero:AddNewModifier(hero, nil, "modifier_infinite_mana", {})
end
function SceneBuilder.prototype.getSpawnPoint(self)
    return self.spawnManager:getSpawnLocation()
end
function SceneBuilder.prototype.enableCombat(self, hero)
    self.peaceMode:removeFromHero(hero)
    print("✓ Combat enabled for " .. hero:GetUnitName())
end
function SceneBuilder.prototype.enableCombatForAll(self)
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue41
                end
                local hero = PlayerResource:GetSelectedHeroEntity(i)
                if hero and IsValidEntity(hero) then
                    self.peaceMode:removeFromHero(hero)
                end
            end
            ::__continue41::
            i = i + 1
        end
    end
    print("✓ Combat enabled for all heroes")
end
return ____exports
