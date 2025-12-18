local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__ArrayIncludes = ____lualib.__TS__ArrayIncludes
local __TS__Iterator = ____lualib.__TS__Iterator
local __TS__StringStartsWith = ____lualib.__TS__StringStartsWith
local Set = ____lualib.Set
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["12"] = 2,["13"] = 2,["14"] = 3,["15"] = 3,["19"] = 15,["20"] = 15,["21"] = 15,["22"] = 22,["23"] = 22,["24"] = 16,["25"] = 17,["26"] = 18,["27"] = 19,["28"] = 21,["29"] = 25,["30"] = 26,["31"] = 25,["32"] = 29,["33"] = 30,["36"] = 33,["39"] = 35,["40"] = 36,["43"] = 38,["44"] = 39,["45"] = 40,["46"] = 41,["49"] = 43,["50"] = 44,["53"] = 46,["54"] = 47,["55"] = 51,["56"] = 52,["57"] = 53,["58"] = 54,["59"] = 55,["60"] = 55,["61"] = 55,["62"] = 56,["63"] = 57,["64"] = 55,["65"] = 55,["69"] = 60,["75"] = 65,["76"] = 67,["77"] = 67,["78"] = 67,["79"] = 67,["80"] = 68,["83"] = 71,["86"] = 74,["87"] = 75,["88"] = 75,["89"] = 75,["90"] = 75,["91"] = 75,["92"] = 75,["93"] = 75,["95"] = 85,["96"] = 86,["97"] = 86,["98"] = 86,["99"] = 87,["100"] = 88,["101"] = 88,["103"] = 89,["104"] = 90,["105"] = 91,["106"] = 86,["107"] = 86,["109"] = 29,["110"] = 96,["111"] = 97,["112"] = 98,["115"] = 99,["120"] = 102,["123"] = 103,["128"] = 106,["131"] = 107,["136"] = 112,["137"] = 114,["138"] = 115,["141"] = 118,["142"] = 119,["143"] = 119,["144"] = 119,["145"] = 120,["146"] = 121,["147"] = 119,["148"] = 119,["151"] = 126,["152"] = 127,["153"] = 129,["154"] = 129,["155"] = 129,["156"] = 130,["157"] = 131,["158"] = 129,["159"] = 129,["164"] = 137,["167"] = 138,["168"] = 141,["169"] = 142,["172"] = 145,["173"] = 146,["174"] = 147,["177"] = 151,["178"] = 151,["179"] = 151,["180"] = 152,["181"] = 153,["182"] = 151,["183"] = 151,["184"] = 157,["185"] = 158,["186"] = 158,["187"] = 158,["188"] = 159,["189"] = 160,["190"] = 158,["191"] = 158,["193"] = 96,["194"] = 165,["195"] = 166,["196"] = 166,["197"] = 166,["198"] = 167,["199"] = 167,["202"] = 169,["203"] = 165,["204"] = 172,["207"] = 174,["208"] = 175,["209"] = 175,["211"] = 177,["212"] = 178,["214"] = 179,["215"] = 179,["217"] = 180,["218"] = 181,["219"] = 181,["221"] = 182,["222"] = 183,["223"] = 183,["225"] = 184,["226"] = 184,["228"] = 185,["229"] = 185,["231"] = 186,["235"] = 179,["238"] = 189,["239"] = 190,["241"] = 191,["243"] = 191,["244"] = 191,["245"] = 191,["247"] = 191,["251"] = 192,["252"] = 193,["253"] = 194,["254"] = 194,["256"] = 195,["257"] = 195,["259"] = 196,["260"] = 197,["261"] = 198,["262"] = 199,["266"] = 202,["267"] = 203,["269"] = 204,["271"] = 204,["272"] = 204,["273"] = 204,["275"] = 204,["279"] = 205,["280"] = 206,["281"] = 207,["282"] = 207,["284"] = 208,["285"] = 208,["287"] = 209,["288"] = 210,["289"] = 211,["290"] = 212,["296"] = 173,["299"] = 172,["300"] = 226,["301"] = 227,["302"] = 227,["304"] = 228,["305"] = 228,["307"] = 229,["308"] = 229,["310"] = 230,["311"] = 230,["313"] = 231,["314"] = 231,["316"] = 232,["317"] = 232,["319"] = 233,["320"] = 226,["321"] = 236,["322"] = 237,["323"] = 238,["324"] = 239,["326"] = 241,["327"] = 241,["329"] = 242,["330"] = 243,["331"] = 243,["333"] = 244,["334"] = 247,["335"] = 247,["337"] = 249,["340"] = 241,["343"] = 251,["344"] = 236});
local ____exports = {}
local ____ability_2Dpool = require("abilities.ability-pool")
local ABILITY_POOL = ____ability_2Dpool.ABILITY_POOL
local ____ability_2Dcustomizer = require("abilities.ability-customizer")
local AbilityCustomizer = ____ability_2Dcustomizer.AbilityCustomizer
--- Выбор способностей "по требованию":
-- сервер решает, доступен ли выбор (по уровню и счётчику выбранных),
-- и если доступен — генерит 8 случайных способностей и показывает UI.
____exports.AbilityDraftManager = __TS__Class()
local AbilityDraftManager = ____exports.AbilityDraftManager
AbilityDraftManager.name = "AbilityDraftManager"
function AbilityDraftManager.prototype.____constructor(self, playerManager)
    self.playerManager = playerManager
    self.offerSeq = 0
    self.activeOffer = __TS__New(Map)
    self.chosenCount = __TS__New(Map)
    self.pendingRetry = __TS__New(Map)
