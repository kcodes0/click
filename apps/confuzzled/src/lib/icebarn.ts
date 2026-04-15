import { mulberry32, shuffle } from "./prng";

const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

export type IcebarnArrow = { cell: number; dir: number };
export type IcebarnMarker = { side: "top" | "bottom" | "left" | "right"; pos: number };

export type IcebarnData = {
  w: number;
  h: number;
  ice: number[];
  arrows: IcebarnArrow[];
  inMarker: IcebarnMarker;
  outMarker: IcebarnMarker;
  variant: "basic" | "worldtour";
};

function markerToCell(m: IcebarnMarker, w: number, h: number): number {
  if (m.side === "top") return m.pos;
  if (m.side === "bottom") return (h - 1) * w + m.pos;
  if (m.side === "left") return m.pos * w;
  return m.pos * w + (w - 1);
}

function markerEntryDir(m: IcebarnMarker): number {
  if (m.side === "top") return 2;
  if (m.side === "bottom") return 0;
  if (m.side === "left") return 1;
  return 3;
}

function cellInDir(cell: number, dir: number, w: number, h: number): number | null {
  const x = (cell % w) + DX[dir], y = Math.floor(cell / w) + DY[dir];
  if (x < 0 || x >= w || y < 0 || y >= h) return null;
  return y * w + x;
}

function dirFromTo(from: number, to: number, w: number): number {
  const d = to - from;
  if (d === 1) return 1;
  if (d === -1) return 3;
  if (d === w) return 2;
  return 0;
}

function findIcePatches(ice: Set<number>, w: number, h: number): number[][] {
  const visited = new Set<number>();
  const patches: number[][] = [];
  for (const cell of ice) {
    if (visited.has(cell)) continue;
    const patch: number[] = [];
    const q = [cell];
    visited.add(cell);
    while (q.length) {
      const c = q.pop()!;
      patch.push(c);
      for (let d = 0; d < 4; d++) {
        const nb = cellInDir(c, d, w, h);
        if (nb !== null && ice.has(nb) && !visited.has(nb)) { visited.add(nb); q.push(nb); }
      }
    }
    patches.push(patch);
  }
  return patches;
}

// ── Solver ──────────────────────────────────────────────────────

function solveIcebarn(data: IcebarnData, maxSolutions: number): number[][] {
  const { w, h, ice, arrows, inMarker, outMarker, variant } = data;
  const iceSet = new Set(ice);
  const arrowMap = new Map<number, number>();
  for (const a of arrows) arrowMap.set(a.cell, a.dir);

  const patches = findIcePatches(iceSet, w, h);
  const cellToPatch = new Map<number, number>();
  patches.forEach((p, i) => p.forEach((c) => cellToPatch.set(c, i)));

  const inCell = markerToCell(inMarker, w, h);
  const outCell = markerToCell(outMarker, w, h);
  const inDir = markerEntryDir(inMarker);
  const totalNonIce = w * h - iceSet.size;

  const solutions: number[][] = [];
  const visitedNonIce = new Set<number>();
  const patchCount = new Array(patches.length).fill(0);
  let patchesDone = 0;
  const path: number[] = [];
  let nodeCount = 0;
  const NODE_LIMIT = 500_000;

  function dfs(cell: number, dir: number): void {
    if (solutions.length >= maxSolutions || nodeCount > NODE_LIMIT) return;
    nodeCount++;

    path.push(cell);
    const onIce = iceSet.has(cell);

    if (onIce) {
      const pid = cellToPatch.get(cell)!;
      if (patchCount[pid] === 0) patchesDone++;
      patchCount[pid]++;
    } else {
      visitedNonIce.add(cell);
    }

    if (cell === outCell) {
      let ok = patchesDone === patches.length;
      if (ok && variant === "worldtour") ok = visitedNonIce.size === totalNonIce;
      if (ok) solutions.push([...path]);
    } else if (onIce) {
      if (!arrowMap.has(cell) || arrowMap.get(cell) === dir) {
        const next = cellInDir(cell, dir, w, h);
        if (next !== null && (iceSet.has(next) || !visitedNonIce.has(next))) {
          dfs(next, dir);
        }
      }
    } else {
      const forcedDir = arrowMap.get(cell);
      for (let d = 0; d < 4; d++) {
        if (solutions.length >= maxSolutions || nodeCount > NODE_LIMIT) break;
        if (forcedDir !== undefined && forcedDir !== d) continue;
        const next = cellInDir(cell, d, w, h);
        if (next === null) continue;
        if (iceSet.has(next) || !visitedNonIce.has(next)) dfs(next, d);
      }
    }

    if (onIce) {
      const pid = cellToPatch.get(cell)!;
      patchCount[pid]--;
      if (patchCount[pid] === 0) patchesDone--;
    } else {
      visitedNonIce.delete(cell);
    }
    path.pop();
  }

  dfs(inCell, inDir);
  return solutions;
}

