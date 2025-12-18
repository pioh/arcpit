local ____lualib = require("lualib_bundle")
local __TS__Class = ____lualib.__TS__Class
local Map = ____lualib.Map
local __TS__ArraySort = ____lualib.__TS__ArraySort
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["9"] = 6,["10"] = 6,["11"] = 6,["12"] = 12,["13"] = 12,["14"] = 7,["15"] = 8,["16"] = 9,["17"] = 11,["18"] = 18,["19"] = 19,["20"] = 20,["22"] = 23,["23"] = 25,["24"] = 28,["25"] = 29,["26"] = 30,["28"] = 32,["29"] = 33,["31"] = 36,["32"] = 18,["33"] = 43,["34"] = 44,["35"] = 44,["37"] = 47,["38"] = 48,["39"] = 43,["40"] = 58,["41"] = 59,["42"] = 59,["44"] = 61,["45"] = 62,["46"] = 64,["47"] = 65,["48"] = 66,["49"] = 66,["50"] = 66,["51"] = 67,["52"] = 67,["53"] = 66,["54"] = 68,["55"] = 68,["56"] = 68,["57"] = 64,["59"] = 72,["60"] = 72,["62"] = 73,["63"] = 74,["64"] = 74,["66"] = 75,["67"] = 76,["68"] = 77,["71"] = 72,["74"] = 80,["75"] = 81,["76"] = 82,["78"] = 85,["79"] = 86,["80"] = 87,["81"] = 58,["82"] = 93,["83"] = 93,["84"] = 93,["86"] = 94,["87"] = 96,["89"] = 97,["90"] = 97,["92"] = 98,["93"] = 98,["95"] = 99,["98"] = 97,["101"] = 101,["102"] = 101,["103"] = 101,["104"] = 101,["105"] = 103,["107"] = 104,["108"] = 104,["110"] = 105,["111"] = 106,["112"] = 107,["113"] = 107,["115"] = 109,["116"] = 110,["117"] = 111,["118"] = 112,["119"] = 114,["120"] = 115,["121"] = 116,["124"] = 104,["127"] = 93,["128"] = 123,["129"] = 124,["131"] = 126,["132"] = 126,["134"] = 127,["135"] = 127,["137"] = 129,["138"] = 130,["139"] = 131,["140"] = 132,["141"] = 133,["142"] = 134,["144"] = 136,["148"] = 126,["151"] = 123});
local ____exports = {}
--- Управление точками спавна
____exports.SpawnManager = __TS__Class()
local SpawnManager = ____exports.SpawnManager
SpawnManager.name = "SpawnManager"
function SpawnManager.prototype.____constructor(self, peaceMode)
    self.peaceMode = peaceMode
    self.cachedSpawnLocation = nil
    self.cachedNeutralCenter = nil
    self.cachedArenaCenters = nil
end
function SpawnManager.prototype.getSpawnLocation(self)
    if self.cachedSpawnLocation then
        return self.cachedSpawnLocation
    end
    local spawnPoint = Entities:FindByClassname(nil, "info_player_start_dota")
    if spawnPoint then
        local o = spawnPoint:GetAbsOrigin()
        self.cachedSpawnLocation = Vector(o.x, o.y, o.z)
        print((((("Spawn location found: " .. tostring(self.cachedSpawnLocation.x)) .. ", ") .. tostring(self.cachedSpawnLocation.y)) .. ", ") .. tostring(self.cachedSpawnLocation.z))
    else
        self.cachedSpawnLocation = Vector(0, 0, 128)
        print("Warning: No spawn point found, using default location")
    end
    return self.cachedSpawnLocation
end
function SpawnManager.prototype.getNeutralCenter(self)
    if self.cachedNeutralCenter then
        return self.cachedNeutralCenter
    end
    self.cachedNeutralCenter = Vector(0, 0, 128)
    return self.cachedNeutralCenter
end
function SpawnManager.prototype.getArenaCenters(self)
    if self.cachedArenaCenters then
        return self.cachedArenaCenters
    end
    local centers = {}
    local found = 0
    local function findArenaMarker(____, id)
        return Entities:FindByName(
            nil,
            "arcpit_arena_" .. tostring(id)
        ) or Entities:FindByName(
            nil,
            ("arena_" .. tostring(id)) .. "_center"
        ) or Entities:FindByName(
            nil,
            ("arena" .. tostring(id)) .. "_center"
        )
    end
    do
        local id = 1
        while id <= 8 do
            do
                local ent = findArenaMarker(nil, id)
                if not ent then
                    goto __continue13
                end
                local o = ent:GetAbsOrigin()
                centers[id] = Vector(o.x, o.y, o.z)
                found = found + 1
            end
            ::__continue13::
            id = id + 1
        end
    end
    if found <= 0 then
        self.cachedArenaCenters = nil
        return nil
    end
    print(("Arena centers loaded from map markers: " .. tostring(found)) .. "/8")
    self.cachedArenaCenters = centers
    return self.cachedArenaCenters
end
function SpawnManager.prototype.scatterHeroesInNeutral(self, playerHeroes, radius)
    if radius == nil then
        radius = 520
    end
    local center = self:getNeutralCenter()
    local ids = {}
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue18
                end
                ids[#ids + 1] = i
            end
            ::__continue18::
            i = i + 1
        end
    end
    __TS__ArraySort(
        ids,
        function(____, a, b) return a - b end
    )
    local n = math.max(1, #ids)
    do
        local idx = 0
        while idx < #ids do
            do
                local pid = ids[idx + 1]
                local hero = playerHeroes:get(pid)
                if not hero or not IsValidEntity(hero) then
                    goto __continue22
                end
                local angle = 2 * math.pi * idx / n
                local x = center.x + radius * math.cos(angle)
                local y = center.y + radius * math.sin(angle)
                local pos = Vector(x, y, center.z)
                hero:SetAbsOrigin(pos)
                FindClearSpaceForUnit(hero, pos, true)
                self.peaceMode:applyToHero(hero)
            end
            ::__continue22::
            idx = idx + 1
        end
    end
end
function SpawnManager.prototype.moveAllHeroesToSpawn(self, playerHeroes)
    local spawnLocation = self:getSpawnLocation()
    do
        local i = 0
        while i < 64 do
            do
                if not PlayerResource:IsValidPlayerID(i) then
                    goto __continue26
                end
                local hero = playerHeroes:get(i)
                if hero and IsValidEntity(hero) then
                    hero:SetAbsOrigin(spawnLocation)
                    FindClearSpaceForUnit(hero, spawnLocation, true)
                    self.peaceMode:applyToHero(hero)
                    print(("Player " .. tostring(i)) .. " hero moved to spawn point")
                else
                    print("✗ Hero not found for player " .. tostring(i))
                end
            end
            ::__continue26::
            i = i + 1
        end
    end
end
return ____exports
