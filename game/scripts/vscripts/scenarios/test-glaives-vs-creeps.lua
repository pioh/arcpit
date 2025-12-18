local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 17,["7"] = 17,["8"] = 17,["9"] = 19,["10"] = 19,["11"] = 20,["12"] = 21,["13"] = 22,["14"] = 23,["15"] = 18,["16"] = 29,["17"] = 30,["18"] = 33,["19"] = 34,["20"] = 35,["21"] = 36,["22"] = 38,["23"] = 41,["24"] = 41,["25"] = 41,["26"] = 42,["27"] = 43,["28"] = 44,["29"] = 43,["30"] = 42,["31"] = 47,["32"] = 41,["33"] = 41,["34"] = 29,["35"] = 54,["36"] = 55,["37"] = 58,["38"] = 59,["39"] = 60,["42"] = 64,["43"] = 65,["44"] = 69,["45"] = 70,["46"] = 71,["47"] = 72,["49"] = 77,["50"] = 78,["51"] = 79,["52"] = 81,["53"] = 82,["55"] = 84,["56"] = 85,["58"] = 87,["60"] = 92,["61"] = 95,["62"] = 98,["63"] = 101,["64"] = 102,["65"] = 105,["66"] = 107,["67"] = 111,["68"] = 112,["69"] = 113,["70"] = 115,["71"] = 116,["72"] = 116,["73"] = 116,["74"] = 116,["75"] = 117,["76"] = 119,["77"] = 120,["79"] = 124,["80"] = 124,["81"] = 124,["82"] = 125,["83"] = 126,["84"] = 124,["85"] = 124,["86"] = 54,["87"] = 133,["88"] = 134,["89"] = 137,["90"] = 140,["91"] = 146,["92"] = 133});
local ____exports = {}
____exports.TestGlaivesVsCreeps = __TS__Class()
local TestGlaivesVsCreeps = ____exports.TestGlaivesVsCreeps
TestGlaivesVsCreeps.name = "TestGlaivesVsCreeps"
function TestGlaivesVsCreeps.prototype.____constructor(self, sceneBuilder, playerManager, peaceMode, heroManager, abilityManager)
    self.sceneBuilder = sceneBuilder
    self.playerManager = playerManager
    self.peaceMode = peaceMode
    self.heroManager = heroManager
    self.abilityManager = abilityManager
end
function TestGlaivesVsCreeps.prototype.start(self)
    print("=== Starting TEST: Glaives vs Creeps ===")
    self.peaceMode:enable()
    self.playerManager:giveGoldToAll(9999)
    self.playerManager:disableUnitSharing()
    self.playerManager:saveCurrentHeroes()
    self.peaceMode:applyToAll()
    Timers:CreateTimer(
        0.1,
        function()
            self.heroManager:autoSelectForAllPlayers(function()
                self.abilityManager:autoSelectForAllPlayers(function()
                    self:setupTest()
                end)
            end)
            return nil
        end
    )
end
function TestGlaivesVsCreeps.prototype.setupTest(self)
    print("=== Setting up Glaives test ===")
    local player = self.sceneBuilder:getMainPlayer()
    if not player then
        print("✗ Main player not found!")
        return
    end
    local hero = player.hero
    print("✓ Main player hero: " .. hero:GetUnitName())
    local glaives = hero:FindAbilityByName("silencer_glaives_of_wisdom")
    if not glaives then
        self.sceneBuilder:giveAbility(hero, "silencer_glaives_of_wisdom", 0)
        glaives = hero:FindAbilityByName("silencer_glaives_of_wisdom")
    end
    if glaives then
        if glaives:GetLevel() < 1 then
            glaives:SetLevel(1)
            local pts = hero:GetAbilityPoints()
            hero:SetAbilityPoints(math.max(0, pts - 1))
        end
        if not glaives:GetAutoCastState() then
            glaives:ToggleAutoCast()
        end
        print("✓ Glaives learned to level 1 + autocast enabled (test only)")
    end
    self.sceneBuilder:setHeroLevel(hero, 5)
    self.sceneBuilder:healHero(hero)
    self.sceneBuilder:giveUnlimitedMana(hero)
    local spawnPoint = self.sceneBuilder:getSpawnPoint()
    self.sceneBuilder:teleportHero(hero, spawnPoint)
    self.sceneBuilder:enableCombat(hero)
    self.peaceMode:disable()
    local enemyTeam = DOTA_TEAM_CUSTOM_2
    local bot = self.sceneBuilder:addPlayerBot("TestBot", enemyTeam)
    if bot then
        bot:SetTeam(enemyTeam)
        self.sceneBuilder:teleportHero(
            bot,
            Vector(spawnPoint.x + 250, spawnPoint.y, spawnPoint.z)
        )
        self.sceneBuilder:enableCombat(bot)
        GameRules.Addon.botCombatEnabled = true
        print("✓ Player-bot spawned for test")
    end
    Timers:CreateTimer(
        1,
        function()
            self:spawnTestCreeps(hero, spawnPoint)
            return nil
        end
    )
end
function TestGlaivesVsCreeps.prototype.spawnTestCreeps(self, hero, center)
    print("=== Spawning test creeps ===")
    local creepPosition = Vector(center.x + 500, center.y, center.z)
    local creeps = self.sceneBuilder:spawnCreeps("npc_dota_creep_badguys_melee", 5, creepPosition, DOTA_TEAM_BADGUYS)
    self.sceneBuilder:makeCreepsAggressive(creeps, hero)
end
return ____exports
