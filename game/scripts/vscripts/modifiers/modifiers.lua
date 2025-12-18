local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 7,["6"] = 8,["7"] = 9,["8"] = 10,["10"] = 13,["18"] = 14,["26"] = 15,["34"] = 16});
local ____exports = {}
require("modifiers.modifier_temp_int_buckets")
require("modifiers.modifier_glaives_temp_int_handler")
require("modifiers.modifier_infinite_mana")
require("modifiers.modifier_round_creep_scaling")
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
return ____exports
