import { PROBLEMS, type MathProblem } from "./problems";

export function hashStringToSeed(s: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

export function getDailyProblem(seed: number): MathProblem {
  const rng = mulberry32(seed);
  const index = Math.floor(rng() * PROBLEMS.length);
  return PROBLEMS[index];
}

export type MathPuzzleGrid = {
  problemId: number;
  category: string;
  statement: string;
  difficulty: number;
};

export function generateMathPuzzle(
  _w: number,
  _h: number,
  seed: number
): { width: number; height: number; grid: string; solution: string } {
  const problem = getDailyProblem(seed);
  const gridData: MathPuzzleGrid = {
    problemId: problem.id,
    category: problem.category,
    statement: problem.statement,
    difficulty: problem.difficulty
  };
  return {
    width: 0,
    height: 0,
    grid: JSON.stringify(gridData),
    solution: problem.answer
  };
}

function parseAnswer(s: string): number | null {
  s = s.trim().replace(/\s+/g, "");
  if (!s) return null;
  const frac = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (frac) {
    const num = parseInt(frac[1], 10);
    const den = parseInt(frac[2], 10);
    if (den === 0 || !isFinite(num) || !isFinite(den)) return null;
    return num / den;
  }
  const n = Number(s);
  if (!isNaN(n) && isFinite(n)) return n;
  return null;
}

export function verifyMathAnswer(
  _grid: string,
  _w: number,
  _h: number,
  answer: unknown
): { valid: boolean; reason?: string } {
  if (typeof answer !== "string" && typeof answer !== "number") {
    return { valid: false, reason: "Answer must be a number or fraction" };
  }

  const gridData = JSON.parse(_grid) as MathPuzzleGrid;
  const problem = PROBLEMS.find((p) => p.id === gridData.problemId);
  if (!problem) {
    return { valid: false, reason: "Problem not found" };
  }

  const userVal = parseAnswer(String(answer));
  const correctVal = parseAnswer(problem.answer);

  if (userVal === null) {
    return { valid: false, reason: "Could not parse your answer" };
  }
  if (correctVal === null) {
    return { valid: false, reason: "Internal error" };
  }

  if (Math.abs(userVal - correctVal) < 1e-9) {
    return { valid: true };
  }

  return { valid: false, reason: "Incorrect answer" };
}
