local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["9"] = 7,["10"] = 7,["11"] = 7,["12"] = 11,["13"] = 11,["14"] = 8,["15"] = 10,["16"] = 14,["17"] = 15,["18"] = 14,["19"] = 18,["20"] = 19,["21"] = 18,["22"] = 22,["23"] = 23,["24"] = 22,["25"] = 29,["26"] = 30,["27"] = 33,["28"] = 36,["29"] = 37,["30"] = 38,["31"] = 39,["33"] = 41,["35"] = 29,["36"] = 48,["37"] = 49,["39"] = 50,["40"] = 50,["41"] = 51,["42"] = 52,["44"] = 50,["47"] = 55,["48"] = 48,["49"] = 62,["50"] = 63,["52"] = 64,["53"] = 64,["55"] = 65,["56"] = 65,["58"] = 66,["59"] = 66,["61"] = 69,["62"] = 70,["63"] = 70,["64"] = 70,["66"] = 70,["68"] = 70,["69"] = 72,["70"] = 72,["72"] = 74,["75"] = 64,["78"] = 76,["79"] = 62,["80"] = 82,["81"] = 83,["83"] = 84,["84"] = 84,["85"] = 85,["86"] = 85,["88"] = 84,["91"] = 87,["92"] = 82,["93"] = 93,["95"] = 94,["96"] = 94,["98"] = 95,["99"] = 95,["101"] = 96,["104"] = 94,["107"] = 93,["108"] = 103,["110"] = 104,["111"] = 104,["113"] = 105,["114"] = 105,["117"] = 106,["118"] = 106,["120"] = 107,["121"] = 107,["123"] = 108,["124"] = 108,["127"] = 109,["128"] = 109,["129"] = 110,["130"] = 109,["135"] = 106,["140"] = 104,["143"] = 103,["144"] = 119,["146"] = 120,["147"] = 120,["149"] = 121,["150"] = 121,["152"] = 122,["153"] = 123,["154"] = 124,["158"] = 120,["161"] = 119});
local ____exports = {}
--- Управление игроками
____exports.PlayerManager = __TS__Class()
local PlayerManager = ____exports.PlayerManager
PlayerManager.name = "PlayerManager"
function PlayerManager.prototype.____constructor(self, teamAssignment)
    self.teamAssignment = teamAssignment
    self.playerHeroes = __TS__New(Map)
end
function PlayerManager.prototype.getPlayerHero(self, playerID)
    return self.playerHeroes:get(playerID)
end
function PlayerManager.prototype.setPlayerHero(self, playerID, hero)
    self.playerHeroes:set(playerID, hero)
end
function PlayerManager.prototype.getAllPlayerHeroes(self)
    return self.playerHeroes
end
function PlayerManager.prototype.onPlayerConnected(self, playerID)
    print(("Player " .. tostring(playerID)) .. " connected")
    local teamID = self.teamAssignment:assignTeamToPlayer(playerID)
    local state = GameRules:State_Get()
    if state <= DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP then
        PlayerResource:SetCustomTeamAssignment(playerID, teamID)
        print((("Assigned player " .. tostring(playerID)) .. " to team ") .. tostring(teamID))
    else
        print(((("WARNING: Player " .. tostring(playerID)) .. " connected too late (state=") .. tostring(state)) .. ")")
    end
end
function PlayerManager.prototype.getHumanPlayerCount(self)
    local count = 0
    do
        local i = 0
        while i < 64 do
            if PlayerResource:IsValidPlayerID(i) and not PlayerResource:IsFakeClient(i) then
                count = count + 1
            end
            i = i + 1
        end
    end
    return count
end
function PlayerManager.prototype.getConnectedHumanPlayerIDs(self)
    local ids = {}
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue15
                end
                if PlayerResource:IsFakeClient(i) then
                    goto __continue15
                end
                local pr = PlayerResource
                local ____temp_0
                if type(pr.GetConnectionState) == "function" then
                    ____temp_0 = pr:GetConnectionState(i)
                else
                    ____temp_0 = nil
                end
                local state = ____temp_0
                if state ~= nil and state ~= 2 then
                    goto __continue15
                end
                ids[#ids + 1] = i
            end
            ::__continue15::
            i = i + 1
        end
    end
    return ids
end
function PlayerManager.prototype.getAllValidPlayerIDs(self)
    local ids = {}
    do
        local i = 0
        while i < 64 do
            if PlayerResource:IsValidPlayerID(i) then
                ids[#ids + 1] = i
            end
            i = i + 1
        end
    end
    return ids
end
function PlayerManager.prototype.giveGoldToAll(self, amount)
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue25
                end
                PlayerResource:SetGold(i, amount, true)
            end
            ::__continue25::
            i = i + 1
        end
    end
end
function PlayerManager.prototype.disableUnitSharing(self)
    do
        local a = 0
        while a < 64 do
            do
                if not PlayerResource:IsValidPlayerID(a) then
                    goto __continue29
                end
                do
                    local b = 0
                    while b < 64 do
                        do
                            if not PlayerResource:IsValidPlayerID(b) then
                                goto __continue32
                            end
                            if a == b then
                                goto __continue32
                            end
                            do
                                local f = 0
                                while f < 32 do
                                    PlayerResource:SetUnitShareMaskForPlayer(a, b, f, false)
                                    f = f + 1
                                end
                            end
                        end
                        ::__continue32::
                        b = b + 1
                    end
                end
            end
            ::__continue29::
            a = a + 1
        end
    end
end
function PlayerManager.prototype.saveCurrentHeroes(self)
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue39
                end
                local hero = PlayerResource:GetSelectedHeroEntity(i)
                if hero and IsValidEntity(hero) then
                    self.playerHeroes:set(i, hero)
                end
            end
            ::__continue39::
            i = i + 1
        end
    end
end
return ____exports
