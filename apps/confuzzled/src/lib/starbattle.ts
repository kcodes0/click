import { mulberry32, shuffle } from "./prng";

export type StarBattleData = {
  regions: number[];
  w: number;
  h: number;
  numStars: number;
};

function generateRegions(w: number, h: number, numRegions: number, rng: () => number): number[] {
  const n = w * h;
  const region = new Array(n).fill(-1);
  const indices = shuffle(Array.from({ length: n }, (_, i) => i), rng);

  for (let i = 0; i < numRegions; i++) region[indices[i]] = i;

  const frontiers: number[][] = [];
  for (let i = 0; i < numRegions; i++) frontiers.push([indices[i]]);

  let unclaimed = n - numRegions;
  while (unclaimed > 0) {
    let progress = false;
    const order = shuffle(Array.from({ length: numRegions }, (_, i) => i), rng);
    for (const r of order) {
      if (frontiers[r].length === 0) continue;
      const candidates: number[] = [];
      for (const cell of frontiers[r]) {
        const cx = cell % w, cy = Math.floor(cell / w);
        if (cx > 0 && region[cell - 1] === -1) candidates.push(cell - 1);
        if (cx < w - 1 && region[cell + 1] === -1) candidates.push(cell + 1);
        if (cy > 0 && region[cell - w] === -1) candidates.push(cell - w);
        if (cy < h - 1 && region[cell + w] === -1) candidates.push(cell + w);
      }
      const unique = [...new Set(candidates)];
      if (unique.length > 0) {
        const pick = unique[Math.floor(rng() * unique.length)];
        region[pick] = r;
        frontiers[r].push(pick);
        unclaimed--;
        progress = true;
      }
    }
    if (!progress) break;
  }
  return region;
}

function solveStarBattle(regions: number[], w: number, h: number, numStars: number): number[][] {
  const numRegions = w;
  const solutions: number[][] = [];
  const colUsed = new Array(w).fill(0);
  const regionUsed = new Array(numRegions).fill(0);
  const blocked = new Set<number>();
  const stars: number[] = [];

  function getAdj(cell: number): number[] {
    const cx = cell % w, cy = Math.floor(cell / w);
    const adj: number[] = [];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) adj.push(ny * w + nx);
      }
    return adj;
  }

  function solve(row: number): void {
    if (solutions.length >= 2) return;
    if (row === h) {
      if (stars.length === numStars * h) solutions.push([...stars]);
      return;
    }
    const rowStars: number[][] = [];
    function pickInRow(col: number, placed: number, chosen: number[]): void {
      if (placed === numStars) { rowStars.push([...chosen]); return; }
      if (col >= w) return;
      const remaining = w - col;
      if (remaining < numStars - placed) return;
      pickInRow(col + 1, placed, chosen);
      const cell = row * w + col;
      if (colUsed[col] >= numStars) return;
      if (regionUsed[regions[cell]] >= numStars) return;
      if (blocked.has(cell)) return;
      chosen.push(cell);
      pickInRow(col + 1, placed + 1, chosen);
      chosen.pop();
    }
    pickInRow(0, 0, []);

    for (const combo of rowStars) {
      if (solutions.length >= 2) return;
      const newBlocked: number[] = [];
      for (const cell of combo) {
        const c = cell % w;
        colUsed[c]++;
        regionUsed[regions[cell]]++;
        stars.push(cell);
        for (const adj of getAdj(cell)) {
          if (!blocked.has(adj)) { blocked.add(adj); newBlocked.push(adj); }
        }
      }
      solve(row + 1);
      for (const cell of combo) {
        const c = cell % w;
        colUsed[c]--;
        regionUsed[regions[cell]]--;
        stars.pop();
      }
      for (const b of newBlocked) blocked.delete(b);
    }
  }

  solve(0);
  return solutions;
}

export function generateStarBattle(
  w: number,
  h: number,
  seed: number
): { width: number; height: number; grid: string; solution: string } {
  const rng = mulberry32(seed);
  const numStars = 1;

  for (let attempt = 0; attempt < 100; attempt++) {
    const regions = generateRegions(w, h, w, rng);
    if (regions.includes(-1)) continue;
    const regionSizes = new Array(w).fill(0);
    for (const r of regions) regionSizes[r]++;
    if (regionSizes.some((s) => s < numStars)) continue;

    const solutions = solveStarBattle(regions, w, h, numStars);
    if (solutions.length === 1) {
      const data: StarBattleData = { regions, w, h, numStars };
      return {
        width: w,
        height: h,
        grid: JSON.stringify(data),
        solution: JSON.stringify(solutions[0])
      };
    }
  }
  throw new Error("Failed to generate star battle puzzle");
}

export function verifyStarBattleSolution(
  grid: string,
  _w: number,
  _h: number,
  answer: unknown
): { valid: boolean; reason?: string } {
  if (!Array.isArray(answer)) return { valid: false, reason: "Expected array" };
  const data = JSON.parse(grid) as StarBattleData;
  const { regions, w, h, numStars } = data;
  const stars = new Set(answer as number[]);

  if (stars.size !== numStars * h) return { valid: false, reason: `Need exactly ${numStars * h} stars` };

  const rowCount = new Array(h).fill(0);
  const colCount = new Array(w).fill(0);
  const regionCount = new Array(w).fill(0);

  for (const cell of stars) {
    if (cell < 0 || cell >= w * h) return { valid: false, reason: "Invalid cell" };
    const cx = cell % w, cy = Math.floor(cell / w);
    rowCount[cy]++;
    colCount[cx]++;
    regionCount[regions[cell]]++;
    for (const other of stars) {
      if (other === cell) continue;
      const ox = other % w, oy = Math.floor(other / w);
      if (Math.abs(cx - ox) <= 1 && Math.abs(cy - oy) <= 1)
        return { valid: false, reason: "Two stars are adjacent" };
    }
  }
  for (let i = 0; i < h; i++)
    if (rowCount[i] !== numStars) return { valid: false, reason: `Row ${i + 1} needs ${numStars} star(s)` };
  for (let i = 0; i < w; i++)
    if (colCount[i] !== numStars) return { valid: false, reason: `Column ${i + 1} needs ${numStars} star(s)` };
  for (let i = 0; i < w; i++)
    if (regionCount[i] !== numStars) return { valid: false, reason: `Region ${i + 1} needs ${numStars} star(s)` };

  return { valid: true };
}
