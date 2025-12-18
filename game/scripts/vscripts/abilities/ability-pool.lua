local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 5,["8"] = 5,["9"] = 5,["10"] = 5,["11"] = 5,["12"] = 5,["13"] = 5,["14"] = 5,["15"] = 5,["16"] = 5,["17"] = 5,["18"] = 5,["19"] = 5,["20"] = 5,["21"] = 5,["22"] = 5,["23"] = 5,["24"] = 5,["25"] = 5,["26"] = 5,["27"] = 5,["28"] = 5,["29"] = 5,["30"] = 5,["31"] = 5,["32"] = 5,["33"] = 5,["34"] = 5,["35"] = 5,["36"] = 5});
local ____exports = {}
--- Пул доступных способностей
-- Здесь можно настраивать список способностей для выбора
____exports.ABILITY_POOL = {
    "axe_berserkers_call",
    "axe_battle_hunger",
    "axe_counter_helix",
    "axe_culling_blade",
    "juggernaut_blade_fury",
    "juggernaut_healing_ward",
    "juggernaut_blade_dance",
    "juggernaut_omni_slash",
    "sven_storm_bolt",
    "sven_great_cleave",
    "sven_warcry",
    "sven_gods_strength",
    "pudge_meat_hook",
    "pudge_rot",
    "pudge_flesh_heap",
    "pudge_dismember",
    "crystal_maiden_crystal_nova",
    "crystal_maiden_frostbite",
    "crystal_maiden_brilliance_aura",
    "crystal_maiden_freezing_field",
    "lina_dragon_slave",
    "lina_light_strike_array",
    "lina_fiery_soul",
    "lina_laguna_blade",
    "silencer_curse_of_the_silent",
    "silencer_glaives_of_wisdom",
    "silencer_last_word",
    "silencer_global_silence"
}
return ____exports