end
function AbilityDraftManager.prototype.getChosenCount(self, playerID)
    return self.chosenCount:get(playerID) or 0
end
function AbilityDraftManager.prototype.maybeOffer(self, playerID)
    if not PlayerResource:IsValidPlayerID(playerID) then
        return
    end
    if self.activeOffer:has(playerID) then
        return
    end
    local hero = self.playerManager:getPlayerHero(playerID) or PlayerResource:GetSelectedHeroEntity(playerID)
    if not hero or not IsValidEntity(hero) then
        return
    end
    local level = hero:GetLevel()
    local chosen = self:getChosenCount(playerID)
    local allowed = self:allowedForLevel(level)
    if chosen >= allowed then
        return
    end
    local abilities = self:getRandomOfferAbilities(hero, 8)
    if #abilities <= 0 then
        return
    end
    local isBot = PlayerResource:IsFakeClient(playerID)
    local player = PlayerResource:GetPlayer(playerID)
    if not isBot and not player then
        local tries = (self.pendingRetry:get(playerID) or 0) + 1
        self.pendingRetry:set(playerID, tries)
        if tries <= 25 then
            Timers:CreateTimer(
                0.2,
                function()
                    self:maybeOffer(playerID)
                    return nil
                end
            )
        else
            do
                pcall(function()
                    print(("[arcpit][AbilityDraft] WARNING: no Player handle for pid=" .. tostring(playerID)) .. " after retries, skipping offer")
                end)
            end
        end
        return
    end
    self.pendingRetry:delete(playerID)
    local ____self_0, ____offerSeq_1 = self, "offerSeq"
    local ____self_offerSeq_2 = ____self_0[____offerSeq_1] + 1
    ____self_0[____offerSeq_1] = ____self_offerSeq_2
    local offerId = ____self_offerSeq_2
    self.activeOffer:set(playerID, {offerId = offerId, abilities = abilities})
    do
        pcall(function()
            print((((((((((((("[arcpit][AbilityDraft] offer -> pid=" .. tostring(playerID)) .. " bot=") .. tostring(isBot and 1 or 0)) .. " offerId=") .. tostring(offerId)) .. " level=") .. tostring(level)) .. " chosen=") .. tostring(chosen)) .. " allowed=") .. tostring(allowed)) .. " abilities=") .. table.concat(abilities, ","))
        end)
    end
    if player then
        CustomGameEventManager:Send_ServerToPlayer(player, "arcpit_ability_draft_offer", {
            playerID = playerID,
            offerId = offerId,
            abilities = abilities,
            chosenCount = chosen,
            allowedCount = allowed
        })
    end
    if PlayerResource:IsFakeClient(playerID) then
        Timers:CreateTimer(
            0.25 + RandomFloat(0, 0.35),
            function()
                local o = self.activeOffer:get(playerID)
                if not o or o.offerId ~= offerId then
                    return nil
                end
                local pick = o.abilities[RandomInt(0, #o.abilities - 1) + 1]
                self:onClientPick(playerID, offerId, pick)
                return nil
            end
        )
    end
end
function AbilityDraftManager.prototype.onClientPick(self, playerID, offerId, abilityName)
    local offer = self.activeOffer:get(playerID)
    if not offer then
        do
            pcall(function()
                print((((("[arcpit][AbilityDraft] pick IGNORE pid=" .. tostring(playerID)) .. " (no offer) offerId=") .. tostring(offerId)) .. " ability=") .. abilityName)
            end)
        end
        return
    end
    if offer.offerId ~= offerId then
        do
            pcall(function()
                print((((((("[arcpit][AbilityDraft] pick IGNORE pid=" .. tostring(playerID)) .. " (offerId mismatch got=") .. tostring(offerId)) .. " expected=") .. tostring(offer.offerId)) .. ") ability=") .. abilityName)
            end)
        end
        return
    end
    if not __TS__ArrayIncludes(offer.abilities, abilityName) then
        do
            pcall(function()
                print((((((("[arcpit][AbilityDraft] pick IGNORE pid=" .. tostring(playerID)) .. " (ability not in offer) offerId=") .. tostring(offerId)) .. " ability=") .. abilityName) .. " offered=") .. table.concat(offer.abilities, ","))
            end)
        end
        return
    end
    self.activeOffer:delete(playerID)
    local hero = self.playerManager:getPlayerHero(playerID) or PlayerResource:GetSelectedHeroEntity(playerID)
    if not hero or not IsValidEntity(hero) then
        return
    end
    if hero:FindAbilityByName(abilityName) then
        Timers:CreateTimer(
            0.05,
            function()
                self:maybeOffer(playerID)
                return nil
            end
        )
        return
    end
    local ab = hero:AddAbility(abilityName)
    if not ab then
        Timers:CreateTimer(
            0.2,
            function()
                self:maybeOffer(playerID)
                return nil
            end
        )
        return
    end
    do
        pcall(function()
            ab:SetLevel(0)
        end)
    end
    AbilityCustomizer:setupAbility(hero, abilityName)
    local next = (self.chosenCount:get(playerID) or 0) + 1
    self.chosenCount:set(playerID, next)
    do
        pcall(function()
            local level = hero:GetLevel()
            local allowed = self:allowedForLevel(level)
            print((((((((((("[arcpit][AbilityDraft] PICK pid=" .. tostring(playerID)) .. " offerId=") .. tostring(offerId)) .. " ability=") .. abilityName) .. " -> chosen=") .. tostring(next)) .. "/") .. tostring(allowed)) .. " level=") .. tostring(level))
        end)
    end
    Timers:CreateTimer(
        0.05,
        function()
            self:maybeOffer(playerID)
            return nil
        end
    )
    if PlayerResource:IsFakeClient(playerID) then
        Timers:CreateTimer(
            0.05,
            function()
                self:autoLevelBotNow(hero)
                return nil
            end
        )
    end
end
function AbilityDraftManager.prototype.getOfferOwnerByOfferId(self, offerId)
    for ____, ____value in __TS__Iterator(self.activeOffer:entries()) do
        local pid = ____value[1]
        local offer = ____value[2]
        if offer.offerId == offerId then
            return pid
        end
    end
    return nil
end
function AbilityDraftManager.prototype.autoLevelBotNow(self, hero)
    do
        local ____try, ____hasReturned, ____returnValue = pcall(function()
            local points = hero:GetAbilityPoints()
            if points <= 0 then
                return true
            end
            local abil = {}
            local talents = {}
            do
                local i = 0
                while i < hero:GetAbilityCount() do
                    do
                        local a = hero:GetAbilityByIndex(i)
                        if not a then
                            goto __continue45
                        end
                        local name = a:GetAbilityName()
                        if not name then
                            goto __continue45
                        end
                        if a:GetMaxLevel() <= 0 then
                            goto __continue45
                        end
                        if __TS__StringStartsWith(name, "special_bonus_") then
                            talents[#talents + 1] = a
                        else
                            abil[#abil + 1] = a
                        end
                    end
                    ::__continue45::
                    i = i + 1
                end
            end
            local guard = 0
            local idx = 0
            while true do
                local ____temp_4 = points > 0
                if ____temp_4 then
                    local ____guard_3 = guard
                    guard = ____guard_3 + 1
                    ____temp_4 = ____guard_3 < 2000
                end
                if not (____temp_4 and #abil > 0) then
                    break
                end
                do
                    local a = abil[idx % #abil + 1]
                    idx = idx + 1
                    if not a then
                        goto __continue51
                    end
                    if a:GetLevel() >= a:GetMaxLevel() then
                        goto __continue51
                    end
                    a:SetLevel(a:GetLevel() + 1)
                    points = hero:GetAbilityPoints()
                    hero:SetAbilityPoints(math.max(0, points - 1))
                    points = hero:GetAbilityPoints()
                end
                ::__continue51::
            end
            local tguard = 0
            local tidx = 0
            while true do
                local ____temp_6 = points > 0
                if ____temp_6 then
                    local ____tguard_5 = tguard
                    tguard = ____tguard_5 + 1
                    ____temp_6 = ____tguard_5 < 256
                end
                if not (____temp_6 and #talents > 0) then
                    break
                end
                do
                    local t = talents[tidx % #talents + 1]
                    tidx = tidx + 1
                    if not t then
                        goto __continue54
                    end
                    if t:GetLevel() >= t:GetMaxLevel() then
                        goto __continue54
                    end
                    t:SetLevel(t:GetLevel() + 1)
                    points = hero:GetAbilityPoints()
                    hero:SetAbilityPoints(math.max(0, points - 1))
                    points = hero:GetAbilityPoints()
                end
                ::__continue54::
            end
        end)
        if ____try and ____hasReturned then
            return ____returnValue
        end
    end
end
function AbilityDraftManager.prototype.allowedForLevel(self, level)
    if level >= 20 then
        return 7
    end
    if level >= 6 then
        return 6
    end
    if level >= 5 then
        return 5
    end
    if level >= 4 then
        return 4
    end
    if level >= 3 then
        return 3
    end
    if level >= 1 then
        return 2
    end
    return 0
end
function AbilityDraftManager.prototype.getRandomOfferAbilities(self, hero, n)
    local out = {}
    local used = __TS__New(Set)
    local tries = 400
    do
        local t = 0
        while t < tries and #out < n do
            do
                local pick = ABILITY_POOL[RandomInt(0, #ABILITY_POOL - 1) + 1]
                if used:has(pick) then
                    goto __continue66
                end
                used:add(pick)
                if hero:FindAbilityByName(pick) then
                    goto __continue66
                end
                out[#out + 1] = pick
            end
            ::__continue66::
            t = t + 1
        end
    end
    return out
end
return ____exports
