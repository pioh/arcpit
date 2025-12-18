local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 29,["7"] = 30,["8"] = 30,["9"] = 30,["10"] = 33,["11"] = 34,["12"] = 34,["13"] = 34,["14"] = 34,["15"] = 30,["16"] = 29,["17"] = 42,["18"] = 42,["19"] = 42,["20"] = 45,["21"] = 46,["22"] = 46,["23"] = 46,["24"] = 46,["25"] = 46,["26"] = 45,["27"] = 52,["28"] = 52,["29"] = 52,["30"] = 52,["31"] = 52,["32"] = 45,["33"] = 42,["34"] = 42,["35"] = 29,["36"] = 29});
local ____exports = {}
--- Пример раундов
____exports.ROUNDS = {
    {
        roundNumber = 1,
        duration = 60,
        creepWaves = {{
            unitName = "npc_dota_creep_badguys_melee",
            count = 5,
            spawnDelay = 0,
            spawnLocation = Vector(0, 1000, 128)
        }}
    },
    {
        roundNumber = 2,
        duration = 90,
        creepWaves = {
            {
                unitName = "npc_dota_creep_badguys_melee",
                count = 8,
                spawnDelay = 0,
                spawnLocation = Vector(0, 1000, 128)
            },
            {
                unitName = "npc_dota_creep_badguys_ranged",
                count = 3,
                spawnDelay = 5,
                spawnLocation = Vector(0, 1000, 128)
            }
        },
        specialRules = {doubleDamage = true}
    }
}
return ____exports
