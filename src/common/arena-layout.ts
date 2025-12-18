// arena-layout.ts
// Все размеры в "тайлах" по 128 world units (tileSize).
// Нейтральная зона в центре, арены (1..8) вокруг неё в сетке 4×2.

export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };

export type Rect = {
  mins: Vec3; // world space
  maxs: Vec3; // world space
};

export type TileRect = {
  mins: Vec2; // tile space (relative to origin center)
  maxs: Vec2; // tile space (relative to origin center)
};

export type ArenaSlot = {
  id: number; // 1..8
  row: number; // 0..rows-1
  col: number; // 0..cols-1

  // tile-space (относительно origin, в тайлах)
  centerTile: Vec2;
  baseTileBounds: TileRect; // чистые 6×6 (без +32)
  tileBounds: TileRect; // 6×6 + "стенка" (+32 world => +0.25 tile на сторону)

  // world-space
  center: Vec3;
  baseBounds: Rect; // чистые 6×6
  bounds: Rect; // baseBounds расширенный на arenaWallExtraWorld с каждой стороны

  // suggested point for teleport/spawn inside the arena
  spawn: Vec3;

  // helpers
  contains: (p: Vec3) => boolean;
  contains2D: (p: Vec3) => boolean;
  clamp: (p: Vec3, paddingWorld?: number) => Vec3;
};

export type Layout = {
  tileSize: number; // 128
  arenaTileSize: number; // 6
  /**
   * Доп. “стенка земли” В КАЖДУЮ СТОРОНУ арены (world units).
   * Если у тебя “+32 к размеру” (на весь размер), то это 16 на сторону.
   */
  arenaWallExtraWorldPerSide: number;
  /** @deprecated алиас */
  arenaWallExtraWorld: number;
  gapBetweenArenasTiles: number; // 17

  neutralTileSize: number; // 10
  gapNeutralToArenaTiles: number; // 15

  origin: Vec3; // world origin of layout (center of neutral zone)
  neutral: {
    center: Vec3;
    bounds: Rect;
    tileSize: number;
  };

  arenas: ArenaSlot[];
  byId: Record<number, ArenaSlot>;
};

export type BuildLayoutParams = Partial<{
  tileSize: number;
  arenaTileSize: number;
  /** Доп. стенка в КАЖДУЮ сторону (world units). */
  arenaWallExtraWorldPerSide: number;
  /** @deprecated алиас, если уже использовал */
  arenaWallExtraWorld: number;
  gapBetweenArenasTiles: number;
  neutralTileSize: number;
  gapNeutralToArenaTiles: number;
  origin: Vec3;
  z: number;
  // spawn offset relative to center (world units)
  spawnOffset: Vec3;
  /**
   * Если арены уже расставлены в редакторе — передай реальные центры.
   * - Record: ключи 1..8
   * - Array: индекс 0 => id=1, индекс 7 => id=8
   *
   * Если не задано — позиции считаются по формуле (4×2 вокруг нейтрали).
   */
  arenaCenters: Record<number, Vec3> | Vec3[];
}>;

function v3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

function v2(x: number, y: number): Vec2 {
  return { x, y };
}

function rect(mins: Vec3, maxs: Vec3): Rect {
  return { mins, maxs };
}

function tileRect(mins: Vec2, maxs: Vec2): TileRect {
  return { mins, maxs };
}

function containsRect2D(r: Rect, p: Vec3): boolean {
  return p.x >= r.mins.x && p.x <= r.maxs.x && p.y >= r.mins.y && p.y <= r.maxs.y;
}

