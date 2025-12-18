// arena-layout.ts
// Все размеры в "тайлах" по 128 world units (tileSize).
// Нейтральная зона в центре, арены (1..8) вокруг неё в сетке 4×2.
function v3(x, y, z) {
    return { x, y, z };
}
function v2(x, y) {
    return { x, y };
}
function rect(mins, maxs) {
    return { mins, maxs };
}
function tileRect(mins, maxs) {
    return { mins, maxs };
}
function containsRect2D(r, p) {
    return p.x >= r.mins.x && p.x <= r.maxs.x && p.y >= r.mins.y && p.y <= r.maxs.y;
}
function clampToRect2D(r, p, paddingWorld) {
    const minX = r.mins.x + paddingWorld;
    const maxX = r.maxs.x - paddingWorld;
    const minY = r.mins.y + paddingWorld;
    const maxY = r.maxs.y - paddingWorld;
    const x = Math.min(maxX, Math.max(minX, p.x));
    const y = Math.min(maxY, Math.max(minY, p.y));
    return v3(x, y, p.z);
}
/**
 * Собирает layout: нейтральная зона (10×10) + 8 арен (4×2).
 *
 * Геометрия по умолчанию (в тайлах по 128):
 * - tileSize = 128
 * - arenaTileSize = 6
 * - gapBetweenArenasTiles = 17
 * - neutralTileSize = 10
 * - gapNeutralToArenaTiles = 15
 * - arenaWallExtraWorld = 32 (1/4 тайла на сторону)
 *
 * origin — МИРОВАЯ точка центра нейтральной зоны.
 */
