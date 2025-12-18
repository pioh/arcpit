local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__ClassExtends = ____lualib.__TS__ClassExtends
local __TS__Delete = ____lualib.__TS__Delete
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 121,["9"] = 121,["10"] = 122,["11"] = 123,["12"] = 124,["13"] = 125,["14"] = 126,["15"] = 126,["16"] = 126,["17"] = 126,["19"] = 129,["22"] = 133,["23"] = 134,["24"] = 134,["25"] = 135,["26"] = 136,["27"] = 139,["28"] = 140,["31"] = 144,["34"] = 2,["35"] = 2,["36"] = 2,["38"] = 2,["39"] = 5,["40"] = 5,["41"] = 5,["43"] = 5,["44"] = 8,["45"] = 8,["46"] = 8,["48"] = 8,["49"] = 9,["50"] = 16,["51"] = 9,["52"] = 21,["53"] = 21,["54"] = 21,["55"] = 21,["56"] = 24,["57"] = 24,["58"] = 24,["59"] = 24,["60"] = 27,["61"] = 27,["62"] = 27,["63"] = 27,["64"] = 30,["65"] = 31,["66"] = 32,["67"] = 34,["68"] = 35,["69"] = 37,["71"] = 38,["72"] = 39,["74"] = 41,["76"] = 44,["77"] = 44,["78"] = 44,["79"] = 44,["80"] = 44,["81"] = 46,["82"] = 48,["83"] = 50,["84"] = 51,["85"] = 52,["86"] = 53,["87"] = 54,["89"] = 51,["90"] = 34,["91"] = 59,["92"] = 60,["93"] = 62,["95"] = 63,["96"] = 64,["98"] = 66,["100"] = 69,["101"] = 69,["102"] = 69,["103"] = 69,["104"] = 69,["105"] = 70,["106"] = 72,["107"] = 74,["108"] = 76,["109"] = 77,["110"] = 78,["111"] = 79,["112"] = 80,["114"] = 77,["115"] = 84,["116"] = 85,["117"] = 86,["118"] = 87,["119"] = 88,["121"] = 90,["122"] = 91,["124"] = 93,["125"] = 94,["128"] = 98,["130"] = 101,["131"] = 59,["134"] = 108,["135"] = 109,["136"] = 109,["137"] = 109,["138"] = 109,["139"] = 109,["140"] = 110,["141"] = 111,["142"] = 110,["143"] = 108,["144"] = 115,["145"] = 116,["146"] = 117,["148"] = 115});
local ____exports = {}
local getFileScope, toDotaClassInstance
function getFileScope(self)
    local level = 1
    while true do
        local info = debug.getinfo(level, "S")
        if info and info.what == "main" then
            return {
                getfenv(level),
                info.source
            }
        end
        level = level + 1
    end
end
function toDotaClassInstance(self, instance, ____table)
    local ____table_0 = ____table
    local prototype = ____table_0.prototype
    while prototype do
        for key in pairs(prototype) do
            if not (rawget(instance, key) ~= nil) then
                instance[key] = prototype[key]
            end
        end
        prototype = getmetatable(prototype)
    end
end
____exports.BaseAbility = __TS__Class()
local BaseAbility = ____exports.BaseAbility
BaseAbility.name = "BaseAbility"
function BaseAbility.prototype.____constructor(self)
end
____exports.BaseItem = __TS__Class()
local BaseItem = ____exports.BaseItem
BaseItem.name = "BaseItem"
function BaseItem.prototype.____constructor(self)
end
____exports.BaseModifier = __TS__Class()
local BaseModifier = ____exports.BaseModifier
BaseModifier.name = "BaseModifier"
function BaseModifier.prototype.____constructor(self)
end
function BaseModifier.apply(self, target, caster, ability, modifierTable)
    return target:AddNewModifier(caster, ability, self.name, modifierTable)
end
____exports.BaseModifierMotionHorizontal = __TS__Class()
local BaseModifierMotionHorizontal = ____exports.BaseModifierMotionHorizontal
BaseModifierMotionHorizontal.name = "BaseModifierMotionHorizontal"
__TS__ClassExtends(BaseModifierMotionHorizontal, ____exports.BaseModifier)
____exports.BaseModifierMotionVertical = __TS__Class()
local BaseModifierMotionVertical = ____exports.BaseModifierMotionVertical
BaseModifierMotionVertical.name = "BaseModifierMotionVertical"
__TS__ClassExtends(BaseModifierMotionVertical, ____exports.BaseModifier)
____exports.BaseModifierMotionBoth = __TS__Class()
local BaseModifierMotionBoth = ____exports.BaseModifierMotionBoth
BaseModifierMotionBoth.name = "BaseModifierMotionBoth"
__TS__ClassExtends(BaseModifierMotionBoth, ____exports.BaseModifier)
setmetatable(____exports.BaseAbility.prototype, {__index = CDOTA_Ability_Lua or C_DOTA_Ability_Lua})
setmetatable(____exports.BaseItem.prototype, {__index = CDOTA_Item_Lua or C_DOTA_Item_Lua})
setmetatable(____exports.BaseModifier.prototype, {__index = CDOTA_Modifier_Lua or CDOTA_Modifier_Lua})
____exports.registerAbility = function(____, name) return function(____, ability, context)
    if name ~= nil then
        ability.name = name
    end
    if context.name then
        name = context.name
    else
        error("Unable to determine name of this ability class!", 0)
    end
    local env = unpack(
        getFileScope(nil),
        1,
        1
    )
    env[name] = {}
    toDotaClassInstance(nil, env[name], ability)
    local originalSpawn = env[name].Spawn
    env[name].Spawn = function(self)
        self:____constructor()
        if originalSpawn then
            originalSpawn(self)
        end
    end
end end
____exports.registerModifier = function(____, name) return function(____, modifier, context)
    if name ~= nil then
        modifier.name = name
    end
    if context.name then
        name = context.name
    else
        error("Unable to determine name of this modifier class!", 0)
    end
    local env, source = unpack(
        getFileScope(nil),
        1,
        2
    )
    local fileName = string.gsub(source, ".*scripts[\\/]vscripts[\\/]", "")
    env[name] = {}
    toDotaClassInstance(nil, env[name], modifier)
    local originalOnCreated = env[name].OnCreated
    env[name].OnCreated = function(self, parameters)
        self:____constructor()
        if originalOnCreated ~= nil then
            originalOnCreated(self, parameters)
        end
    end
    local ____type = LUA_MODIFIER_MOTION_NONE
    local base = modifier.____super
    while base do
        if base == ____exports.BaseModifierMotionBoth then
            ____type = LUA_MODIFIER_MOTION_BOTH
            break
        elseif base == ____exports.BaseModifierMotionHorizontal then
            ____type = LUA_MODIFIER_MOTION_HORIZONTAL
            break
        elseif base == ____exports.BaseModifierMotionVertical then
            ____type = LUA_MODIFIER_MOTION_VERTICAL
            break
        end
        base = base.____super
    end
    LinkLuaModifier(name, fileName, ____type)
end end
--- Use to expose top-level functions in entity scripts.
-- Usage: registerEntityFunction("OnStartTouch", (trigger: TriggerStartTouchEvent) => { <your code here> });
function ____exports.registerEntityFunction(self, name, f)
    local env = unpack(
        getFileScope(nil),
        1,
        1
    )
    env[name] = function(...)
        f(nil, ...)
    end
end
local function clearTable(self, ____table)
    for key in pairs(____table) do
        __TS__Delete(____table, key)
    end
end
return ____exports
