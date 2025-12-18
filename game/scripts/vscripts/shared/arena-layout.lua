local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 84,["6"] = 85,["7"] = 84,["8"] = 88,["9"] = 89,["10"] = 88,["11"] = 92,["12"] = 93,["13"] = 92,["14"] = 96,["15"] = 97,["16"] = 96,["17"] = 100,["18"] = 102,["19"] = 100,["20"] = 105,["21"] = 106,["22"] = 105,["23"] = 109,["24"] = 110,["25"] = 109,["26"] = 113,["27"] = 114,["28"] = 113,["29"] = 117,["30"] = 118,["31"] = 117,["32"] = 121,["33"] = 122,["34"] = 121,["35"] = 125,["36"] = 126,["37"] = 127,["38"] = 128,["39"] = 129,["40"] = 131,["41"] = 131,["42"] = 131,["43"] = 131,["44"] = 132,["45"] = 132,["46"] = 132,["47"] = 132,["48"] = 133,["49"] = 125,["61"] = 149,["62"] = 150,["63"] = 150,["64"] = 150,["66"] = 150,["67"] = 151,["68"] = 152,["69"] = 153,["72"] = 154,["73"] = 152,["74"] = 157,["75"] = 158,["76"] = 160,["77"] = 161,["78"] = 162,["79"] = 163,["80"] = 164,["81"] = 166,["82"] = 168,["83"] = 169,["84"] = 169,["85"] = 169,["86"] = 169,["87"] = 175,["88"] = 175,["89"] = 175,["90"] = 175,["91"] = 178,["92"] = 179,["93"] = 179,["94"] = 179,["95"] = 179,["96"] = 179,["97"] = 184,["98"] = 184,["99"] = 184,["100"] = 184,["101"] = 186,["102"] = 187,["103"] = 187,["104"] = 187,["105"] = 187,["106"] = 192,["107"] = 193,["108"] = 194,["109"] = 194,["110"] = 194,["111"] = 194,["112"] = 195,["113"] = 195,["114"] = 195,["115"] = 195,["116"] = 196,["117"] = 197,["118"] = 197,["119"] = 197,["120"] = 197,["122"] = 203,["123"] = 204,["124"] = 208,["125"] = 209,["126"] = 209,["127"] = 209,["128"] = 209,["129"] = 209,["130"] = 209,["131"] = 208,["132"] = 210,["133"] = 210,["134"] = 210,["135"] = 210,["136"] = 210,["137"] = 210,["138"] = 208,["139"] = 211,["140"] = 211,["141"] = 211,["142"] = 211,["143"] = 211,["144"] = 211,["145"] = 208,["146"] = 212,["147"] = 212,["148"] = 212,["149"] = 212,["150"] = 212,["151"] = 212,["152"] = 208,["153"] = 213,["154"] = 213,["155"] = 213,["156"] = 213,["157"] = 213,["158"] = 213,["159"] = 208,["160"] = 214,["161"] = 214,["162"] = 214,["163"] = 214,["164"] = 214,["165"] = 214,["166"] = 208,["167"] = 215,["168"] = 215,["169"] = 215,["170"] = 215,["171"] = 215,["172"] = 215,["173"] = 208,["174"] = 216,["175"] = 216,["176"] = 216,["177"] = 216,["178"] = 216,["179"] = 216,["180"] = 208,["181"] = 208,["182"] = 219,["183"] = 220,["184"] = 221,["185"] = 223,["186"] = 225,["187"] = 226,["188"] = 227,["189"] = 230,["190"] = 231,["191"] = 232,["192"] = 235,["193"] = 236,["194"] = 237,["195"] = 239,["196"] = 239,["197"] = 239,["198"] = 239,["199"] = 239,["200"] = 244,["201"] = 244,["202"] = 244,["203"] = 244,["204"] = 244,["205"] = 249,["206"] = 251,["207"] = 251,["208"] = 251,["209"] = 251,["210"] = 255,["211"] = 255,["212"] = 255,["213"] = 255,["214"] = 256,["215"] = 256,["216"] = 256,["217"] = 256,["218"] = 259,["219"] = 259,["220"] = 259,["221"] = 259,["222"] = 262,["223"] = 262,["224"] = 262,["225"] = 262,["226"] = 266,["227"] = 266,["228"] = 266,["229"] = 266,["230"] = 266,["231"] = 266,["232"] = 266,["233"] = 266,["234"] = 266,["235"] = 266,["236"] = 266,["237"] = 266,["238"] = 266,["239"] = 283,["240"] = 283,["241"] = 283,["243"] = 283,["244"] = 266,["245"] = 266,["246"] = 286,["247"] = 287,["249"] = 290,["250"] = 290,["251"] = 290,["252"] = 290,["253"] = 292,["254"] = 292,["255"] = 292,["256"] = 292,["257"] = 292,["258"] = 292,["259"] = 292,["260"] = 292,["261"] = 292,["262"] = 292,["263"] = 292,["264"] = 292,["265"] = 292,["266"] = 149});
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
    local tileSize = params and params.tileSize or 256
    local arenaTileSize = params and params.arenaTileSize or 6
    local arenaWallExtraWorldPerSide = params and params.arenaWallExtraWorldPerSide or params and params.arenaWallExtraWorld or 32
    local gapBetweenArenasTiles = params and params.gapBetweenArenasTiles or 17
    local neutralTileSize = params and params.neutralTileSize or 10
    local gapNeutralToArenaTiles = params and params.gapNeutralToArenaTiles or 15
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
        neutral = {center = origin, bounds = neutralBounds, tileSize = neutralTileSize},
        arenas = arenas,
        byId = byId
    }
end
return ____exports
