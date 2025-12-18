local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 7,["6"] = 8,["7"] = 9,["8"] = 10,["9"] = 11,["10"] = 12,["11"] = 13,["12"] = 14,["13"] = 15,["15"] = 18,["23"] = 19,["31"] = 20,["39"] = 21,["47"] = 22,["55"] = 23,["63"] = 24,["71"] = 25,["79"] = 26});
local ____exports = {}
require("modifiers.modifier_temp_int_buckets")
require("modifiers.modifier_glaives_temp_int_handler")
require("modifiers.modifier_infinite_mana")
require("modifiers.modifier_round_creep_scaling")
require("modifiers.modifier_lina_dragon_slave_burn")
require("modifiers.modifier_arcpit_neutral_regen")
require("modifiers.modifier_arcpit_neutral_mana_regen")
require("modifiers.modifier_arcpit_bot_fun_hunt")
require("modifiers.modifier_arcpit_bot_fun_wander")
do
    local ____export = require("modifiers.modifier_temp_int_buckets")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("modifiers.modifier_glaives_temp_int_handler")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("modifiers.modifier_infinite_mana")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("modifiers.modifier_round_creep_scaling")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("modifiers.modifier_lina_dragon_slave_burn")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("modifiers.modifier_arcpit_neutral_regen")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("modifiers.modifier_arcpit_neutral_mana_regen")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("modifiers.modifier_arcpit_bot_fun_hunt")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
do
    local ____export = require("modifiers.modifier_arcpit_bot_fun_wander")
    for ____exportKey, ____exportValue in pairs(____export) do
        if ____exportKey ~= "default" then
            ____exports[____exportKey] = ____exportValue
        end
    end
end
return ____exports
