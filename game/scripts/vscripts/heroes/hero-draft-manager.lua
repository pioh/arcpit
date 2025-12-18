local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__Iterator = ____lualib.__TS__Iterator
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__ArrayFilter = ____lualib.__TS__ArrayFilter
local Set = ____lualib.Set
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["12"] = 1,["13"] = 1,["19"] = 21,["20"] = 21,["21"] = 21,["22"] = 26,["23"] = 26,["24"] = 27,["25"] = 28,["26"] = 29,["27"] = 30,["28"] = 22,["29"] = 23,["30"] = 25,["31"] = 33,["32"] = 33,["33"] = 33,["35"] = 34,["36"] = 36,["37"] = 37,["38"] = 38,["39"] = 39,["40"] = 39,["41"] = 39,["42"] = 39,["43"] = 40,["46"] = 43,["47"] = 44,["50"] = 48,["51"] = 49,["52"] = 50,["54"] = 59,["55"] = 60,["56"] = 61,["57"] = 61,["58"] = 61,["59"] = 64,["60"] = 65,["61"] = 66,["62"] = 66,["64"] = 67,["65"] = 68,["66"] = 69,["67"] = 61,["68"] = 61,["71"] = 75,["72"] = 75,["73"] = 75,["74"] = 78,["75"] = 79,["76"] = 80,["77"] = 75,["78"] = 75,["79"] = 33,["80"] = 85,["81"] = 87,["82"] = 87,["83"] = 87,["85"] = 88,["86"] = 88,["88"] = 89,["89"] = 90,["93"] = 95,["94"] = 95,["95"] = 95,["96"] = 98,["97"] = 99,["98"] = 100,["99"] = 95,["100"] = 95,["101"] = 85,["102"] = 105,["103"] = 106,["104"] = 105,["105"] = 112,["106"] = 113,["107"] = 113,["108"] = 113,["109"] = 114,["110"] = 114,["113"] = 116,["114"] = 112,["115"] = 119,["116"] = 120,["117"] = 121,["120"] = 122,["125"] = 125,["128"] = 126,["133"] = 129,["136"] = 130,["141"] = 133,["144"] = 134,["149"] = 138,["150"] = 139,["153"] = 141,["156"] = 145,["157"] = 146,["160"] = 147,["166"] = 150,["170"] = 155,["173"] = 172,["176"] = 157,["177"] = 158,["178"] = 159,["179"] = 161,["180"] = 163,["181"] = 164,["183"] = 166,["184"] = 167,["186"] = 169,["194"] = 119,["195"] = 177,["196"] = 178,["197"] = 180,["198"] = 180,["199"] = 180,["200"] = 180,["201"] = 181,["202"] = 183,["203"] = 184,["204"] = 185,["206"] = 186,["207"] = 186,["209"] = 187,["210"] = 188,["211"] = 188,["213"] = 189,["214"] = 190,["217"] = 186,["220"] = 192,["221"] = 177,["222"] = 195,["225"] = 197,["226"] = 198,["227"] = 199,["229"] = 200,["230"] = 200,["232"] = 201,["233"] = 201,["235"] = 202,["236"] = 202,["240"] = 204,["245"] = 205,["250"] = 206,["253"] = 207,["257"] = 209,["258"] = 210,["262"] = 195});
local ____exports = {}
local ____hero_2Dpool = require("heroes.hero-pool")
local HERO_POOL = ____hero_2Dpool.HERO_POOL
--- Индивидуальный драфт героя: 6 случайных героев на игрока, клик -> ВЫБОР героя.
-- 
-- ВАЖНО: по текущему ТЗ мы НЕ спавним героя в момент клика.
-- Мы только фиксируем выбранного героя через PlayerResource.SetSelectedHero,
-- а дальше движок показывает стандартный экран аспектов (STRATEGY_TIME) и спавнит героя нормально.
____exports.HeroDraftManager = __TS__Class()
local HeroDraftManager = ____exports.HeroDraftManager
HeroDraftManager.name = "HeroDraftManager"
function HeroDraftManager.prototype.____constructor(self, playerManager, teamAssignment, peaceMode, spawnManager, abilityDraft)
    self.playerManager = playerManager
    self.teamAssignment = teamAssignment
    self.peaceMode = peaceMode
    self.spawnManager = spawnManager
    self.abilityDraft = abilityDraft
    self.offers = __TS__New(Map)
    self.offerSeq = 0
