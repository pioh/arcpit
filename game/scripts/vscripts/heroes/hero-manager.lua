local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["9"] = 9,["10"] = 9,["11"] = 9,["12"] = 11,["13"] = 11,["14"] = 12,["15"] = 13,["16"] = 10,["17"] = 19,["18"] = 20,["19"] = 23,["20"] = 24,["22"] = 25,["23"] = 25,["25"] = 26,["26"] = 26,["28"] = 27,["29"] = 28,["30"] = 28,["32"] = 29,["35"] = 25,["38"] = 33,["40"] = 34,["41"] = 34,["43"] = 35,["44"] = 35,["46"] = 37,["47"] = 38,["48"] = 39,["49"] = 40,["51"] = 43,["52"] = 48,["53"] = 49,["55"] = 50,["56"] = 50,["57"] = 51,["60"] = 54,["65"] = 55,["68"] = 57,["69"] = 59,["70"] = 60,["71"] = 61,["74"] = 50,["77"] = 66,["78"] = 71,["79"] = 72,["81"] = 74,["82"] = 75,["83"] = 76,["84"] = 77,["86"] = 79,["90"] = 34,["93"] = 83,["94"] = 84,["95"] = 85,["96"] = 85,["97"] = 85,["98"] = 86,["99"] = 87,["100"] = 85,["101"] = 85,["104"] = 93,["105"] = 93,["106"] = 93,["107"] = 94,["108"] = 95,["109"] = 95,["111"] = 96,["112"] = 93,["113"] = 93,["114"] = 19,["115"] = 100,["116"] = 101,["117"] = 100});
local ____exports = {}
local ____hero_2Dpool = require("heroes.hero-pool")
local HERO_POOL = ____hero_2Dpool.HERO_POOL
--- Управление героями
____exports.HeroManager = __TS__Class()
local HeroManager = ____exports.HeroManager
HeroManager.name = "HeroManager"
function HeroManager.prototype.____constructor(self, playerManager, teamAssignment, peaceMode)
    self.playerManager = playerManager
    self.teamAssignment = teamAssignment
    self.peaceMode = peaceMode
end
function HeroManager.prototype.autoSelectForAllPlayers(self, onComplete)
    print("=== Auto-selecting heroes for all players ===")
    local humanPlayerIDs = {}
    local allValidPlayerIDs = {}
    do
        local p = 0
        while p < 64 do
            do
                if not PlayerResource:IsValidPlayerID(p) then
                    goto __continue5
                end
                allValidPlayerIDs[#allValidPlayerIDs + 1] = p
                if PlayerResource:IsFakeClient(p) then
                    goto __continue5
                end
                humanPlayerIDs[#humanPlayerIDs + 1] = p
            end
            ::__continue5::
            p = p + 1
        end
    end
    local pending = 0
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue9
                end
                local current = PlayerResource:GetSelectedHeroEntity(i)
                if not current or not IsValidEntity(current) then
                    pending = pending + 1
                    goto __continue9
                end
                local team = self.teamAssignment:getPlayerTeam(i) or DOTA_TEAM_CUSTOM_1 + i
                local replaced
                local maxAttempts = 12
                do
                    local attempt = 1
                    while attempt <= maxAttempts do
                        local randomHero = self:getRandomHero()
                        do
                            pcall(function()
                                PlayerResource:SetSelectedHeroFacet(i, 0)
                            end)
                        end
                        do
                            pcall(function()
                                PlayerResource:SetSelectedHero(i, randomHero)
                            end)
                        end
                        print((((((((("Replacing hero attempt " .. tostring(attempt)) .. "/") .. tostring(maxAttempts)) .. ": ") .. randomHero) .. " for player ") .. tostring(i)) .. " on team ") .. tostring(team))
                        local hero = PlayerResource:ReplaceHeroWith(i, randomHero, 0, 0)
                        if hero ~= nil then
                            replaced = hero
                            break
                        end
                        attempt = attempt + 1
                    end
                end
                if replaced then
                    for ____, pid in ipairs(allValidPlayerIDs) do
                        replaced:SetControllableByPlayer(pid, false)
                    end
                    replaced:SetControllableByPlayer(i, true)
                    self.playerManager:setPlayerHero(i, replaced)
                    self.peaceMode:applyToHero(replaced)
                    print("✓ Hero replaced for player " .. tostring(i))
                else
                    print(("✗ Failed to replace hero for player " .. tostring(i)) .. " after retries (facet issue?)")
                end
            end
            ::__continue9::
            i = i + 1
        end
    end
    if pending > 0 then
        print(("AutoSelectHeroes: " .. tostring(pending)) .. " players without hero, retrying...")
        Timers:CreateTimer(
            0.25,
            function()
                self:autoSelectForAllPlayers(onComplete)
                return nil
            end
        )
        return
    end
    Timers:CreateTimer(
        0.5,
        function()
            self.playerManager:saveCurrentHeroes()
            if onComplete then
                onComplete(nil)
            end
            return nil
        end
    )
end
function HeroManager.prototype.getRandomHero(self)
    return HERO_POOL[RandomInt(0, #HERO_POOL - 1) + 1]
end
return ____exports
