// Akari (Light Up) puzzle generator, solver, and verifier.
//
// Grid encoding: one char per cell, row-major (y * width + x).
//   '.' = empty white cell
//   '#' = wall (no number clue)
//   '0'-'4' = numbered wall (exactly N adjacent bulbs required)

const UNKNOWN = 0;
const BULB = 1;
const NO_BULB = 2;

// ---------------------------------------------------------------------------
// PRNG — same mulberry32 + FNV-1a used by the other kcodes games
// ---------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

export function hashStringToSeed(s: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// ---------------------------------------------------------------------------
// Grid helpers
// ---------------------------------------------------------------------------

function isWall(ch: string): boolean {
  return ch === "#" || (ch >= "0" && ch <= "4");
}

function wallNumber(ch: string): number | null {
  if (ch >= "0" && ch <= "4") return ch.charCodeAt(0) - 48;
  return null;
}

type Grid = { width: number; height: number; cells: string };

function idx(g: Grid, x: number, y: number): number {
  return y * g.width + x;
}

function coordsOf(g: Grid, i: number): [number, number] {
  return [i % g.width, (i / g.width) | 0];
}

const DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

function visibleFrom(g: Grid, x: number, y: number): number[] {
  const result: number[] = [];
  for (const [dx, dy] of DIRS) {
    let cx = x + dx,
      cy = y + dy;
    while (cx >= 0 && cx < g.width && cy >= 0 && cy < g.height) {
      const ci = idx(g, cx, cy);
      if (isWall(g.cells[ci])) break;
      result.push(ci);
      cx += dx;
      cy += dy;
    }
  }
  return result;
}

function adjacentWhite(
  g: Grid,
  x: number,
  y: number
): { idx: number; x: number; y: number }[] {
  const result: { idx: number; x: number; y: number }[] = [];
  for (const [dx, dy] of DIRS) {
    const nx = x + dx,
      ny = y + dy;
    if (nx >= 0 && nx < g.width && ny >= 0 && ny < g.height) {
      const ni = idx(g, nx, ny);
      if (!isWall(g.cells[ni])) result.push({ idx: ni, x: nx, y: ny });
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Solver (constraint propagation + backtracking)
// ---------------------------------------------------------------------------

function propagate(g: Grid, s: Int8Array): boolean {
  const n = g.width * g.height;
  let changed = true;

  while (changed) {
    changed = false;

    for (let i = 0; i < n; i++) {
      const ch = g.cells[i];

      // --- Numbered wall constraints ---
      const num = wallNumber(ch);
      if (num !== null) {
        const [x, y] = coordsOf(g, i);
        const adj = adjacentWhite(g, x, y);
        let bulbs = 0;
        const unknowns: number[] = [];
        for (const a of adj) {
          if (s[a.idx] === BULB) bulbs++;
          else if (s[a.idx] === UNKNOWN) unknowns.push(a.idx);
        }
        const needed = num - bulbs;
        if (needed < 0 || needed > unknowns.length) return false;
        if (needed === 0 && unknowns.length > 0) {
          for (const u of unknowns) s[u] = NO_BULB;
          changed = true;
        }
        if (needed > 0 && needed === unknowns.length) {
          for (const u of unknowns) s[u] = BULB;
          changed = true;
        }
      }

      // --- Bulb placed: mark visible cells as NO_BULB ---
      if (!isWall(ch) && s[i] === BULB) {
        const [x, y] = coordsOf(g, i);
        const vis = visibleFrom(g, x, y);
        for (const vi of vis) {
          if (s[vi] === BULB) return false;
          if (s[vi] === UNKNOWN) {
            s[vi] = NO_BULB;
            changed = true;
          }
        }
      }

      // --- Unlit white cell: check possible light sources ---
      if (!isWall(ch) && s[i] !== BULB) {
        const [x, y] = coordsOf(g, i);
        if (!cellIsLit(g, s, x, y)) {
          const sources: number[] = [];
          if (s[i] === UNKNOWN) sources.push(i);
          const vis = visibleFrom(g, x, y);
          for (const vi of vis) {
            if (s[vi] === UNKNOWN) sources.push(vi);
          }
          if (sources.length === 0) return false;
          if (sources.length === 1) {
            if (s[sources[0]] === UNKNOWN) {
              s[sources[0]] = BULB;
              changed = true;
            }
          }
        }
      }
    }
  }
  return true;
}

function cellIsLit(g: Grid, s: Int8Array, x: number, y: number): boolean {
  if (s[idx(g, x, y)] === BULB) return true;
  const vis = visibleFrom(g, x, y);
  for (const vi of vis) {
    if (s[vi] === BULB) return true;
  }
  return false;
}

function isSolved(g: Grid, s: Int8Array): boolean {
  const n = g.width * g.height;
  for (let i = 0; i < n; i++) {
    const ch = g.cells[i];
    if (isWall(ch)) {
      const num = wallNumber(ch);
      if (num !== null) {
        const [x, y] = coordsOf(g, i);
        let bulbs = 0;
        for (const a of adjacentWhite(g, x, y)) {
          if (s[a.idx] === BULB) bulbs++;
        }
        if (bulbs !== num) return false;
      }
      continue;
    }
    if (s[i] === UNKNOWN) return false;
    const [x, y] = coordsOf(g, i);
    if (!cellIsLit(g, s, x, y)) return false;
  }
  return true;
}

function pickBranchCell(g: Grid, s: Int8Array): number {
  const n = g.width * g.height;
  let best = -1;
  let bestScore = Infinity;
  for (let i = 0; i < n; i++) {
    if (isWall(g.cells[i]) || s[i] !== UNKNOWN) continue;
    const [x, y] = coordsOf(g, i);
    let score = 0;
    if (!cellIsLit(g, s, x, y)) score += 100;
    const vis = visibleFrom(g, x, y);
    let unknownVis = 0;
    for (const vi of vis) {
      if (s[vi] === UNKNOWN) unknownVis++;
    }
    score -= unknownVis;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}

function solveInner(
  g: Grid,
  s: Int8Array,
  out: number[][],
  max: number
): void {
  if (out.length >= max) return;

  const state = new Int8Array(s);
  if (!propagate(g, state)) return;

  if (isSolved(g, state)) {
    const bulbs: number[] = [];
    for (let i = 0; i < state.length; i++) {
      if (state[i] === BULB) bulbs.push(i);
    }
    out.push(bulbs);
    return;
  }

  const cell = pickBranchCell(g, state);
  if (cell === -1) return;

  const s1 = new Int8Array(state);
  s1[cell] = BULB;
  solveInner(g, s1, out, max);

  if (out.length < max) {
    const s2 = new Int8Array(state);
    s2[cell] = NO_BULB;
    solveInner(g, s2, out, max);
  }
}

function solve(g: Grid, maxSolutions: number): number[][] {
  const n = g.width * g.height;
  const state = new Int8Array(n);
  const out: number[][] = [];
  solveInner(g, state, out, maxSolutions);
  return out;
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export type AkariPuzzle = {
  width: number;
  height: number;
  grid: string;
  solution: number[];
};

function tryGenerate(
  w: number,
  h: number,
  seed: number
): AkariPuzzle | null {
  const rng = mulberry32(seed);
  const n = w * h;
  const cells: string[] = new Array(n).fill(".");

  const density = 0.20 + rng() * 0.06;
  const target = Math.floor(n * density);

  for (let i = 0; i < Math.ceil(target / 2); i++) {
    const x = Math.floor(rng() * w);
    const y = Math.floor(rng() * h);
    cells[y * w + x] = "#";
    cells[(h - 1 - y) * w + (w - 1 - x)] = "#";
  }

  // Reject if any 2x2 block is all walls
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      if (
        isWall(cells[y * w + x]) &&
        isWall(cells[y * w + x + 1]) &&
        isWall(cells[(y + 1) * w + x]) &&
        isWall(cells[(y + 1) * w + x + 1])
      ) {
        return null;
      }
    }
  }

  const grid0: Grid = { width: w, height: h, cells: cells.join("") };

  // Find any valid solution for the numberless grid
  const sols0 = solve(grid0, 1);
  if (sols0.length === 0) return null;

  const solution = sols0[0];
  const bulbSet = new Set(solution);

  // Number all walls based on the solution
  const numbered = cells.slice();
  for (let i = 0; i < n; i++) {
    if (!isWall(numbered[i])) continue;
    const [x, y] = [i % w, (i / w) | 0];
    let count = 0;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx,
        ny = y + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        if (bulbSet.has(ny * w + nx)) count++;
      }
    }
    numbered[i] = count.toString();
  }

  const gridAll: Grid = { width: w, height: h, cells: numbered.join("") };

  // Verify uniqueness with all numbers
  const solsAll = solve(gridAll, 2);
  if (solsAll.length !== 1) return null;

  // Strip numbers while maintaining uniqueness (fewer clues = harder)
  const wallIdxs: number[] = [];
  for (let i = 0; i < n; i++) {
    if (numbered[i] >= "0" && numbered[i] <= "4") wallIdxs.push(i);
  }

  // Shuffle for variety
  for (let i = wallIdxs.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [wallIdxs[i], wallIdxs[j]] = [wallIdxs[j], wallIdxs[i]];
  }

  const finalCells = numbered.slice();
  for (const wi of wallIdxs) {
    const saved = finalCells[wi];
    finalCells[wi] = "#";
    const testGrid: Grid = {
      width: w,
      height: h,
      cells: finalCells.join("")
    };
    const testSols = solve(testGrid, 2);
    if (testSols.length !== 1) {
      finalCells[wi] = saved;
    }
  }

  return {
    width: w,
    height: h,
    grid: finalCells.join(""),
    solution
  };
}

export function generateAkari(
  width: number,
  height: number,
  seed: number
): AkariPuzzle {
  for (let attempt = 0; attempt < 300; attempt++) {
    const result = tryGenerate(width, height, seed + attempt * 7919);
    if (result) return result;
  }
  throw new Error("Failed to generate Akari puzzle after 300 attempts");
}

// ---------------------------------------------------------------------------
// Verifier — checks that a submitted bulb placement is valid
// ---------------------------------------------------------------------------

export function verifyAkariSolution(
  grid: string,
  width: number,
  height: number,
  bulbs: number[]
): { valid: boolean; reason?: string } {
  const n = width * height;
  const g: Grid = { width, height, cells: grid };
  const bulbSet = new Set(bulbs);

  // All bulbs must be on empty cells
  for (const b of bulbs) {
    if (b < 0 || b >= n) return { valid: false, reason: "Bulb out of bounds" };
    if (isWall(grid[b])) return { valid: false, reason: "Bulb on wall" };
  }

  // No two bulbs can see each other
  for (const b of bulbs) {
    const [x, y] = coordsOf(g, b);
    const vis = visibleFrom(g, x, y);
    for (const vi of vis) {
      if (bulbSet.has(vi))
        return { valid: false, reason: "Two bulbs see each other" };
    }
  }

  // All white cells must be lit
  const lit = new Set(bulbs);
  for (const b of bulbs) {
    const [x, y] = coordsOf(g, b);
    for (const vi of visibleFrom(g, x, y)) lit.add(vi);
  }
  for (let i = 0; i < n; i++) {
    if (!isWall(grid[i]) && !lit.has(i))
      return { valid: false, reason: "Unlit cell" };
  }

  // Numbered wall constraints
  for (let i = 0; i < n; i++) {
    const num = wallNumber(grid[i]);
    if (num === null) continue;
    const [x, y] = coordsOf(g, i);
    let count = 0;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx,
        ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (bulbSet.has(ny * width + nx)) count++;
      }
    }
    if (count !== num)
      return {
        valid: false,
        reason: `Wall at (${x},${y}) needs ${num} bulbs, has ${count}`
      };
  }

  return { valid: true };
}
