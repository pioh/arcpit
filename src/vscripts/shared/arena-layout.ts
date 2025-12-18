// arena-layout.ts
// Все размеры в "тайлах" по 128 world units (tileSize).
// Нейтральная зона в центре, арены (1..8) вокруг неё в сетке 3×3 без центра.

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
  row: number; // 0..2 (как в 3×3)
  col: number; // 0..2 (как в 3×3)

  // tile-space (относительно origin, в тайлах)
  centerTile: Vec2;
  baseTileBounds: TileRect; // чистые 6×6 (без +wall)
  tileBounds: TileRect; // 6×6 + "стенка" (wallExtra)

  // world-space
  center: Vec3;
  baseBounds: Rect; // чистые 6×6
  bounds: Rect; // baseBounds расширенный на wallExtra

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
    /** Внутренняя безопасная зона (safe). */
    bounds: Rect;
    /** Внешняя зона нейтрали, включая unsafeZone-рамку вокруг safe (опасная кайма). */
    extendedBounds: Rect;
    /** Размер safe зоны в тайлах. */
    tileSize: number;
    /** Размер extended зоны в тайлах (safe + unsafeZone*2). */
    extendedTileSize: number;
    /** Ширина unsafe зоны (в тайлах) по периметру safe. */
    unsafeZoneTiles: number;
    contains2D: (p: Vec3) => boolean;
    containsExtended2D: (p: Vec3) => boolean;
  };

  arenas: ArenaSlot[];
  byId: Record<number, ArenaSlot>;
};

