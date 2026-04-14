import { mulberry32 } from "./prng";

export type NonogramData = {
  rows: number[][];
  cols: number[][];
  w: number;
  h: number;
};

function computeClues(pattern: boolean[], w: number, h: number) {
  const rows: number[][] = [];
  const cols: number[][] = [];
  for (let r = 0; r < h; r++) {
    const runs: number[] = [];
    let c2 = 0;
    for (let c = 0; c < w; c++) {
      if (pattern[r * w + c]) c2++;
      else if (c2) { runs.push(c2); c2 = 0; }
    }
    if (c2) runs.push(c2);
    rows.push(runs.length ? runs : [0]);
  }
  for (let c = 0; c < w; c++) {
    const runs: number[] = [];
    let c2 = 0;
    for (let r = 0; r < h; r++) {
      if (pattern[r * w + c]) c2++;
      else if (c2) { runs.push(c2); c2 = 0; }
    }
    if (c2) runs.push(c2);
    cols.push(runs.length ? runs : [0]);
  }
  return { rows, cols };
}

function enumerateValid(clue: number[], line: number[], n: number): boolean[][] {
  if (clue.length === 1 && clue[0] === 0) {
    if (line.every((c) => c !== 1)) return [new Array(n).fill(false)];
    return [];
  }
  const results: boolean[][] = [];
  function go(ci: number, pos: number, filled: boolean[]) {
    if (ci === clue.length) {
      for (let i = pos; i < n; i++) {
        if (line[i] === 1) return;
        filled[i] = false;
      }
      results.push([...filled]);
      return;
    }
    const len = clue[ci];
    const rem = clue.slice(ci + 1).reduce((a, b) => a + b, 0) + (clue.length - ci - 1);
    for (let s = pos; s + len + rem <= n; s++) {
      let ok = true;
      for (let i = pos; i < s; i++) if (line[i] === 1) { ok = false; break; }
      if (!ok) break;
      ok = true;
      for (let i = s; i < s + len; i++) if (line[i] === 0) { ok = false; break; }
      if (!ok) continue;
      const after = s + len;
      if (ci < clue.length - 1 && after < n && line[after] === 1) continue;
      for (let i = pos; i < s; i++) filled[i] = false;
      for (let i = s; i < s + len; i++) filled[i] = true;
      if (ci < clue.length - 1 && after < n) {
        filled[after] = false;
        go(ci + 1, after + 1, filled);
      } else {
        go(ci + 1, after, filled);
      }
    }
  }
  go(0, 0, new Array(n).fill(false));
  return results;
}

function solveLine(clue: number[], line: number[]): number[] {
  const n = line.length;
  const valids = enumerateValid(clue, line, n);
  if (valids.length === 0) return line;
  const result = [...line];
  for (let i = 0; i < n; i++) {
    if (result[i] !== -1) continue;
    const allF = valids.every((v) => v[i]);
    const allE = valids.every((v) => !v[i]);
    if (allF) result[i] = 1;
    else if (allE) result[i] = 0;
  }
  return result;
}

function solveNonogram(rows: number[][], cols: number[][], w: number, h: number): number[] | null {
  const grid = new Array(w * h).fill(-1);
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < h; r++) {
      const line = [];
      for (let c = 0; c < w; c++) line.push(grid[r * w + c]);
      const solved = solveLine(rows[r], line);
      for (let c = 0; c < w; c++) {
        if (grid[r * w + c] === -1 && solved[c] !== -1) {
          grid[r * w + c] = solved[c];
          changed = true;
        }
      }
    }
    for (let c = 0; c < w; c++) {
      const line = [];
      for (let r = 0; r < h; r++) line.push(grid[r * w + c]);
      const solved = solveLine(cols[c], line);
      for (let r = 0; r < h; r++) {
        if (grid[r * w + c] === -1 && solved[r] !== -1) {
          grid[r * w + c] = solved[r];
          changed = true;
        }
      }
    }
  }
  if (grid.includes(-1)) return null;
  return grid;
}

export function generateNonogram(
  w: number,
  h: number,
  seed: number
): { width: number; height: number; grid: string; solution: string } {
  const rng = mulberry32(seed);
  for (let attempt = 0; attempt < 200; attempt++) {
    const pattern: boolean[] = [];
    const density = 0.35 + rng() * 0.2;
    for (let i = 0; i < w * h; i++) pattern.push(rng() < density);
    const filled = pattern.filter(Boolean).length;
    if (filled < 3 || filled > w * h - 3) continue;

    const clues = computeClues(pattern, w, h);
    const solved = solveNonogram(clues.rows, clues.cols, w, h);
    if (solved && solved.every((v, i) => v === (pattern[i] ? 1 : 0))) {
      const data: NonogramData = { rows: clues.rows, cols: clues.cols, w, h };
      return {
        width: w,
        height: h,
        grid: JSON.stringify(data),
        solution: JSON.stringify(pattern.map((b) => (b ? 1 : 0)))
      };
    }
  }
  const pattern = new Array(w * h).fill(false);
  pattern[0] = true;
  const clues = computeClues(pattern, w, h);
  const data: NonogramData = { rows: clues.rows, cols: clues.cols, w, h };
  return {
    width: w,
    height: h,
    grid: JSON.stringify(data),
    solution: JSON.stringify(pattern.map((b) => (b ? 1 : 0)))
  };
}

export function verifyNonogramSolution(
  grid: string,
  _w: number,
  _h: number,
  answer: unknown
): { valid: boolean; reason?: string } {
  if (!Array.isArray(answer)) return { valid: false, reason: "Expected array" };
  const data = JSON.parse(grid) as NonogramData;
  const { rows, cols, w, h } = data;
  if (answer.length !== w * h) return { valid: false, reason: "Wrong grid size" };
  const a = answer as number[];
  for (let r = 0; r < h; r++) {
    const runs: number[] = [];
    let c2 = 0;
    for (let c = 0; c < w; c++) {
      if (a[r * w + c] === 1) c2++;
      else if (c2) { runs.push(c2); c2 = 0; }
    }
    if (c2) runs.push(c2);
    const actual = runs.length ? runs : [0];
    if (actual.length !== rows[r].length || actual.some((v, i) => v !== rows[r][i]))
      return { valid: false, reason: `Row ${r + 1} doesn't match` };
  }
  for (let c = 0; c < w; c++) {
    const runs: number[] = [];
    let c2 = 0;
    for (let r = 0; r < h; r++) {
      if (a[r * w + c] === 1) c2++;
      else if (c2) { runs.push(c2); c2 = 0; }
    }
    if (c2) runs.push(c2);
    const actual = runs.length ? runs : [0];
    if (actual.length !== cols[c].length || actual.some((v, i) => v !== cols[c][i]))
      return { valid: false, reason: `Column ${c + 1} doesn't match` };
  }
  return { valid: true };
}
