// Deterministic maze generation for the paper maze game.
//
// Uses a recursive backtracker seeded by a mulberry32 PRNG so a given
// (width, height, seed) always produces the exact same maze. That's what
// lets every player race the same "daily" maze no matter when they load
// the page — the server hashes the UTC date into the seed and the
// generator replays identically.

export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;

export type Maze = {
  width: number;
  height: number;
  // One cell per grid position, flattened as y * width + x.
  // Each value is a bitmask of which walls are still standing — a fresh
  // maze starts at (N | E | S | W) for every cell and the generator knocks
  // walls down as it carves the path.
  walls: number[];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

// Mulberry32 — tiny deterministic PRNG, good enough for maze carving.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// FNV-1a 32-bit. Used to turn a date string like "2026-04-11" into a
// uniformly-distributed seed without needing a crypto import.
export function hashStringToSeed(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Direction = {
  dx: number;
  dy: number;
  wall: number;
  opposite: number;
};

const DIRECTIONS: Direction[] = [
  { dx: 0, dy: -1, wall: N, opposite: S },
  { dx: 1, dy: 0, wall: E, opposite: W },
  { dx: 0, dy: 1, wall: S, opposite: N },
  { dx: -1, dy: 0, wall: W, opposite: E }
];

export function generateMaze(width: number, height: number, seed: number): Maze {
  if (width < 2 || height < 2) {
    throw new Error("Maze must be at least 2x2");
  }

  const cellCount = width * height;
  const walls = new Array<number>(cellCount).fill(N | E | S | W);
  const visited = new Array<boolean>(cellCount).fill(false);
  const rng = mulberry32(seed);

  const idx = (x: number, y: number) => y * width + x;

  // Iterative DFS to avoid blowing the stack on very large mazes.
  const stack: Array<[number, number]> = [[0, 0]];
  visited[idx(0, 0)] = true;

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    const candidates: Direction[] = [];
    for (const dir of DIRECTIONS) {
      const nx = cx + dir.dx;
      const ny = cy + dir.dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[idx(nx, ny)]) {
        candidates.push(dir);
      }
    }

    if (candidates.length === 0) {
      stack.pop();
      continue;
    }

    const dir = candidates[Math.floor(rng() * candidates.length)];
    walls[idx(cx, cy)] &= ~dir.wall;
    walls[idx(cx + dir.dx, cy + dir.dy)] &= ~dir.opposite;
    visited[idx(cx + dir.dx, cy + dir.dy)] = true;
    stack.push([cx + dir.dx, cy + dir.dy]);
  }

  return {
    width,
    height,
    walls,
    startX: 0,
    startY: 0,
    endX: width - 1,
    endY: height - 1
  };
}

// Return true iff `from` and `to` are orthogonally adjacent AND the wall
// between them is open. Used by both the client path builder and the
// server-side run validator so the two can never disagree.
export function canMove(
  maze: Pick<Maze, "width" | "walls">,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): boolean {
  const dx = toX - fromX;
  const dy = toY - fromY;
  if (Math.abs(dx) + Math.abs(dy) !== 1) return false;

  const fromCell = maze.walls[fromY * maze.width + fromX];
  if (fromCell === undefined) return false;

  if (dx === 1) return (fromCell & E) === 0;
  if (dx === -1) return (fromCell & W) === 0;
  if (dy === 1) return (fromCell & S) === 0;
  return (fromCell & N) === 0;
}

// Layout is persisted to D1 as a compact JSON string so we never have to
// reason about bit-packing across the wire. We only store the carved
// grid itself — start/end live in their own columns on the mazes table.
export type StoredLayout = {
  width: number;
  height: number;
  walls: number[];
};

export function serializeLayout(maze: Maze): string {
  const stored: StoredLayout = {
    width: maze.width,
    height: maze.height,
    walls: maze.walls
  };
  return JSON.stringify(stored);
}

export function parseLayout(raw: string): StoredLayout {
  return JSON.parse(raw) as StoredLayout;
}
