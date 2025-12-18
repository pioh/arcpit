local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 94,["6"] = 95,["7"] = 94,["8"] = 98,["9"] = 99,["10"] = 98,["11"] = 102,["12"] = 103,["13"] = 102,["14"] = 106,["15"] = 107,["16"] = 106,["17"] = 110,["18"] = 112,["19"] = 110,["20"] = 115,["21"] = 116,["22"] = 115,["23"] = 119,["24"] = 120,["25"] = 119,["26"] = 123,["27"] = 124,["28"] = 123,["29"] = 127,["30"] = 128,["31"] = 127,["32"] = 131,["33"] = 132,["34"] = 131,["35"] = 135,["36"] = 136,["37"] = 137,["38"] = 138,["39"] = 139,["40"] = 141,["41"] = 141,["42"] = 141,["43"] = 141,["44"] = 142,["45"] = 142,["46"] = 142,["47"] = 142,["48"] = 143,["49"] = 135,["61"] = 159,["62"] = 160,["63"] = 160,["64"] = 160,["66"] = 160,["67"] = 161,["68"] = 162,["69"] = 163,["72"] = 164,["73"] = 162,["74"] = 166,["75"] = 167,["76"] = 168,["77"] = 170,["78"] = 171,["79"] = 172,["80"] = 173,["81"] = 174,["82"] = 176,["83"] = 178,["84"] = 179,["85"] = 179,["86"] = 179,["87"] = 179,["88"] = 185,["89"] = 185,["90"] = 185,["91"] = 185,["92"] = 188,["93"] = 189,["94"] = 189,["95"] = 189,["96"] = 189,["97"] = 189,["98"] = 195,["99"] = 196,["100"] = 197,["101"] = 197,["102"] = 197,["103"] = 197,["104"] = 197,["105"] = 202,["106"] = 202,["107"] = 202,["108"] = 202,["109"] = 204,["110"] = 205,["111"] = 205,["112"] = 205,["113"] = 205,["114"] = 210,["115"] = 211,["116"] = 212,["117"] = 212,["118"] = 212,["119"] = 212,["120"] = 213,["121"] = 213,["122"] = 213,["123"] = 213,["124"] = 214,["125"] = 215,["126"] = 215,["127"] = 215,["128"] = 215,["130"] = 221,["131"] = 222,["132"] = 226,["133"] = 227,["134"] = 227,["135"] = 227,["136"] = 227,["137"] = 227,["138"] = 227,["139"] = 226,["140"] = 228,["141"] = 228,["142"] = 228,["143"] = 228,["144"] = 228,["145"] = 228,["146"] = 226,["147"] = 229,["148"] = 229,["149"] = 229,["150"] = 229,["151"] = 229,["152"] = 229,["153"] = 226,["154"] = 230,["155"] = 230,["156"] = 230,["157"] = 230,["158"] = 230,["159"] = 230,["160"] = 226,["161"] = 231,["162"] = 231,["163"] = 231,["164"] = 231,["165"] = 231,["166"] = 231,["167"] = 226,["168"] = 232,["169"] = 232,["170"] = 232,["171"] = 232,["172"] = 232,["173"] = 232,["174"] = 226,["175"] = 233,["176"] = 233,["177"] = 233,["178"] = 233,["179"] = 233,["180"] = 233,["181"] = 226,["182"] = 234,["183"] = 234,["184"] = 234,["185"] = 234,["186"] = 234,["187"] = 234,["188"] = 226,["189"] = 226,["190"] = 237,["191"] = 238,["192"] = 239,["193"] = 241,["194"] = 243,["195"] = 244,["196"] = 245,["197"] = 248,["198"] = 249,["199"] = 250,["200"] = 253,["201"] = 254,["202"] = 255,["203"] = 257,["204"] = 257,["205"] = 257,["206"] = 257,["207"] = 257,["208"] = 262,["209"] = 262,["210"] = 262,["211"] = 262,["212"] = 262,["213"] = 267,["214"] = 269,["215"] = 269,["216"] = 269,["217"] = 269,["218"] = 273,["219"] = 273,["220"] = 273,["221"] = 273,["222"] = 274,["223"] = 274,["224"] = 274,["225"] = 274,["226"] = 277,["227"] = 277,["228"] = 277,["229"] = 277,["230"] = 280,["231"] = 280,["232"] = 280,["233"] = 280,["234"] = 284,["235"] = 284,["236"] = 284,["237"] = 284,["238"] = 284,["239"] = 284,["240"] = 284,["241"] = 284,["242"] = 284,["243"] = 284,["244"] = 284,["245"] = 284,["246"] = 284,["247"] = 301,["248"] = 301,["249"] = 301,["251"] = 301,["252"] = 284,["253"] = 284,["254"] = 304,["255"] = 305,["257"] = 308,["258"] = 308,["259"] = 308,["260"] = 308,["261"] = 310,["262"] = 310,["263"] = 310,["264"] = 310,["265"] = 310,["266"] = 310,["267"] = 310,["268"] = 310,["269"] = 310,["270"] = 319,["271"] = 319,["272"] = 319,["273"] = 319,["274"] = 319,["275"] = 319,["276"] = 319,["277"] = 319,["278"] = 319,["279"] = 310,["280"] = 310,["281"] = 310,["282"] = 310,["283"] = 159});
local ____exports = {}
local function v3(self, x, y, z)
    return {x = x, y = y, z = z}