export type BuildLayoutParams = Partial<{
  tileSize: number;
  arenaTileSize: number;
  /** Доп. стенка в КАЖДУЮ сторону (world units). */
  arenaWallExtraWorldPerSide: number;
  arenaWallExtraWorld: number;
  gapBetweenArenasTiles: number;
  neutralTileSize: number;
  gapNeutralToArenaTiles: number;
  z: number;
  /** Подробные логи расчётов (для отладки крашей/проверки координат). */
  debug: boolean;
  /** Префикс для строк print(). */
  logPrefix: string;
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

function round3(n: number): number {
  // В vscripts нет гарантий для Number.toFixed(), поэтому округляем вручную через math.
  return math.floor(n * 1000 + 0.5) / 1000;
}

function fmtV2(v: Vec2): string {
  return `(${round3(v.x)}, ${round3(v.y)})`;
}

function fmtV3(v: Vec3): string {
  return `(${round3(v.x)}, ${round3(v.y)}, ${round3(v.z)})`;
}

function fmtRect(r: Rect): string {
  return `{ mins=${fmtV3(r.mins)}, maxs=${fmtV3(r.maxs)} }`;
}

function abs(n: number): number {
  return n < 0 ? -n : n;
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
 * Собирает layout: нейтральная зона (10×10) + 8 арен (3×3 без центра).
 *
 * Геометрия по умолчанию (в тайлах по 256):
 * - tileSize = 256
 * - arenaTileSize = 6
 * - gapBetweenArenasTiles = 17
 * - neutralTileSize = 10
 * - gapNeutralToArenaTiles = 15
 * - arenaWallExtraWorldPerSide = 32 (1/4 тайла на сторону)
 *
 * origin — МИРОВАЯ точка центра нейтральной зоны.
 */
export function buildLayout(params?: BuildLayoutParams): Layout {
  const debug = params?.debug ?? false;
  const logPrefix = params?.logPrefix ?? "[arena-layout]";
  const log = (msg: string) => {
    if (!debug) return;
    print(`${logPrefix} ${msg}`);
  };
  const unsafeZone = 4;
  const tileSize = params?.tileSize ?? 256;
  const arenaTileSize = params?.arenaTileSize ?? 6;
  // поддерживаем deprecated алиас (arenaWallExtraWorld) если perSide не задан
  const arenaWallExtraWorldPerSide = params?.arenaWallExtraWorldPerSide ?? params?.arenaWallExtraWorld ?? 32;
  const gapBetweenArenasTiles = params?.gapBetweenArenasTiles ?? 17;
  const neutralTileSize = params?.neutralTileSize ?? 10 - unsafeZone;
  const gapNeutralToArenaTiles = params?.gapNeutralToArenaTiles ?? 15 + unsafeZone;
  const z = params?.z  ?? 128;

  const origin = v3(0, 0, z);

  log("=== buildLayout() start ===");
  log(
    `params: tileSize=${tileSize}, arenaTileSize=${arenaTileSize}, ` +
      `arenaWallExtraWorldPerSide=${arenaWallExtraWorldPerSide} (alias arenaWallExtraWorld=${params?.arenaWallExtraWorld}), ` +
      `gapBetweenArenasTiles=${gapBetweenArenasTiles}, neutralTileSize=${neutralTileSize}, ` +
      `gapNeutralToArenaTiles=${gapNeutralToArenaTiles}, z=${z}`,
  );
  log(`origin=${fmtV3(origin)}`);

  // нейтральная зона: bounds в world
  const neutralHalfWorld = (neutralTileSize * tileSize) / 2;
  const neutralBounds = rect(
    v3(origin.x - neutralHalfWorld, origin.y - neutralHalfWorld, z),
    v3(origin.x + neutralHalfWorld, origin.y + neutralHalfWorld, z),
  );

  // extended нейтралка = safe + unsafeZone тайлов с каждой стороны
  const neutralExtendedTileSize = neutralTileSize + unsafeZone * 2;
  const neutralExtendedHalfWorld = (neutralExtendedTileSize * tileSize) / 2;
  const neutralExtendedBounds = rect(
    v3(origin.x - neutralExtendedHalfWorld, origin.y - neutralExtendedHalfWorld, z),
    v3(origin.x + neutralExtendedHalfWorld, origin.y + neutralExtendedHalfWorld, z),
  );

  log(`neutralHalfWorld=${round3(neutralHalfWorld)} ; neutralBounds=${fmtRect(neutralBounds)}`);

  const halfArenaBaseWorld = (arenaTileSize * tileSize) / 2;
  log(`halfArenaBaseWorld=${round3(halfArenaBaseWorld)}`);

  // шаг между центрами арен = (arena + gap) * tileSize
  // Для твоих чисел он же равен расстоянию от центра нейтрали до центра ближайшей арены:
  // (neutral/2 + gapNeutralToArena + arena/2) * tileSize = (5 + 15 + 3)*128 = 23*128
  const stepWorld = (arenaTileSize + gapBetweenArenasTiles) * tileSize;
  const stepFromNeutralWorld = (neutralTileSize / 2 + gapNeutralToArenaTiles + arenaTileSize / 2) * tileSize;
  log(`stepWorld=(arenaTileSize+gapBetweenArenasTiles)*tileSize = ${round3(stepWorld)}`);
  log(`stepFromNeutralWorld=(neutral/2+gapNeutralToArena+arena/2)*tileSize = ${round3(stepFromNeutralWorld)}`);
  if (abs(stepFromNeutralWorld - stepWorld) > 0.01) {
    log(
      `WARNING: stepWorld mismatch (diff=${round3(stepFromNeutralWorld - stepWorld)}). ` +
        `Похоже, gapBetweenArenasTiles и gapNeutralToArenaTiles не согласованы.`,
    );
  }

  const arenas: ArenaSlot[] = [];
  const byId: Record<number, ArenaSlot> = {};

  // id (по часовой, начиная с left-top):
  // 1 LT, 2 T, 3 RT, 4 L, 5 R, 6 LB, 7 B, 8 RB
  const slots: Array<{ id: number; row: number; col: number; dx: number; dy: number }> = [
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
    const xOffWorld = s.dx * stepWorld;
    const yOffWorld = s.dy * stepWorld;

    const center = v3(origin.x + xOffWorld, origin.y + yOffWorld, z);

    const baseMins = v3(center.x - halfArenaBaseWorld, center.y - halfArenaBaseWorld, z);
    const baseMaxs = v3(center.x + halfArenaBaseWorld, center.y + halfArenaBaseWorld, z);
    const baseBounds = rect(baseMins, baseMaxs);

    // bounds арены: плюс поправка на "стенки земли"
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

    const spawn = v3(center.x, center.y, center.z);

    log(
      `arena#${s.id} grid(row=${s.row}, col=${s.col}, dx=${s.dx}, dy=${s.dy}) ` +
        `offsetWorld=(${round3(xOffWorld)}, ${round3(yOffWorld)}) center=${fmtV3(center)} spawn=${fmtV3(spawn)}`,
    );
    log(`arena#${s.id} baseBounds=${fmtRect(baseBounds)} bounds(+wall)=${fmtRect(bounds)}`);
    log(
      `arena#${s.id} centerTile=${fmtV2(centerTile)} halfArenaTiles=${round3(halfArenaTiles)} wallExtraTiles=${round3(wallExtraTiles)}`,
    );
    log(
      `arena#${s.id} baseTileBounds={ mins=${fmtV2(baseTileBounds.mins)}, maxs=${fmtV2(baseTileBounds.maxs)} }`,
    );
    log(
      `arena#${s.id} tileBounds(+wall)={ mins=${fmtV2(tileBounds.mins)}, maxs=${fmtV2(tileBounds.maxs)} }`,
    );

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

  log(`=== buildLayout() done: arenas=${arenas.length}, neutralBounds=${fmtRect(neutralBounds)} ===`);

  return {
    tileSize,
    arenaTileSize,
    arenaWallExtraWorldPerSide,
    arenaWallExtraWorld: arenaWallExtraWorldPerSide,
    gapBetweenArenasTiles,
    neutralTileSize,
    gapNeutralToArenaTiles,
    origin,
    neutral: {
      center: origin,
      bounds: neutralBounds,
      extendedBounds: neutralExtendedBounds,
      tileSize: neutralTileSize,
      extendedTileSize: neutralExtendedTileSize,
      unsafeZoneTiles: unsafeZone,
      contains2D: (p) => containsRect2D(neutralBounds, p),
      containsExtended2D: (p) => containsRect2D(neutralExtendedBounds, p),
    },
    arenas,
    byId,
  };
}