// ── Generator ───────────────────────────────────────────────────

function pickMarkers(w: number, h: number, rng: () => number) {
  const sides: Array<"top" | "bottom" | "left" | "right"> = ["top", "bottom", "left", "right"];
  const pairs: [number, number][] = [[0, 1], [1, 0], [2, 3], [3, 2], [0, 2], [0, 3], [1, 2], [1, 3]];
  const [si, so] = pairs[Math.floor(rng() * pairs.length)];
  const maxIn = sides[si] === "top" || sides[si] === "bottom" ? w : h;
  const maxOut = sides[so] === "top" || sides[so] === "bottom" ? w : h;
  return {
    inM: { side: sides[si], pos: 1 + Math.floor(rng() * (maxIn - 2)) } as IcebarnMarker,
    outM: { side: sides[so], pos: 1 + Math.floor(rng() * (maxOut - 2)) } as IcebarnMarker
  };
}

function greedyWalk(
  w: number, h: number, start: number, end: number, rng: () => number, visitAll: boolean
): number[] | null {
  const n = w * h;
  const visited = new Set<number>([start]);
  const path = [start];

  while (path[path.length - 1] !== end) {
    const cur = path[path.length - 1];
    const neighbors: [number, number][] = [];

    for (let d = 0; d < 4; d++) {
      const nb = cellInDir(cur, d, w, h);
      if (nb === null) continue;
      if (visited.has(nb) && nb !== end) continue;
      if (nb === end && visitAll && visited.size < n - 1) continue;
      let exits = 0;
      for (let d2 = 0; d2 < 4; d2++) {
        const nb2 = cellInDir(nb, d2, w, h);
        if (nb2 !== null && !visited.has(nb2) && nb2 !== nb) exits++;
      }
      neighbors.push([nb, exits]);
    }

    if (neighbors.length === 0) {
      if (!visitAll || path.length < 4) return null;
      // limited backtrack for world tour
      const removed = path.pop()!;
      visited.delete(removed);
      if (path.length === 0) return null;
      continue;
    }

    neighbors.sort((a, b) => a[1] - b[1]);
    for (let i = neighbors.length - 1; i > 0; i--) {
      if (neighbors[i][1] === neighbors[i - 1][1] && rng() < 0.4) {
        [neighbors[i], neighbors[i - 1]] = [neighbors[i - 1], neighbors[i]];
      }
    }

    const pick = neighbors[0][0];
    visited.add(pick);
    path.push(pick);

    if (path.length > n * 3) return null;
  }

  return path;
}

function designateIce(path: number[], w: number, rng: () => number, target: number): Set<number> {
  const ice = new Set<number>();
  const runs: number[][] = [];
  let rs = 0;
  for (let i = 2; i < path.length; i++) {
    const dx1 = (path[i - 1] % w) - (path[i - 2] % w);
    const dy1 = Math.floor(path[i - 1] / w) - Math.floor(path[i - 2] / w);
    const dx2 = (path[i] % w) - (path[i - 1] % w);
    const dy2 = Math.floor(path[i] / w) - Math.floor(path[i - 1] / w);
    if (dx1 !== dx2 || dy1 !== dy2) {
      if (i - 1 - (rs + 1) >= 1) runs.push(path.slice(rs + 1, i - 1));
      rs = i - 1;
    }
  }
  if (path.length - 1 - (rs + 1) >= 1) runs.push(path.slice(rs + 1, path.length - 1));

  for (const run of shuffle(runs, rng)) {
    if (ice.size >= target) break;
    for (const c of run) ice.add(c);
  }
  return ice;
}

function makeArrowsAndPrune(
  data: IcebarnData,
  path: number[],
  w: number,
  rng: () => number
): IcebarnArrow[] | null {
  const iceSet = new Set(data.ice);

  const allArrows: IcebarnArrow[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const cell = path[i];
    if (iceSet.has(cell)) continue;
    allArrows.push({ cell, dir: dirFromTo(cell, path[i + 1], w) });
  }

  const testData: IcebarnData = { ...data, arrows: allArrows };
  const check = solveIcebarn(testData, 2);
  if (check.length !== 1) return null;

  const order = shuffle(Array.from({ length: allArrows.length }, (_, i) => i), rng);
  const keep = new Array(allArrows.length).fill(true);

  for (const idx of order) {
    keep[idx] = false;
    const remaining = allArrows.filter((_, i) => keep[i]);
    const td: IcebarnData = { ...data, arrows: remaining };
    const sols = solveIcebarn(td, 2);
    if (sols.length !== 1) keep[idx] = true;
  }

  return allArrows.filter((_, i) => keep[i]);
}

