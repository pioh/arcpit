local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 5,["8"] = 5,["9"] = 5,["10"] = 5,["11"] = 5,["12"] = 5,["13"] = 5,["14"] = 5,["15"] = 5,["16"] = 5,["17"] = 5,["18"] = 5,["19"] = 5,["20"] = 5,["21"] = 5,["22"] = 5,["24"] = 25,["25"] = 28,["26"] = 29,["28"] = 25});
local ____exports = {}
--- Пул доступных героев
-- Здесь можно настраивать список героев для выбора
____exports.HERO_POOL = {
    "npc_dota_hero_axe",
    "npc_dota_hero_juggernaut",
    "npc_dota_hero_sven",
    "npc_dota_hero_pudge",
    "npc_dota_hero_crystal_maiden",
    "npc_dota_hero_lina",
    "npc_dota_hero_invoker",
    "npc_dota_hero_mirana",
    "npc_dota_hero_antimage",
    "npc_dota_hero_phantom_assassin",
    "npc_dota_hero_sniper",
    "npc_dota_hero_drow_ranger",
    "npc_dota_hero_silencer",
    "npc_dota_hero_wisp"
}
--- Прекеш героев
function ____exports.precacheHeroes(self, context)
    for ____, heroName in ipairs(____exports.HERO_POOL) do
        PrecacheUnitByNameSync(heroName, context)
    end
end
return ____exports