end
function HeroDraftManager.prototype.start(self, duration, useRealTime)
    if useRealTime == nil then
        useRealTime = false
    end
    self.offers:clear()
    local ids = self.playerManager:getAllValidPlayerIDs()
    for ____, pid in ipairs(ids) do
        local heroes = self:getRandomUniqueHeroes(6)
        local ____self_0, ____offerSeq_1 = self, "offerSeq"
        local ____self_offerSeq_2 = ____self_0[____offerSeq_1] + 1
        ____self_0[____offerSeq_1] = ____self_offerSeq_2
        local offerId = ____self_offerSeq_2
        self.offers:set(pid, {offerId = offerId, heroes = heroes, picked = false})
        do
            pcall(function()
                local isBot = PlayerResource:IsFakeClient(pid)
                print((((((("[arcpit][HeroDraft] offer -> pid=" .. tostring(pid)) .. " bot=") .. tostring(isBot and 1 or 0)) .. " offerId=") .. tostring(offerId)) .. " heroes=") .. table.concat(heroes, ","))
            end)
        end
        local player = PlayerResource:GetPlayer(pid)
        if player then
            CustomGameEventManager:Send_ServerToPlayer(player, "arcpit_hero_draft_offer", {playerID = pid, offerId = offerId, duration = duration, heroes = heroes})
        end
        if PlayerResource:IsFakeClient(pid) then
            local delay = 0.25 + RandomFloat(0, 0.35)
            Timers:CreateTimer({
                useGameTime = not useRealTime,
                endTime = delay,
                callback = function()
                    local offer = self.offers:get(pid)
                    if not offer or offer.picked then
                        return nil
                    end
                    local pick = offer.heroes[RandomInt(0, #offer.heroes - 1) + 1]
                    self:pickHero(pid, offer.offerId, pick)
                    return nil
                end
            })
        end
    end
    Timers:CreateTimer({
        useGameTime = not useRealTime,
        endTime = duration,
        callback = function()
            self:finish()
            return nil
        end
    })
end
function HeroDraftManager.prototype.finish(self)
    for ____, ____value in __TS__Iterator(self.offers:entries()) do
        local pid = ____value[1]
        local offer = ____value[2]
        do
            if offer.picked then
                goto __continue13
            end
            local pick = offer.heroes[RandomInt(0, #offer.heroes - 1) + 1]
            self:pickHero(pid, offer.offerId, pick)
        end
        ::__continue13::
    end
    Timers:CreateTimer({
        useGameTime = false,
        endTime = 0.5,
        callback = function()
            self:cleanupWispHeroes()
            return nil
        end
    })
end
function HeroDraftManager.prototype.onClientPick(self, playerID, offerId, heroName)
    self:pickHero(playerID, offerId, heroName)
end
function HeroDraftManager.prototype.getOfferOwnerByOfferId(self, offerId)
    for ____, ____value in __TS__Iterator(self.offers:entries()) do
        local pid = ____value[1]
        local offer = ____value[2]
        if offer.offerId == offerId then
            return pid
        end
    end
    return nil
end
function HeroDraftManager.prototype.pickHero(self, playerID, offerId, heroName)
    local offer = self.offers:get(playerID)
    if not offer then
        do
            pcall(function()
                print((((("[arcpit][HeroDraft] pick IGNORE pid=" .. tostring(playerID)) .. " (no offer) offerId=") .. tostring(offerId)) .. " hero=") .. heroName)
            end)
        end
        return
    end
    if offer.picked then
        do
            pcall(function()
                print((((("[arcpit][HeroDraft] pick IGNORE pid=" .. tostring(playerID)) .. " (already picked) offerId=") .. tostring(offerId)) .. " hero=") .. heroName)
            end)
        end
        return
    end
    if offer.offerId ~= offerId then
        do
            pcall(function()
                print((((((("[arcpit][HeroDraft] pick IGNORE pid=" .. tostring(playerID)) .. " (offerId mismatch got=") .. tostring(offerId)) .. " expected=") .. tostring(offer.offerId)) .. ") hero=") .. heroName)
            end)
        end
        return
    end
    if not __TS__ArrayIncludes(offer.heroes, heroName) then
        do
            pcall(function()
                print((((((("[arcpit][HeroDraft] pick IGNORE pid=" .. tostring(playerID)) .. " (hero not in offer) offerId=") .. tostring(offerId)) .. " hero=") .. heroName) .. " offered=") .. table.concat(offer.heroes, ","))
            end)
        end
        return
    end
    offer.picked = true
    self.offers:set(playerID, offer)
    do
        pcall(function()
            print((((("[arcpit][HeroDraft] PICK pid=" .. tostring(playerID)) .. " offerId=") .. tostring(offerId)) .. " hero=") .. heroName)
        end)
    end
    local player = PlayerResource:GetPlayer(playerID)
    if player then
        do
            pcall(function()
                player:SetSelectedHero(heroName)
            end)
        end
    else
        do
            pcall(function()
                print(((("[arcpit][HeroDraft] WARNING: no Player handle for pid=" .. tostring(playerID)) .. ", cannot SetSelectedHero(") .. heroName) .. ")")
            end)
        end
    end
    if PlayerResource:IsFakeClient(playerID) then
        do
            local function ____catch(e)
                print((("[arcpit][HeroDraft] ERROR: bot ReplaceHeroWith failed pid=" .. tostring(playerID)) .. " hero=") .. heroName)
            end
            local ____try, ____hasReturned = pcall(function()
                local replaced = PlayerResource:ReplaceHeroWith(playerID, heroName, 0, 0)
                if replaced and IsValidEntity(replaced) then
                    self.playerManager:setPlayerHero(playerID, replaced)
                    self.peaceMode:applyToHero(replaced)
                    for ____, pid in ipairs(self.playerManager:getAllValidPlayerIDs()) do
                        replaced:SetControllableByPlayer(pid, false)
                    end
                    replaced:SetControllableByPlayer(playerID, true)
                    print((("[arcpit][HeroDraft] bot hero replaced pid=" .. tostring(playerID)) .. " -> ") .. heroName)
                else
                    print((("[arcpit][HeroDraft] WARNING: bot ReplaceHeroWith returned undefined for pid=" .. tostring(playerID)) .. " hero=") .. heroName)
                end
            end)
            if not ____try then
                ____catch(____hasReturned)
            end
        end
    end
end
function HeroDraftManager.prototype.getRandomUniqueHeroes(self, n)
    local pool = {unpack(HERO_POOL)}
    local filtered = __TS__ArrayFilter(
        pool,
        function(____, h) return h ~= "npc_dota_hero_wisp" end
    )
    local src = #filtered >= n and filtered or pool
    local out = {}
    local used = __TS__New(Set)
    local tries = 200
    do
        local t = 0
        while t < tries and #out < n do
            do
                local pick = src[RandomInt(0, #src - 1) + 1]
                if used:has(pick) then
                    goto __continue46
                end
                used:add(pick)
                out[#out + 1] = pick
            end
            ::__continue46::
            t = t + 1
        end
    end
    return out
end
function HeroDraftManager.prototype.cleanupWispHeroes(self)
    do
        pcall(function()
            local wisps = Entities:FindAllByClassname("npc_dota_hero_wisp")
            local removed = 0
            for ____, w in ipairs(wisps) do
                do
                    if not w or not IsValidEntity(w) then
                        goto __continue50
                    end
                    if not w:IsRealHero() then
                        goto __continue50
                    end
                    if w:GetUnitName() ~= "npc_dota_hero_wisp" then
                        goto __continue50
                    end
                    do
                        pcall(function()
                            w:ForceKill(false)
                        end)
                    end
                    do
                        pcall(function()
                            _G:UTIL_Remove(w)
                        end)
                    end
                    do
                        pcall(function()
                            w:RemoveSelf()
                        end)
                    end
                    removed = removed + 1
                end
                ::__continue50::
            end
            if removed > 0 then
                print(("[arcpit][HeroDraft] cleaned up " .. tostring(removed)) .. " leftover wisp heroes")
            end
        end)
    end
end
return ____exports
