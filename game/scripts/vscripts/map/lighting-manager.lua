local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 1,["12"] = 9,["13"] = 9,["14"] = 9,["16"] = 10,["17"] = 9,["18"] = 12,["19"] = 13,["22"] = 14,["23"] = 16,["24"] = 18,["25"] = 20,["26"] = 21,["29"] = 24,["30"] = 27,["31"] = 27,["32"] = 27,["33"] = 27,["34"] = 27,["35"] = 27,["36"] = 27,["37"] = 27,["38"] = 27,["39"] = 27,["40"] = 27,["41"] = 40,["44"] = 42,["45"] = 43,["48"] = 44,["51"] = 45,["55"] = 41,["58"] = 48,["59"] = 40,["60"] = 51,["63"] = 52,["66"] = 18,["67"] = 56,["68"] = 56,["69"] = 56,["70"] = 56,["71"] = 56,["72"] = 59,["73"] = 60,["74"] = 60,["75"] = 60,["76"] = 60,["77"] = 60,["79"] = 12});
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
