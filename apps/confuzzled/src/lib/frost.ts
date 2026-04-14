// Frost puzzle: deduce which cells are "ice" from number clues and arrows.
// Inspired by BmMT 2025 Black Ice variant.
//
// Rules:
// - Numbers indicate how many of the 8 surrounding cells (+ itself) are ice
// - Arrow cells must be ice
// - All ice cells must be adjacent (8-dir) to at least one numbered cell
// - Player marks cells as ice or not-ice

export type FrostGridData = {
  cells: string[];
  arrows: { idx: number; dir: string }[];
};

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

const D8: [number, number][] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
];

function neighbors8(
  idx: number,
  W: number,
  H: number
): number[] {
  const x = idx % W,
    y = (idx / W) | 0;
  const result: number[] = [];
  for (const [dx, dy] of D8) {
    const nx = x + dx,
      ny = y + dy;
    if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
      result.push(ny * W + nx);
    }
  }
  return result;
}

// Solver: constraint propagation + backtracking
// State per cell: 0 = unknown, 1 = ice, 2 = not-ice

function solveFrost(
  cells: string[],
  arrows: { idx: number }[],
  W: number,
  H: number,
  maxSolutions: number
): number[][] {
  const n = W * H;
  const solutions: number[][] = [];
  const state = new Int8Array(n);

  // Pre-constraints: arrow cells must be ice
  for (const a of arrows) state[a.idx] = 1;
  // Wall cells are not-ice
  for (let i = 0; i < n; i++) {
    if (cells[i] === "#") state[i] = 2;
  }

  _solveFrost(cells, W, H, state, solutions, maxSolutions);
  return solutions;
}

function _solveFrost(
  cells: string[],
  W: number,
  H: number,
  state: Int8Array,
  solutions: number[][],
  max: number
): void {
  if (solutions.length >= max) return;

  const s = new Int8Array(state);
  if (!propagateFrost(cells, W, H, s)) return;

  if (isFrostSolved(cells, W, H, s)) {
    const ice: number[] = [];
    for (let i = 0; i < s.length; i++) {
      if (s[i] === 1) ice.push(i);
    }
    solutions.push(ice);
    return;
  }

  // Pick undecided cell
  let best = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === 0) {
      best = i;
      break;
    }
  }
  if (best === -1) return;

  const s1 = new Int8Array(s);
  s1[best] = 1;
  _solveFrost(cells, W, H, s1, solutions, max);

  if (solutions.length < max) {
    const s2 = new Int8Array(s);
    s2[best] = 2;
    _solveFrost(cells, W, H, s2, solutions, max);
  }
}

function propagateFrost(
  cells: string[],
  W: number,
  H: number,
  s: Int8Array
): boolean {
  const n = W * H;
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < n; i++) {
      const num = parseInt(cells[i]);
      if (isNaN(num)) continue;

      const nbrs = neighbors8(i, W, H);
      let iceCount = 0;
      const unknowns: number[] = [];
      for (const ni of nbrs) {
        if (s[ni] === 1) iceCount++;
        else if (s[ni] === 0) unknowns.push(ni);
      }

      const needed = num - iceCount;
      if (needed < 0 || needed > unknowns.length) return false;

      if (needed === 0 && unknowns.length > 0) {
        for (const u of unknowns) s[u] = 2;
        changed = true;
      }
      if (needed === unknowns.length && needed > 0) {
        for (const u of unknowns) s[u] = 1;
        changed = true;
      }
    }

    // Coverage: cells not adjacent to any number must be not-ice
    for (let i = 0; i < n; i++) {
      if (s[i] !== 0) continue;
      const nbrs = neighbors8(i, W, H);
      let touchesNumber = false;
      for (const ni of nbrs) {
        if (!isNaN(parseInt(cells[ni]))) {
          touchesNumber = true;
          break;
        }
      }
      if (!touchesNumber && s[i] === 0) {
        s[i] = 2;
        changed = true;
      }
    }
  }
  return true;
}

function isFrostSolved(
  cells: string[],
  W: number,
  H: number,
  s: Int8Array
): boolean {
  const n = W * H;
  for (let i = 0; i < n; i++) {
    if (s[i] === 0) return false;

    const num = parseInt(cells[i]);
    if (isNaN(num)) continue;

    const nbrs = neighbors8(i, W, H);
    let iceCount = 0;
    for (const ni of nbrs) {
      if (s[ni] === 1) iceCount++;
    }
    if (iceCount !== num) return false;
  }
  return true;
}

