local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["12"] = 9,["13"] = 9,["14"] = 9,["16"] = 10,["17"] = 9,["18"] = 12,["19"] = 13,["22"] = 14,["25"] = 19,["26"] = 20,["29"] = 22,["35"] = 24,["36"] = 24,["38"] = 24,["45"] = 25,["46"] = 25,["48"] = 25,["55"] = 29,["56"] = 31,["57"] = 33,["58"] = 34,["61"] = 37,["62"] = 40,["63"] = 40,["64"] = 40,["65"] = 40,["66"] = 40,["67"] = 40,["68"] = 40,["69"] = 40,["70"] = 40,["71"] = 40,["72"] = 40,["73"] = 53,["76"] = 55,["77"] = 56,["80"] = 57,["83"] = 58,["87"] = 54,["90"] = 61,["91"] = 53,["92"] = 64,["95"] = 65,["98"] = 31,["99"] = 69,["100"] = 69,["101"] = 69,["102"] = 69,["103"] = 69,["104"] = 72,["105"] = 73,["106"] = 73,["107"] = 73,["108"] = 73,["109"] = 73,["111"] = 12});
local ____exports = {}
local ____arena_2Dlayout = require("shared.arena-layout")
local buildLayout = ____arena_2Dlayout.buildLayout
--- Best-effort: добавляем omnidirectional освещение, чтобы арены были "яркими" со всех сторон,
-- а не только от направленного projected texture / spotlight.
-- 
-- Важно: это не замена нормальной настройки света в Hammer, но помогает для прототипа.
____exports.LightingManager = __TS__Class()
local LightingManager = ____exports.LightingManager
LightingManager.name = "LightingManager"
function LightingManager.prototype.____constructor(self)
    self.spawned = false
end
function LightingManager.prototype.ensureLights(self)
    if self.spawned then
        return
    end
    self.spawned = true
    do
        pcall(function()
            local gl = Entities:FindByClassname(nil, "env_global_light")
            if gl then
                do
                    pcall(function()
                        gl:SetAngles(-90, 0, 0)
                    end)
                end
                do
                    pcall(function()
                        local ____this_1
                        ____this_1 = gl
                        local ____opt_0 = ____this_1.__KeyValueFromString
                        if ____opt_0 ~= nil then
                            ____opt_0(____this_1, "brightness", "4")
                        end
                    end)
                end
                do
                    pcall(function()
                        local ____this_3
                        ____this_3 = gl
                        local ____opt_2 = ____this_3.__KeyValueFromString
                        if ____opt_2 ~= nil then
                            ____opt_2(____this_3, "_light", "255 255 255 255")
                        end
                    end)
                end
            end
        end)
    end
    local layout = buildLayout(nil, {debug = false, logPrefix = "[arena-layout]"})
    local function spawnOmni(____, name, pos)
        local existing = Entities:FindByName(nil, name)
        if existing then
            return
        end
        local origin = (((tostring(pos.x) .. " ") .. tostring(pos.y)) .. " ") .. tostring(pos.z + 320)
        local kv = {
            targetname = name,
            origin = origin,
            _light = "255 255 255 255",
            brightness = "6",
            distance = "6000",
            quadratic_attn = "1",
            linear_attn = "0",
            constant_attn = "0",
            castshadows = "0"
        }
        local function trySpawn(____, classname)
            do
                local ____try, ____hasReturned, ____returnValue = pcall(function()
                    local ent = SpawnEntityFromTableSynchronous(classname, kv)
                    if ent ~= nil then
                        do
                            pcall(function()
                                ent:SetName(name)
                            end)
                        end
                        return true, true
                    end
                end)
                if ____try and ____hasReturned then
                    return ____returnValue
                end
            end
            return false
        end
        if trySpawn(nil, "light_omni") then
            return
        end
        if trySpawn(nil, "light_omni2") then
            return
        end
    end
    spawnOmni(
        nil,
        "arcpit_light_neutral",
        Vector(layout.neutral.center.x, layout.neutral.center.y, layout.neutral.center.z)
    )
    for ____, a in ipairs(layout.arenas) do
        spawnOmni(
            nil,
            "arcpit_light_arena_" .. tostring(a.id),
            Vector(a.center.x, a.center.y, a.center.z)
        )
    end
end
return ____exports
