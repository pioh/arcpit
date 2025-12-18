local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["13"] = 12,["14"] = 12,["15"] = 19,["16"] = 20,["17"] = 12,["18"] = 29,["19"] = 30,["20"] = 12,["21"] = 12});
local ____exports = {}
--- Кастомизация героя Axe
-- 
-- ВАЖНО: Этот файл для врожденных особенностей САМОГО ГЕРОЯ Axe,
-- а НЕ для его способностей!
-- 
-- Способности (Berserker's Call, Culling Blade и т.д.) настраиваются в:
-- - modifiers/modifier_[ability]_custom.ts
-- - abilities/ability-customizer.ts
____exports.AxeConfig = {
    heroName = "npc_dota_hero_axe",
    onSpawn = function(self, hero)
        print("Axe spawned")
    end,
    onDeath = function(self, hero)
        print("Axe died")
    end
}
return ____exports