function tryGenerateFrost(
  W: number,
  H: number,
  seed: number
): {
  width: number;
  height: number;
  grid: string;
  solution: string;
} | null {
  const rng = mulberry32(seed);
  const n = W * H;

  // Phase 1: generate ice pattern (~35% ice)
  const ice = new Uint8Array(n);
  const iceDensity = 0.30 + rng() * 0.10;
  for (let i = 0; i < n; i++) {
    ice[i] = rng() < iceDensity ? 1 : 0;
  }

  // Make pattern point-symmetric
  for (let y = 0; y < Math.ceil(H / 2); y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const mi = (H - 1 - y) * W + (W - 1 - x);
      if (i !== mi) ice[mi] = ice[i];
    }
  }

  // Phase 2: compute number clues for every cell
  const nums: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    const nbrs = neighbors8(i, W, H);
    let count = 0;
    for (const ni of nbrs) {
      if (ice[ni]) count++;
    }
    nums[i] = count;
  }

  // Phase 3: place arrows on some ice cells
  const DIRS = ["N", "S", "E", "W"];
  const arrows: { idx: number; dir: string }[] = [];
  const iceCells: number[] = [];
  for (let i = 0; i < n; i++) {
    if (ice[i]) iceCells.push(i);
  }
  // Shuffle and pick a few for arrows
  for (let i = iceCells.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [iceCells[i], iceCells[j]] = [iceCells[j], iceCells[i]];
  }
  const arrowCount = Math.min(
    Math.max(2, Math.floor(iceCells.length * 0.15)),
    5
  );
  for (let i = 0; i < arrowCount && i < iceCells.length; i++) {
    arrows.push({
      idx: iceCells[i],
      dir: DIRS[Math.floor(rng() * 4)]
    });
  }

  // Phase 4: create cells array — all numbered initially
  const cells: string[] = new Array(n);
  for (let i = 0; i < n; i++) {
    cells[i] = nums[i].toString();
  }

  // Mark arrow cells (overwrite number — arrows are their own clue)
  for (const a of arrows) {
    cells[a.idx] = nums[a.idx].toString();
  }

  // Verify uniqueness with all clues
  const sols = solveFrost(cells, arrows, W, H, 2);
  if (sols.length !== 1) return null;

  // Phase 5: strip number clues to increase difficulty
  const clueIndices: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!isNaN(parseInt(cells[i]))) clueIndices.push(i);
  }
  for (let i = clueIndices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [clueIndices[i], clueIndices[j]] = [clueIndices[j], clueIndices[i]];
  }

  for (const ci of clueIndices) {
    // Don't remove clues from arrow cells
    if (arrows.some((a) => a.idx === ci)) continue;
    const saved = cells[ci];
    cells[ci] = ".";
    const testSols = solveFrost(cells, arrows, W, H, 2);
    if (testSols.length !== 1) {
      cells[ci] = saved;
    }
  }

  // Ensure enough clues remain for a non-trivial puzzle
  let clueCount = 0;
  for (let i = 0; i < n; i++) {
    if (!isNaN(parseInt(cells[i]))) clueCount++;
  }
  if (clueCount < 4) return null;

  const solution = Array.from(ice)
    .map((v, i) => (v ? i : -1))
    .filter((i) => i >= 0);

  const gridData: FrostGridData = { cells, arrows };

  return {
    width: W,
    height: H,
    grid: JSON.stringify(gridData),
    solution: JSON.stringify(solution)
  };
}

export function generateFrost(
  width: number,
  height: number,
  seed: number
): { width: number; height: number; grid: string; solution: string } {
  for (let attempt = 0; attempt < 200; attempt++) {
    const result = tryGenerateFrost(width, height, seed + attempt * 7919);
    if (result) return result;
  }
  throw new Error("Failed to generate Frost puzzle after 200 attempts");
}

export function verifyFrostSolution(
  gridJson: string,
  width: number,
  height: number,
  icePositions: number[]
): { valid: boolean; reason?: string } {
  const data: FrostGridData = JSON.parse(gridJson);
  const n = width * height;
  const ice = new Uint8Array(n);

  for (const pos of icePositions) {
    if (pos < 0 || pos >= n) return { valid: false, reason: "Position out of bounds" };
    ice[pos] = 1;
  }

  // All arrows must be on ice
  for (const a of data.arrows) {
    if (!ice[a.idx])
      return { valid: false, reason: "Arrow cell is not ice" };
  }

  // Check number constraints
  for (let i = 0; i < n; i++) {
    const num = parseInt(data.cells[i]);
    if (isNaN(num)) continue;
    const nbrs = neighbors8(i, width, height);
    let count = 0;
    for (const ni of nbrs) {
      if (ice[ni]) count++;
    }
    if (count !== num)
      return {
        valid: false,
        reason: `Cell (${i % width},${(i / width) | 0}) needs ${num} ice neighbors, has ${count}`
      };
  }

  // Coverage: every ice cell must be adjacent to at least one number
  for (let i = 0; i < n; i++) {
    if (!ice[i]) continue;
    const nbrs = neighbors8(i, width, height);
    let touchesNumber = false;
    for (const ni of nbrs) {
      if (!isNaN(parseInt(data.cells[ni]))) {
        touchesNumber = true;
        break;
      }
    }
    if (!touchesNumber)
      return { valid: false, reason: "Ice cell not adjacent to any number" };
  }

  return { valid: true };
}