end
local function v2(self, x, y)
    return {x = x, y = y}
end
local function rect(self, mins, maxs)
    return {mins = mins, maxs = maxs}
end
local function tileRect(self, mins, maxs)
    return {mins = mins, maxs = maxs}
end
local function round3(self, n)
    return math.floor(n * 1000 + 0.5) / 1000
end
local function fmtV2(self, v)
    return ((("(" .. tostring(round3(nil, v.x))) .. ", ") .. tostring(round3(nil, v.y))) .. ")"
end
local function fmtV3(self, v)
    return ((((("(" .. tostring(round3(nil, v.x))) .. ", ") .. tostring(round3(nil, v.y))) .. ", ") .. tostring(round3(nil, v.z))) .. ")"
end
local function fmtRect(self, r)
    return ((("{ mins=" .. fmtV3(nil, r.mins)) .. ", maxs=") .. fmtV3(nil, r.maxs)) .. " }"
end
local function abs(self, n)
    return n < 0 and -n or n
end
local function containsRect2D(self, r, p)
    return p.x >= r.mins.x and p.x <= r.maxs.x and p.y >= r.mins.y and p.y <= r.maxs.y
end
local function clampToRect2D(self, r, p, paddingWorld)
    local minX = r.mins.x + paddingWorld
    local maxX = r.maxs.x - paddingWorld
    local minY = r.mins.y + paddingWorld
    local maxY = r.maxs.y - paddingWorld
    local x = math.min(
        maxX,
        math.max(minX, p.x)
    )
    local y = math.min(
        maxY,
        math.max(minY, p.y)
    )
    return v3(nil, x, y, p.z)
