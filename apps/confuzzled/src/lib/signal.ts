// Signal puzzle: route colored signals from transmitters to receivers by
// placing / and \ mirrors. Every non-wall cell must have a mirror.

type Direction = "N" | "S" | "E" | "W";

type EdgePos = { edge: "top" | "bottom" | "left" | "right"; pos: number };

export type SignalPair = {
  id: string;
  color: string;
  from: EdgePos;
  to: EdgePos;
};

export type SignalGridData = {
  cells: string[];
  signals: SignalPair[];
};

const FWD: Record<Direction, Direction> = { E: "N", N: "E", W: "S", S: "W" };
const BWD: Record<Direction, Direction> = { E: "S", S: "E", W: "N", N: "W" };
const DX: Record<Direction, number> = { N: 0, S: 0, E: 1, W: -1 };
const DY: Record<Direction, number> = { N: -1, S: 1, E: 0, W: 0 };

const SIGNAL_COLORS = ["#ff6b1a", "#4fb8ff", "#ff4f9a", "#10bfa0", "#a66bff"];

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

function edgeToStart(
  ep: EdgePos,
  W: number,
  H: number
): { x: number; y: number; dir: Direction } {
  switch (ep.edge) {
    case "top":
      return { x: ep.pos, y: 0, dir: "S" };
    case "bottom":
      return { x: ep.pos, y: H - 1, dir: "N" };
    case "left":
      return { x: 0, y: ep.pos, dir: "E" };
    case "right":
      return { x: W - 1, y: ep.pos, dir: "W" };
  }
}

function exitToEdge(
  x: number,
  y: number,
  dir: Direction,
  W: number,
  H: number
): EdgePos | null {
  if (dir === "N" && y === 0) return { edge: "top", pos: x };
  if (dir === "S" && y === H - 1) return { edge: "bottom", pos: x };
  if (dir === "W" && x === 0) return { edge: "left", pos: y };
  if (dir === "E" && x === W - 1) return { edge: "right", pos: y };
  return null;
}

function traceSignal(
  cells: string[],
  W: number,
  H: number,
  entry: EdgePos
): { path: number[]; exit: EdgePos } | null {
  const { x: sx, y: sy, dir: sdir } = edgeToStart(entry, W, H);
  let x = sx,
    y = sy,
    dir = sdir;
  const path: number[] = [];
  const visited = new Set<number>();

  for (let steps = 0; steps < W * H + 10; steps++) {
    if (x < 0 || x >= W || y < 0 || y >= H) break;
    const i = y * W + x;
    if (cells[i] === "#") return null;
    if (visited.has(i)) return null;
    visited.add(i);
    path.push(i);

    if (cells[i] === "/") dir = FWD[dir];
    else if (cells[i] === "\\") dir = BWD[dir];

    const edge = exitToEdge(x, y, dir, W, H);
    if (edge) return { path, exit: edge };

    x += DX[dir];
    y += DY[dir];
  }
  return null;
}

function allEdgePositions(W: number, H: number): EdgePos[] {
  const result: EdgePos[] = [];
  for (let i = 0; i < W; i++) {
    result.push({ edge: "top", pos: i });
    result.push({ edge: "bottom", pos: i });
  }
  for (let i = 0; i < H; i++) {
    result.push({ edge: "left", pos: i });
    result.push({ edge: "right", pos: i });
  }
  return result;
}

function edgeKey(ep: EdgePos): string {
  return `${ep.edge}:${ep.pos}`;
}

function solveBrute(
  cells: string[],
  W: number,
  H: number,
  signals: SignalPair[],
  maxSolutions: number
): string[][] {
  const empties: number[] = [];
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === ".") empties.push(i);
  }

  const solutions: string[][] = [];
  const total = 1 << empties.length;

  for (let mask = 0; mask < total && solutions.length < maxSolutions; mask++) {
    const test = cells.slice();
    for (let j = 0; j < empties.length; j++) {
      test[empties[j]] = mask & (1 << j) ? "\\" : "/";
    }

    let valid = true;
    for (const sig of signals) {
      const result = traceSignal(test, W, H, sig.from);
      if (
        !result ||
        result.exit.edge !== sig.to.edge ||
        result.exit.pos !== sig.to.pos
      ) {
        valid = false;
        break;
      }
    }
    if (valid) solutions.push(test);
  }
  return solutions;
}