export function buildLayout(params) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const tileSize = (_a = params === null || params === void 0 ? void 0 : params.tileSize) !== null && _a !== void 0 ? _a : 128;
    const arenaTileSize = (_b = params === null || params === void 0 ? void 0 : params.arenaTileSize) !== null && _b !== void 0 ? _b : 6;
    const arenaWallExtraWorldPerSide = (_d = (_c = params === null || params === void 0 ? void 0 : params.arenaWallExtraWorldPerSide) !== null && _c !== void 0 ? _c : params === null || params === void 0 ? void 0 : params.arenaWallExtraWorld) !== null && _d !== void 0 ? _d : 32;
    const gapBetweenArenasTiles = (_e = params === null || params === void 0 ? void 0 : params.gapBetweenArenasTiles) !== null && _e !== void 0 ? _e : 17;
    const neutralTileSize = (_f = params === null || params === void 0 ? void 0 : params.neutralTileSize) !== null && _f !== void 0 ? _f : 10;
    const gapNeutralToArenaTiles = (_g = params === null || params === void 0 ? void 0 : params.gapNeutralToArenaTiles) !== null && _g !== void 0 ? _g : 15;
    const z = (_k = (_h = params === null || params === void 0 ? void 0 : params.z) !== null && _h !== void 0 ? _h : (_j = params === null || params === void 0 ? void 0 : params.origin) === null || _j === void 0 ? void 0 : _j.z) !== null && _k !== void 0 ? _k : 0;
    const origin = (_l = params === null || params === void 0 ? void 0 : params.origin) !== null && _l !== void 0 ? _l : v3(0, 0, z);
    const spawnOffset = (_m = params === null || params === void 0 ? void 0 : params.spawnOffset) !== null && _m !== void 0 ? _m : v3(0, 0, 0);
    const arenaCenters = params === null || params === void 0 ? void 0 : params.arenaCenters;
    // нейтральная зона: bounds в world
    const neutralHalfWorld = (neutralTileSize * tileSize) / 2;
    const neutralBounds = rect(v3(origin.x - neutralHalfWorld, origin.y - neutralHalfWorld, z), v3(origin.x + neutralHalfWorld, origin.y + neutralHalfWorld, z));
    const halfArenaBaseWorld = (arenaTileSize * tileSize) / 2;
    // шаг центра арены от origin (в world). По твоим числам:
    // neutralHalfTiles(=neutral/2) + gapNeutralToArenaTiles + halfArenaTiles(=arena/2)
    // и он же == (arenaTileSize + gapBetweenArenasTiles), т.к. 10/15/6/17 подобраны ровно.
    const stepWorld = (arenaTileSize + gapBetweenArenasTiles) * tileSize;
    const stepFromNeutralWorld = (neutralTileSize / 2 + gapNeutralToArenaTiles + arenaTileSize / 2) * tileSize;
    const arenas = [];
    const byId = {};
    // Раскладка 8 арен вокруг нейтрали (3×3 без центра).
    // id (по часовой, начиная с left-top):
    // 1 LT, 2 T, 3 RT, 4 L, 5 R, 6 LB, 7 B, 8 RB
    const slots = [
        { id: 1, row: 0, col: 0, dx: -1, dy: +1 },
        { id: 2, row: 0, col: 1, dx: 0, dy: +1 },
        { id: 3, row: 0, col: 2, dx: +1, dy: +1 },
        { id: 4, row: 1, col: 0, dx: -1, dy: 0 },
        { id: 5, row: 1, col: 2, dx: +1, dy: 0 },
        { id: 6, row: 2, col: 0, dx: -1, dy: -1 },
        { id: 7, row: 2, col: 1, dx: 0, dy: -1 },
        { id: 8, row: 2, col: 2, dx: +1, dy: -1 },
    ];
    for (const s of slots) {
        const idx = s.id - 1;
        const centerFromMap = arenaCenters !== undefined ? (Array.isArray(arenaCenters) ? arenaCenters[idx] : arenaCenters[s.id]) : undefined;
        const xOffWorld = s.dx * stepWorld;
        const yOffWorld = s.dy * stepWorld;
        const center = centerFromMap
            ? v3(centerFromMap.x, centerFromMap.y, (_o = centerFromMap.z) !== null && _o !== void 0 ? _o : z)
            : v3(origin.x + xOffWorld, origin.y + yOffWorld, z);
        const baseMins = v3(center.x - halfArenaBaseWorld, center.y - halfArenaBaseWorld, z);
        const baseMaxs = v3(center.x + halfArenaBaseWorld, center.y + halfArenaBaseWorld, z);
        const baseBounds = rect(baseMins, baseMaxs);
        // bounds арены: плюс поправка на "стенки земли" (+32 world units на сторону)
        const mins = v3(baseMins.x - arenaWallExtraWorldPerSide, baseMins.y - arenaWallExtraWorldPerSide, z);
        const maxs = v3(baseMaxs.x + arenaWallExtraWorldPerSide, baseMaxs.y + arenaWallExtraWorldPerSide, z);
        const bounds = rect(mins, maxs);
        // tile-space относительно origin
        const centerTile = v2((center.x - origin.x) / tileSize, (center.y - origin.y) / tileSize);
        const halfArenaTiles = arenaTileSize / 2;
        const wallExtraTiles = arenaWallExtraWorldPerSide / tileSize; // 32/128 = 0.25
        const baseTileBounds = tileRect(v2(centerTile.x - halfArenaTiles, centerTile.y - halfArenaTiles), v2(centerTile.x + halfArenaTiles, centerTile.y + halfArenaTiles));
        const tileBounds = tileRect(v2(centerTile.x - halfArenaTiles - wallExtraTiles, centerTile.y - halfArenaTiles - wallExtraTiles), v2(centerTile.x + halfArenaTiles + wallExtraTiles, centerTile.y + halfArenaTiles + wallExtraTiles));
        const spawn = v3(center.x + spawnOffset.x, center.y + spawnOffset.y, center.z + spawnOffset.z);
        const slot = {
            id: s.id,
            row: s.row,
            col: s.col,
            centerTile,
            baseTileBounds,
            tileBounds,
            center,
            baseBounds,
            bounds,
            spawn,
            contains: (p) => containsRect2D(bounds, p),
            contains2D: (p) => containsRect2D(bounds, p),
            clamp: (p, paddingWorld = 0) => clampToRect2D(bounds, p, paddingWorld),
        };
        arenas.push(slot);
        byId[s.id] = slot;
    }
    return {
        tileSize,
        arenaTileSize,
        arenaWallExtraWorldPerSide,
        arenaWallExtraWorld: arenaWallExtraWorldPerSide,
        gapBetweenArenasTiles,
        neutralTileSize,
        gapNeutralToArenaTiles,
        origin,
        neutral: { center: origin, bounds: neutralBounds, tileSize: neutralTileSize },
        arenas,
        byId,
    };
}
