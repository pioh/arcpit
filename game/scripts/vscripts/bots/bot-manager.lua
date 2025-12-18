local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 6,["8"] = 6,["9"] = 6,["10"] = 12,["11"] = 12,["12"] = 7,["13"] = 8,["14"] = 9,["15"] = 11,["16"] = 15,["17"] = 16,["18"] = 15,["19"] = 19,["20"] = 20,["21"] = 19,["22"] = 23,["23"] = 24,["24"] = 23,["25"] = 27,["26"] = 28,["27"] = 27,["28"] = 31,["29"] = 32,["30"] = 31,["31"] = 38,["32"] = 38,["33"] = 38,["35"] = 40,["36"] = 41,["37"] = 43,["38"] = 44,["39"] = 46,["40"] = 46,["41"] = 46,["42"] = 46,["43"] = 46,["44"] = 46,["45"] = 46,["46"] = 54,["47"] = 55,["50"] = 59,["51"] = 60,["52"] = 61,["53"] = 63,["54"] = 64,["55"] = 65,["57"] = 67,["58"] = 68,["59"] = 68,["60"] = 69,["62"] = 71,["64"] = 73,["65"] = 38,["66"] = 80,["67"] = 81,["68"] = 82,["69"] = 83,["70"] = 84,["73"] = 86,["75"] = 87,["76"] = 87,["77"] = 88,["78"] = 87,["81"] = 80});
local ____exports = {}
--- Управление ботами
____exports.BotManager = __TS__Class()
local BotManager = ____exports.BotManager
BotManager.name = "BotManager"
function BotManager.prototype.____constructor(self, teamAssignment)
    self.teamAssignment = teamAssignment
    self.botCombatEnabled = false
    self.botPlayerIDs = {}
    self.nextPseudoID = -1
end
function BotManager.prototype.isBotCombatEnabled(self)
    return self.botCombatEnabled
end
function BotManager.prototype.enableBotCombat(self)
    self.botCombatEnabled = true
end
function BotManager.prototype.disableBotCombat(self)
    self.botCombatEnabled = false
end
function BotManager.prototype.getBotPlayerIDs(self)
    return {unpack(self.botPlayerIDs)}
end
function BotManager.prototype.getBotCount(self)
    return #self.botPlayerIDs
end
function BotManager.prototype.addBot(self, name)
    if name == nil then
        name = "ArcpitBot"
    end
    local pseudoID = self.nextPseudoID
    self.nextPseudoID = self.nextPseudoID - 1
    local team = self.teamAssignment:assignTeamToPlayer(pseudoID)
    print(((("Adding bot player \"" .. name) .. "\" on team ") .. tostring(team)) .. "...")
    local botHero = GameRules:AddBotPlayerWithEntityScript(
        "npc_dota_hero_wisp",
        name,
        team,
        "bot/arcpit_bot_ai.lua",
        false
    )
    if not botHero then
        print("✗ Failed to create bot player")
        return
    end
    local botPlayerID = botHero:GetPlayerID()
    if botPlayerID ~= nil then
        self.teamAssignment:setPlayerTeam(botPlayerID, team)
        local state = GameRules:State_Get()
        if state <= DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP then
            PlayerResource:SetCustomTeamAssignment(botPlayerID, team)
        end
        print((("✓ Bot created. PlayerID=" .. tostring(botPlayerID)) .. ", team=") .. tostring(team))
        local ____self_botPlayerIDs_0 = self.botPlayerIDs
        ____self_botPlayerIDs_0[#____self_botPlayerIDs_0 + 1] = botPlayerID
        return botPlayerID
    else
        print("WARNING: Bot hero has no PlayerID")
    end
    return nil
end
function BotManager.prototype.ensureBotsToFillFromConnectedHumans(self, maxPlayers, connectedHumanPlayerIDs)
    local currentHumans = #connectedHumanPlayerIDs
    local currentBots = self:getBotCount()
    local need = math.max(0, maxPlayers - (currentHumans + currentBots))
    if need <= 0 then
        return
    end
    print((((((("ensureBotsToFillFromConnectedHumans: humans=" .. tostring(currentHumans)) .. ", bots=") .. tostring(currentBots)) .. ", max=") .. tostring(maxPlayers)) .. ", need=") .. tostring(need))
    do
        local k = 0
        while k < need do
            self:addBot("Bot" .. tostring(k + 1))
            k = k + 1
        end
    end
end
return ____exports