function tryGenerateSignal(
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
  const cells: string[] = new Array(n);

  // Fill all cells with random mirrors
  for (let i = 0; i < n; i++) {
    cells[i] = rng() < 0.5 ? "/" : "\\";
  }

  // Place a few walls (~8%, symmetric)
  const wallTarget = Math.floor(n * 0.08);
  for (let i = 0; i < Math.ceil(wallTarget / 2); i++) {
    const x = Math.floor(rng() * W);
    const y = Math.floor(rng() * H);
    cells[y * W + x] = "#";
    cells[(H - 1 - y) * W + (W - 1 - x)] = "#";
  }

  // Trace all edge-to-edge signals
  const edges = allEdgePositions(W, H);
  type TracedSignal = { from: EdgePos; to: EdgePos; path: number[] };
  const traced: TracedSignal[] = [];
  const usedExits = new Set<string>();

  for (const entry of edges) {
    const result = traceSignal(cells, W, H, entry);
    if (!result || result.path.length < 3) continue;
    const ek = edgeKey(entry);
    const xk = edgeKey(result.exit);
    if (ek === xk) continue;
    if (usedExits.has(xk)) continue;
    traced.push({ from: entry, to: result.exit, path: result.path });
  }

  // Pick non-overlapping signal pairs
  for (let i = traced.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [traced[i], traced[j]] = [traced[j], traced[i]];
  }

  const chosen: TracedSignal[] = [];
  const usedCells = new Set<number>();
  const usedEdges = new Set<string>();

  for (const t of traced) {
    if (chosen.length >= 3) break;
    const fk = edgeKey(t.from);
    const tk = edgeKey(t.to);
    if (usedEdges.has(fk) || usedEdges.has(tk)) continue;
    let overlaps = false;
    for (const c of t.path) {
      if (usedCells.has(c)) {
        overlaps = true;
        break;
      }
    }
    if (overlaps) continue;
    chosen.push(t);
    usedEdges.add(fk);
    usedEdges.add(tk);
    for (const c of t.path) usedCells.add(c);
  }

  if (chosen.length < 3) return null;

  // Turn non-path non-wall cells into walls
  for (let i = 0; i < n; i++) {
    if (cells[i] !== "#" && !usedCells.has(i)) {
      cells[i] = "#";
    }
  }

  // Record full solution
  const solutionMap: Record<number, string> = {};
  for (const c of usedCells) {
    if (cells[c] !== "#") solutionMap[c] = cells[c];
  }

  // Try removing mirrors (making them empty for player to fill)
  const pathList = Array.from(usedCells);
  for (let i = pathList.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pathList[i], pathList[j]] = [pathList[j], pathList[i]];
  }

  const signals: SignalPair[] = chosen.map((t, idx) => ({
    id: String.fromCharCode(65 + idx),
    color: SIGNAL_COLORS[idx],
    from: t.from,
    to: t.to
  }));

  const puzzleCells = cells.slice();
  let removedCount = 0;

  for (const ci of pathList) {
    if (puzzleCells[ci] === "#") continue;
    const saved = puzzleCells[ci];
    puzzleCells[ci] = ".";
    const sols = solveBrute(puzzleCells, W, H, signals, 2);
    if (sols.length === 1) {
      removedCount++;
    } else {
      puzzleCells[ci] = saved;
    }
  }

  if (removedCount < 4) return null;

  const gridData: SignalGridData = { cells: puzzleCells, signals };

  return {
    width: W,
    height: H,
    grid: JSON.stringify(gridData),
    solution: JSON.stringify(solutionMap)
  };
}

export function generateSignal(
  width: number,
  height: number,
  seed: number
): { width: number; height: number; grid: string; solution: string } {
  for (let attempt = 0; attempt < 200; attempt++) {
    const result = tryGenerateSignal(width, height, seed + attempt * 7919);
    if (result) return result;
  }
  throw new Error("Failed to generate Signal puzzle after 200 attempts");
}

export function verifySignalSolution(
  gridJson: string,
  width: number,
  height: number,
  mirrors: Record<string, string>
): { valid: boolean; reason?: string } {
  const data: SignalGridData = JSON.parse(gridJson);
  const cells = data.cells.slice();

  for (const [idxStr, mir] of Object.entries(mirrors)) {
    const idx = parseInt(idxStr);
    if (idx < 0 || idx >= width * height)
      return { valid: false, reason: "Mirror out of bounds" };
    if (cells[idx] !== ".")
      return { valid: false, reason: "Mirror on non-empty cell" };
    if (mir !== "/" && mir !== "\\")
      return { valid: false, reason: "Invalid mirror type" };
    cells[idx] = mir;
  }

  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === ".")
      return { valid: false, reason: "Unfilled cell" };
  }

  for (const sig of data.signals) {
    const result = traceSignal(cells, width, height, sig.from);
    if (!result)
      return {
        valid: false,
        reason: `Signal ${sig.id} is blocked`
      };
    if (result.exit.edge !== sig.to.edge || result.exit.pos !== sig.to.pos)
      return {
        valid: false,
        reason: `Signal ${sig.id} reaches wrong target`
      };
  }

  return { valid: true };
}