end
--- Собирает layout: нейтральная зона (10×10) + 8 арен (3×3 без центра).
-- 
-- Геометрия по умолчанию (в тайлах по 256):
-- - tileSize = 256
-- - arenaTileSize = 6
-- - gapBetweenArenasTiles = 17
-- - neutralTileSize = 10
-- - gapNeutralToArenaTiles = 15
-- - arenaWallExtraWorldPerSide = 32 (1/4 тайла на сторону)
-- 
-- origin — МИРОВАЯ точка центра нейтральной зоны.
function ____exports.buildLayout(self, params)
    local ____temp_2 = params and params.debug
    if ____temp_2 == nil then
        ____temp_2 = false
    end
    local ____debug = ____temp_2
    local logPrefix = params and params.logPrefix or "[arena-layout]"
    local function log(____, msg)
        if not ____debug then
            return
        end
        print((logPrefix .. " ") .. msg)
    end
    local unsafeZone = 4
    local tileSize = params and params.tileSize or 256
    local arenaTileSize = params and params.arenaTileSize or 6
    local arenaWallExtraWorldPerSide = params and params.arenaWallExtraWorldPerSide or params and params.arenaWallExtraWorld or 32
    local gapBetweenArenasTiles = params and params.gapBetweenArenasTiles or 17
    local neutralTileSize = params and params.neutralTileSize or 10 - unsafeZone
    local gapNeutralToArenaTiles = params and params.gapNeutralToArenaTiles or 15 + unsafeZone
    local z = params and params.z or 128
    local origin = v3(nil, 0, 0, z)
    log(nil, "=== buildLayout() start ===")
    log(
        nil,
        (((((("params: tileSize=" .. tostring(tileSize)) .. ", arenaTileSize=") .. tostring(arenaTileSize)) .. ", ") .. ((("arenaWallExtraWorldPerSide=" .. tostring(arenaWallExtraWorldPerSide)) .. " (alias arenaWallExtraWorld=") .. tostring(params and params.arenaWallExtraWorld)) .. "), ") .. ((("gapBetweenArenasTiles=" .. tostring(gapBetweenArenasTiles)) .. ", neutralTileSize=") .. tostring(neutralTileSize)) .. ", ") .. (("gapNeutralToArenaTiles=" .. tostring(gapNeutralToArenaTiles)) .. ", z=") .. tostring(z)
    )
    log(
        nil,
        "origin=" .. fmtV3(nil, origin)
    )
    local neutralHalfWorld = neutralTileSize * tileSize / 2
    local neutralBounds = rect(
        nil,
        v3(nil, origin.x - neutralHalfWorld, origin.y - neutralHalfWorld, z),
        v3(nil, origin.x + neutralHalfWorld, origin.y + neutralHalfWorld, z)
    )
    local neutralExtendedTileSize = neutralTileSize + unsafeZone * 2
    local neutralExtendedHalfWorld = neutralExtendedTileSize * tileSize / 2
    local neutralExtendedBounds = rect(
        nil,
        v3(nil, origin.x - neutralExtendedHalfWorld, origin.y - neutralExtendedHalfWorld, z),
        v3(nil, origin.x + neutralExtendedHalfWorld, origin.y + neutralExtendedHalfWorld, z)
    )
    log(
        nil,
        (("neutralHalfWorld=" .. tostring(round3(nil, neutralHalfWorld))) .. " ; neutralBounds=") .. fmtRect(nil, neutralBounds)
    )
    local halfArenaBaseWorld = arenaTileSize * tileSize / 2
    log(
        nil,
        "halfArenaBaseWorld=" .. tostring(round3(nil, halfArenaBaseWorld))
    )
    local stepWorld = (arenaTileSize + gapBetweenArenasTiles) * tileSize
    local stepFromNeutralWorld = (neutralTileSize / 2 + gapNeutralToArenaTiles + arenaTileSize / 2) * tileSize
    log(
        nil,
        "stepWorld=(arenaTileSize+gapBetweenArenasTiles)*tileSize = " .. tostring(round3(nil, stepWorld))
    )
    log(
        nil,
        "stepFromNeutralWorld=(neutral/2+gapNeutralToArena+arena/2)*tileSize = " .. tostring(round3(nil, stepFromNeutralWorld))
    )
    if abs(nil, stepFromNeutralWorld - stepWorld) > 0.01 then
        log(
            nil,
            (("WARNING: stepWorld mismatch (diff=" .. tostring(round3(nil, stepFromNeutralWorld - stepWorld))) .. "). ") .. "Похоже, gapBetweenArenasTiles и gapNeutralToArenaTiles не согласованы."
        )
    end
    local arenas = {}
    local byId = {}
    local slots = {
        {
            id = 1,
            row = 0,
            col = 0,
            dx = -1,
            dy = 1
        },
        {
            id = 2,
            row = 0,
            col = 1,
            dx = 0,
            dy = 1
        },
        {
            id = 3,
            row = 0,
            col = 2,
            dx = 1,
            dy = 1
        },
        {
            id = 4,
            row = 1,
            col = 0,
            dx = -1,
            dy = 0
        },
        {
            id = 5,
            row = 1,
            col = 2,
            dx = 1,
            dy = 0
        },
        {
            id = 6,
            row = 2,
            col = 0,
            dx = -1,
            dy = -1
        },
        {
            id = 7,
            row = 2,
            col = 1,
            dx = 0,
            dy = -1
        },
        {
            id = 8,
            row = 2,
            col = 2,
            dx = 1,
            dy = -1
        }
    }
    for ____, s in ipairs(slots) do
        local xOffWorld = s.dx * stepWorld
        local yOffWorld = s.dy * stepWorld
        local center = v3(nil, origin.x + xOffWorld, origin.y + yOffWorld, z)
        local baseMins = v3(nil, center.x - halfArenaBaseWorld, center.y - halfArenaBaseWorld, z)
        local baseMaxs = v3(nil, center.x + halfArenaBaseWorld, center.y + halfArenaBaseWorld, z)
        local baseBounds = rect(nil, baseMins, baseMaxs)
        local mins = v3(nil, baseMins.x - arenaWallExtraWorldPerSide, baseMins.y - arenaWallExtraWorldPerSide, z)
        local maxs = v3(nil, baseMaxs.x + arenaWallExtraWorldPerSide, baseMaxs.y + arenaWallExtraWorldPerSide, z)
        local bounds = rect(nil, mins, maxs)
        local centerTile = v2(nil, (center.x - origin.x) / tileSize, (center.y - origin.y) / tileSize)
        local halfArenaTiles = arenaTileSize / 2
        local wallExtraTiles = arenaWallExtraWorldPerSide / tileSize
        local baseTileBounds = tileRect(
            nil,
            v2(nil, centerTile.x - halfArenaTiles, centerTile.y - halfArenaTiles),
            v2(nil, centerTile.x + halfArenaTiles, centerTile.y + halfArenaTiles)
        )
        local tileBounds = tileRect(
            nil,
            v2(nil, centerTile.x - halfArenaTiles - wallExtraTiles, centerTile.y - halfArenaTiles - wallExtraTiles),
            v2(nil, centerTile.x + halfArenaTiles + wallExtraTiles, centerTile.y + halfArenaTiles + wallExtraTiles)
        )
        local spawn = v3(nil, center.x, center.y, center.z)
        log(
            nil,
            (((((((((("arena#" .. tostring(s.id)) .. " grid(row=") .. tostring(s.row)) .. ", col=") .. tostring(s.col)) .. ", dx=") .. tostring(s.dx)) .. ", dy=") .. tostring(s.dy)) .. ") ") .. (((((("offsetWorld=(" .. tostring(round3(nil, xOffWorld))) .. ", ") .. tostring(round3(nil, yOffWorld))) .. ") center=") .. fmtV3(nil, center)) .. " spawn=") .. fmtV3(nil, spawn)
        )
        log(
            nil,
            (((("arena#" .. tostring(s.id)) .. " baseBounds=") .. fmtRect(nil, baseBounds)) .. " bounds(+wall)=") .. fmtRect(nil, bounds)
        )
        log(
            nil,
            (((((("arena#" .. tostring(s.id)) .. " centerTile=") .. fmtV2(nil, centerTile)) .. " halfArenaTiles=") .. tostring(round3(nil, halfArenaTiles))) .. " wallExtraTiles=") .. tostring(round3(nil, wallExtraTiles))
        )
        log(
            nil,
            ((((("arena#" .. tostring(s.id)) .. " baseTileBounds={ mins=") .. fmtV2(nil, baseTileBounds.mins)) .. ", maxs=") .. fmtV2(nil, baseTileBounds.maxs)) .. " }"
        )
        log(
            nil,
            ((((("arena#" .. tostring(s.id)) .. " tileBounds(+wall)={ mins=") .. fmtV2(nil, tileBounds.mins)) .. ", maxs=") .. fmtV2(nil, tileBounds.maxs)) .. " }"
        )
        local slot = {
            id = s.id,
            row = s.row,
            col = s.col,
            centerTile = centerTile,
            baseTileBounds = baseTileBounds,
            tileBounds = tileBounds,
            center = center,
            baseBounds = baseBounds,
            bounds = bounds,
            spawn = spawn,
            contains = function(____, p) return containsRect2D(nil, bounds, p) end,
            contains2D = function(____, p) return containsRect2D(nil, bounds, p) end,
            clamp = function(____, p, paddingWorld)
                if paddingWorld == nil then
                    paddingWorld = 0
                end
                return clampToRect2D(nil, bounds, p, paddingWorld)
            end
        }
        arenas[#arenas + 1] = slot
        byId[s.id] = slot
    end
    log(
        nil,
        ((("=== buildLayout() done: arenas=" .. tostring(#arenas)) .. ", neutralBounds=") .. fmtRect(nil, neutralBounds)) .. " ==="
    )
    return {
        tileSize = tileSize,
        arenaTileSize = arenaTileSize,
        arenaWallExtraWorldPerSide = arenaWallExtraWorldPerSide,
        arenaWallExtraWorld = arenaWallExtraWorldPerSide,
        gapBetweenArenasTiles = gapBetweenArenasTiles,
        neutralTileSize = neutralTileSize,
        gapNeutralToArenaTiles = gapNeutralToArenaTiles,
        origin = origin,
        neutral = {
            center = origin,
            bounds = neutralBounds,
            extendedBounds = neutralExtendedBounds,
            tileSize = neutralTileSize,
            extendedTileSize = neutralExtendedTileSize,
            unsafeZoneTiles = unsafeZone,
            contains2D = function(____, p) return containsRect2D(nil, neutralBounds, p) end,
            containsExtended2D = function(____, p) return containsRect2D(nil, neutralExtendedBounds, p) end
        },
        arenas = arenas,
        byId = byId
    }
end
return ____exports