function clampToRect2D(r: Rect, p: Vec3, paddingWorld: number): Vec3 {
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
export function buildLayout(params?: BuildLayoutParams): Layout {
  const tileSize = params?.tileSize ?? 128;
  const arenaTileSize = params?.arenaTileSize ?? 6;
  const arenaWallExtraWorldPerSide = params?.arenaWallExtraWorldPerSide ?? params?.arenaWallExtraWorld ?? 32;
  const gapBetweenArenasTiles = params?.gapBetweenArenasTiles ?? 17;
  const neutralTileSize = params?.neutralTileSize ?? 10;
  const gapNeutralToArenaTiles = params?.gapNeutralToArenaTiles ?? 15;
  const z = params?.z ?? params?.origin?.z ?? 0;

  const origin = params?.origin ?? v3(0, 0, z);
  const spawnOffset = params?.spawnOffset ?? v3(0, 0, 0);
  const arenaCenters = params?.arenaCenters;

  // нейтральная зона: bounds в world
  const neutralHalfWorld = (neutralTileSize * tileSize) / 2;
  const neutralBounds = rect(
    v3(origin.x - neutralHalfWorld, origin.y - neutralHalfWorld, z),
    v3(origin.x + neutralHalfWorld, origin.y + neutralHalfWorld, z),
  );

  const halfArenaBaseWorld = (arenaTileSize * tileSize) / 2;

  // шаг центра арены от origin (в world). По твоим числам:
  // neutralHalfTiles(=neutral/2) + gapNeutralToArenaTiles + halfArenaTiles(=arena/2)
  // и он же == (arenaTileSize + gapBetweenArenasTiles), т.к. 10/15/6/17 подобраны ровно.
  const stepWorld = (arenaTileSize + gapBetweenArenasTiles) * tileSize;
  const stepFromNeutralWorld = (neutralTileSize / 2 + gapNeutralToArenaTiles + arenaTileSize / 2) * tileSize;

  const arenas: ArenaSlot[] = [];
  const byId: Record<number, ArenaSlot> = {};

  // Раскладка 8 арен вокруг нейтрали (3×3 без центра).
  // id (по часовой, начиная с left-top):
  // 1 LT, 2 T, 3 RT, 4 L, 5 R, 6 LB, 7 B, 8 RB
  const slots: Array<{ id: number; row: number; col: number; dx: number; dy: number }> = [
    { id: 1, row: 0, col: 0, dx: -1, dy: +1 },
    { id: 2, row: 0, col: 1, dx:  0, dy: +1 },
    { id: 3, row: 0, col: 2, dx: +1, dy: +1 },
    { id: 4, row: 1, col: 0, dx: -1, dy:  0 },
    { id: 5, row: 1, col: 2, dx: +1, dy:  0 },
    { id: 6, row: 2, col: 0, dx: -1, dy: -1 },
    { id: 7, row: 2, col: 1, dx:  0, dy: -1 },
    { id: 8, row: 2, col: 2, dx: +1, dy: -1 },
  ];

  for (const s of slots) {
    const idx = s.id - 1;
    const centerFromMap =
      arenaCenters !== undefined ? (Array.isArray(arenaCenters) ? arenaCenters[idx] : arenaCenters[s.id]) : undefined;

    const xOffWorld = s.dx * stepWorld;
    const yOffWorld = s.dy * stepWorld;

    const center = centerFromMap
      ? v3(centerFromMap.x, centerFromMap.y, (centerFromMap as any).z ?? z)
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

    const baseTileBounds = tileRect(
      v2(centerTile.x - halfArenaTiles, centerTile.y - halfArenaTiles),
      v2(centerTile.x + halfArenaTiles, centerTile.y + halfArenaTiles),
    );

    const tileBounds = tileRect(
      v2(centerTile.x - halfArenaTiles - wallExtraTiles, centerTile.y - halfArenaTiles - wallExtraTiles),
      v2(centerTile.x + halfArenaTiles + wallExtraTiles, centerTile.y + halfArenaTiles + wallExtraTiles),
    );

    const spawn = v3(center.x + spawnOffset.x, center.y + spawnOffset.y, center.z + spawnOffset.z);

    const slot: ArenaSlot = {
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


