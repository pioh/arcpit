local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 8,["9"] = 8,["10"] = 8,["11"] = 10,["12"] = 10,["13"] = 11,["14"] = 12,["15"] = 9,["16"] = 15,["17"] = 16,["18"] = 15,["19"] = 19,["20"] = 20,["21"] = 24,["22"] = 25,["23"] = 19});
local ____exports = {}
--- Стадия подготовки к бою
____exports.PreCombatStage = __TS__Class()
local PreCombatStage = ____exports.PreCombatStage
PreCombatStage.name = "PreCombatStage"
function PreCombatStage.prototype.____constructor(self, spawnManager, shopkeeperManager, playerHeroes)
    self.spawnManager = spawnManager
    self.shopkeeperManager = shopkeeperManager
    self.playerHeroes = playerHeroes
end
function PreCombatStage.prototype.getName(self)
    return "Pre-Combat"
end
function PreCombatStage.prototype.start(self)
    print("=== Starting pre-combat phase ===")
    local neutralCenter = self.spawnManager:getNeutralCenter()
    self.shopkeeperManager:ensureShopkeeper(neutralCenter)
end
return ____exports
