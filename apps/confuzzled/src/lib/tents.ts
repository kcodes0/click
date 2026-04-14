import { mulberry32, shuffle } from "./prng";

export type TentsData = {
  trees: number[];
  rowCounts: number[];
  colCounts: number[];
  w: number;
  h: number;
};

function adj4(cell: number, w: number, h: number): number[] {
  const cx = cell % w, cy = Math.floor(cell / w);
  const result: number[] = [];
  if (cx > 0) result.push(cell - 1);
  if (cx < w - 1) result.push(cell + 1);
  if (cy > 0) result.push(cell - w);
  if (cy < h - 1) result.push(cell + w);
  return result;
}

function adj8(cell: number, w: number, h: number): number[] {
  const cx = cell % w, cy = Math.floor(cell / w);
  const result: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) result.push(ny * w + nx);
    }
  return result;
}

function generatePuzzle(w: number, h: number, rng: () => number, numPairs: number): {
  trees: number[];
  tents: number[];
} | null {
  const n = w * h;
  const used = new Set<number>();
  const tentSet = new Set<number>();
  const treeSet = new Set<number>();
  const pairs: [number, number][] = [];

  const cells = shuffle(Array.from({ length: n }, (_, i) => i), rng);

  for (const treeCell of cells) {
    if (pairs.length >= numPairs) break;
    if (used.has(treeCell)) continue;

    const neighbors = shuffle(adj4(treeCell, w, h), rng);
    for (const tentCell of neighbors) {
      if (used.has(tentCell)) continue;
      let tentOk = true;
      for (const a of adj8(tentCell, w, h)) {
        if (tentSet.has(a)) { tentOk = false; break; }
      }
      if (!tentOk) continue;

      used.add(treeCell);
      used.add(tentCell);
      treeSet.add(treeCell);
      tentSet.add(tentCell);
      pairs.push([treeCell, tentCell]);
      break;
    }
  }

  if (pairs.length < numPairs) return null;
  return {
    trees: pairs.map((p) => p[0]),
    tents: pairs.map((p) => p[1])
  };
}

function solveTents(
  trees: number[],
  rowCounts: number[],
  colCounts: number[],
  w: number,
  h: number,
  maxSolutions: number
): number[][] {
  const n = w * h;
  const treeSet = new Set(trees);
  const solutions: number[][] = [];

  const possibleTents: number[][] = trees.map((t) =>
    adj4(t, w, h).filter((c) => !treeSet.has(c))
  );

  const assignment = new Array(trees.length).fill(-1);
  const tentPlaced = new Set<number>();
  const rowUsed = new Array(h).fill(0);
  const colUsed = new Array(w).fill(0);

  function solve(ti: number): void {
    if (solutions.length >= maxSolutions) return;
    if (ti === trees.length) {
      for (let r = 0; r < h; r++) if (rowUsed[r] !== rowCounts[r]) return;
      for (let c = 0; c < w; c++) if (colUsed[c] !== colCounts[c]) return;
      solutions.push([...tentPlaced]);
      return;
    }

    for (const tentCell of possibleTents[ti]) {
      if (tentPlaced.has(tentCell)) continue;
      let adjOk = true;
      for (const a of adj8(tentCell, w, h)) {
        if (tentPlaced.has(a)) { adjOk = false; break; }
      }
      if (!adjOk) continue;

      const cy = Math.floor(tentCell / w), cx = tentCell % w;
      if (rowUsed[cy] >= rowCounts[cy]) continue;
      if (colUsed[cx] >= colCounts[cx]) continue;

      assignment[ti] = tentCell;
      tentPlaced.add(tentCell);
      rowUsed[cy]++;
      colUsed[cx]++;

      solve(ti + 1);

      assignment[ti] = -1;
      tentPlaced.delete(tentCell);
      rowUsed[cy]--;
      colUsed[cx]--;
    }
  }

  solve(0);
  return solutions;
}

export function generateTents(
  w: number,
  h: number,
  seed: number
): { width: number; height: number; grid: string; solution: string } {
  const rng = mulberry32(seed);
  const numPairs = Math.floor(w * h * 0.12) + 2;

  for (let attempt = 0; attempt < 100; attempt++) {
    const result = generatePuzzle(w, h, rng, numPairs);
    if (!result) continue;

    const { trees, tents } = result;
    const rowCounts = new Array(h).fill(0);
    const colCounts = new Array(w).fill(0);
    for (const t of tents) {
      rowCounts[Math.floor(t / w)]++;
      colCounts[t % w]++;
    }

    const solutions = solveTents(trees, rowCounts, colCounts, w, h, 2);
    if (solutions.length === 1) {
      const data: TentsData = { trees, rowCounts, colCounts, w, h };
      return {
        width: w,
        height: h,
        grid: JSON.stringify(data),
        solution: JSON.stringify([...solutions[0]].sort((a, b) => a - b))
      };
    }
  }
  throw new Error("Failed to generate tents puzzle");
}

export function verifyTentsSolution(
  grid: string,
  _w: number,
  _h: number,
  answer: unknown
): { valid: boolean; reason?: string } {
  if (!Array.isArray(answer)) return { valid: false, reason: "Expected array" };
  const data = JSON.parse(grid) as TentsData;
  const { trees, rowCounts, colCounts, w, h } = data;
  const tents = new Set(answer as number[]);
  const treeSet = new Set(trees);

  if (tents.size !== trees.length) return { valid: false, reason: `Need exactly ${trees.length} tents` };

  for (const t of tents) {
    if (t < 0 || t >= w * h) return { valid: false, reason: "Invalid cell" };
    if (treeSet.has(t)) return { valid: false, reason: "Tent placed on a tree" };
    const hasTree = adj4(t, w, h).some((a) => treeSet.has(a));
    if (!hasTree) return { valid: false, reason: "Tent not adjacent to any tree" };
    for (const a of adj8(t, w, h)) {
      if (a !== t && tents.has(a)) return { valid: false, reason: "Two tents are adjacent" };
    }
  }

  const rc = new Array(h).fill(0);
  const cc = new Array(w).fill(0);
  for (const t of tents) {
    rc[Math.floor(t / w)]++;
    cc[t % w]++;
  }
  for (let r = 0; r < h; r++)
    if (rc[r] !== rowCounts[r]) return { valid: false, reason: `Row ${r + 1}: expected ${rowCounts[r]} tent(s)` };
  for (let c = 0; c < w; c++)
    if (cc[c] !== colCounts[c]) return { valid: false, reason: `Col ${c + 1}: expected ${colCounts[c]} tent(s)` };

  return { valid: true };
}
