local ____lualib = require("lualib_bundle")
local __TS__ObjectAssign = ____lualib.__TS__ObjectAssign
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 2,["8"] = 3,["10"] = 6,["11"] = 7,["12"] = 9,["13"] = 10,["15"] = 13,["16"] = 14,["18"] = 17,["19"] = 18,["20"] = 6});
local ____exports = {}
local global = _G
if global.reloadCache == nil then
    global.reloadCache = {}
end
function ____exports.reloadable(self, constructor, context)
    local className = context.name
    if className == nil then
        error("Cannot reload classes without names!", 0)
    end
    if global.reloadCache[className] == nil then
        global.reloadCache[className] = constructor
    end
    __TS__ObjectAssign(global.reloadCache[className].prototype, constructor.prototype)
    return global.reloadCache[className]
end
return ____exports
