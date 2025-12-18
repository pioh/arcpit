local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["18"] = 17,["19"] = 17,["20"] = 24,["21"] = 25,["22"] = 17,["23"] = 31,["24"] = 32,["25"] = 17,["26"] = 17});
local ____exports = {}
--- Кастомизация героя Silencer
-- 
-- ВАЖНО: Этот файл для кастомизации САМОГО ГЕРОЯ Silencer,
-- а не его способностей! Способности работают независимо от героя.
-- 
-- Например, здесь можно настроить:
-- - Врожденную пассивку Silencer (Int Steal on Death)
-- - Особые характеристики героя
-- - Логику при спавне/смерти конкретно для Silencer
-- 
-- Glaives of Wisdom настраивается в:
-- - modifiers/modifier_glaives_temp_int.ts (работает у ЛЮБОГО героя)
-- - abilities/ability-customizer.ts (автоматически применяется)
____exports.SilencerConfig = {
    heroName = "npc_dota_hero_silencer",
    onSpawn = function(self, hero)
        print("Silencer spawned")
    end,
    onDeath = function(self, hero)
        print("Silencer died")
    end
}
return ____exports