export function generateIcebarn(
  w: number,
  h: number,
  seed: number,
  variant: "basic" | "worldtour" = "basic"
): { width: number; height: number; grid: string; solution: string } {
  const rng = mulberry32(seed);
  const n = w * h;

  for (let attempt = 0; attempt < 200; attempt++) {
    const { inM, outM } = pickMarkers(w, h, rng);
    const inCell = markerToCell(inM, w, h);
    const outCell = markerToCell(outM, w, h);
    if (inCell === outCell) continue;

    const isWT = variant === "worldtour";
    const path = greedyWalk(w, h, inCell, outCell, rng, isWT);
    if (!path) continue;
    if (!isWT && path.length < Math.floor(n * 0.45)) continue;

    const targetIce = Math.max(2, Math.floor(n * 0.12));
    const ice = designateIce(path, w, rng, targetIce);

    const baseData: IcebarnData = { w, h, ice: [...ice], arrows: [], inMarker: inM, outMarker: outM, variant };
    const arrows = makeArrowsAndPrune(baseData, path, w, rng);
    if (!arrows) continue;

    const finalData: IcebarnData = { ...baseData, arrows };
    const verified = solveIcebarn(finalData, 1);
    if (verified.length !== 1) continue;

    return {
      width: w,
      height: h,
      grid: JSON.stringify(finalData),
      solution: JSON.stringify(verified[0])
    };
  }

  throw new Error(`Failed to generate icebarn (${variant}) puzzle`);
}


// ── Verifier ────────────────────────────────────────────────────

export function verifyIcebarnSolution(
  grid: string, _w: number, _h: number, answer: unknown
): { valid: boolean; reason?: string } {
  if (!Array.isArray(answer)) return { valid: false, reason: "Expected path array" };
  const path = answer as number[];
  const data = JSON.parse(grid) as IcebarnData;
  const { w, h, ice, arrows, inMarker, outMarker, variant } = data;
  const iceSet = new Set(ice);
  const arrowMap = new Map<number, number>();
  for (const a of arrows) arrowMap.set(a.cell, a.dir);

  const inCell = markerToCell(inMarker, w, h);
  const outCell = markerToCell(outMarker, w, h);
  const inDir = markerEntryDir(inMarker);

  if (path.length < 2) return { valid: false, reason: "Path too short" };
  if (path[0] !== inCell) return { valid: false, reason: "Path must start at IN" };
  if (path[path.length - 1] !== outCell) return { valid: false, reason: "Path must end at OUT" };

  const visitedNonIce = new Set<number>();
  const patches = findIcePatches(iceSet, w, h);
  const cellToPatch = new Map<number, number>();
  patches.forEach((p, i) => p.forEach((c) => cellToPatch.set(c, i)));
  const patchVisited = new Set<number>();

  for (let i = 0; i < path.length; i++) {
    const cell = path[i];
    if (cell < 0 || cell >= w * h) return { valid: false, reason: "Cell out of bounds" };

    if (i > 0) {
      const prev = path[i - 1];
      const dx = Math.abs((cell % w) - (prev % w));
      const dy = Math.abs(Math.floor(cell / w) - Math.floor(prev / w));
      if (dx + dy !== 1) return { valid: false, reason: "Non-adjacent move" };
    }

    const arrivalDir = i === 0 ? inDir : dirFromTo(path[i - 1], cell, w);

    if (arrowMap.has(cell) && i < path.length - 1) {
      const deptDir = dirFromTo(cell, path[i + 1], w);
      if (arrowMap.get(cell) !== deptDir) {
        return { valid: false, reason: "Arrow violated" };
      }
    }

    if (iceSet.has(cell)) {
      patchVisited.add(cellToPatch.get(cell)!);
      if (i > 0 && i < path.length - 1) {
        const nextDir = dirFromTo(cell, path[i + 1], w);
        if (nextDir !== arrivalDir) return { valid: false, reason: "Turned on ice" };
      }
    } else {
      if (visitedNonIce.has(cell)) return { valid: false, reason: "Revisited non-ice cell" };
      visitedNonIce.add(cell);
    }
  }

  if (patchVisited.size !== patches.length) return { valid: false, reason: "Not all ice patches entered" };

  if (variant === "worldtour") {
    const totalNonIce = w * h - iceSet.size;
    if (visitedNonIce.size !== totalNonIce) return { valid: false, reason: "World Tour: not all cells visited" };
  }

  return { valid: true };
}
