import { mulberry32, shuffle } from "./prng";

export type StarBattleData = {
  regions: number[];
  w: number;
  h: number;
  numStars: number;
};

function adj4(cell: number, w: number, h: number): number[] {
  const cx = cell % w, cy = Math.floor(cell / w);
  const r: number[] = [];
  if (cx > 0) r.push(cell - 1);
  if (cx < w - 1) r.push(cell + 1);
  if (cy > 0) r.push(cell - w);
  if (cy < h - 1) r.push(cell + w);
  return r;
}

function generateRegions(w: number, h: number, numRegions: number, rng: () => number): number[] | null {
  const n = w * h;
  const region = new Array(n).fill(-1);
  const targetSize = Math.floor(n / numRegions);

  const seeds = shuffle(Array.from({ length: n }, (_, i) => i), rng).slice(0, numRegions);
  for (let i = 0; i < numRegions; i++) region[seeds[i]] = i;

  const frontier: Set<number>[] = seeds.map((s) => new Set([s]));
  const sizes = new Array(numRegions).fill(1);

  let unclaimed = n - numRegions;
  let stuck = 0;
  while (unclaimed > 0 && stuck < n * 2) {
    const order = shuffle(Array.from({ length: numRegions }, (_, i) => i), rng);
    let anyProgress = false;
    for (const r of order) {
      if (sizes[r] >= targetSize + 2) continue;
      const candidates: number[] = [];
      for (const cell of frontier[r]) {
        for (const nb of adj4(cell, w, h)) {
          if (region[nb] === -1) candidates.push(nb);
        }
      }
      const unique = [...new Set(candidates)];
      if (unique.length > 0) {
        const pick = unique[Math.floor(rng() * unique.length)];
        region[pick] = r;
        frontier[r].add(pick);
        sizes[r]++;
        unclaimed--;
        anyProgress = true;
      }
    }
    if (!anyProgress) stuck++;
    else stuck = 0;
  }

  if (unclaimed > 0) {
    for (let i = 0; i < n; i++) {
      if (region[i] !== -1) continue;
      for (const nb of adj4(i, w, h)) {
        if (region[nb] !== -1) { region[i] = region[nb]; unclaimed--; break; }
      }
    }
  }

  return region.includes(-1) ? null : region;
}

function solveStarBattle(regions: number[], w: number, h: number): number[][] {
  const solutions: number[][] = [];
  const colUsed = new Array(w).fill(false);
  const regionUsed = new Array(w).fill(false);
  const stars: number[] = [];

  function isBlocked(cell: number): boolean {
    const cx = cell % w, cy = Math.floor(cell / w);
    for (const s of stars) {
      const sx = s % w, sy = Math.floor(s / w);
      if (Math.abs(cx - sx) <= 1 && Math.abs(cy - sy) <= 1) return true;
    }
    return false;
  }

  function solve(row: number): void {
    if (solutions.length >= 2) return;
    if (row === h) { solutions.push([...stars]); return; }

    for (let col = 0; col < w; col++) {
      if (colUsed[col]) continue;
      const cell = row * w + col;
      const r = regions[cell];
      if (regionUsed[r]) continue;
      if (isBlocked(cell)) continue;

      colUsed[col] = true;
      regionUsed[r] = true;
      stars.push(cell);
      solve(row + 1);
      stars.pop();
      colUsed[col] = false;
      regionUsed[r] = false;
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

  for (let attempt = 0; attempt < 1000; attempt++) {
    const regions = generateRegions(w, h, w, rng);
    if (!regions) continue;

    const solutions = solveStarBattle(regions, w, h);
    if (solutions.length === 1) {
      const data: StarBattleData = { regions, w, h, numStars: 1 };
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
  for (let i = 0; i < h; i++) if (rowCount[i] !== numStars) return { valid: false, reason: "Row constraint" };
  for (let i = 0; i < w; i++) if (colCount[i] !== numStars) return { valid: false, reason: "Column constraint" };
  for (let i = 0; i < w; i++) if (regionCount[i] !== numStars) return { valid: false, reason: "Region constraint" };
  return { valid: true };
}
