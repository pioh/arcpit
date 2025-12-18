local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["7"] = 6,["8"] = 6,["9"] = 6,["10"] = 16,["11"] = 18,["12"] = 6,["13"] = 6});
local ____exports = {}
--- Кастомизация способности Axe Culling Blade
-- Здесь можно настроить специфичную логику для этой способности
____exports.CullingBladeConfig = {
    abilityName = "axe_culling_blade",
    customParams = {bonusDamage = 0, executeThreshold = 250},
    onCast = function(self, caster, target)
        print((("Culling Blade cast by " .. caster:GetUnitName()) .. " on ") .. target:GetUnitName())
    end
}
return ____exports
