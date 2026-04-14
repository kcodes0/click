import { generateAkari, verifyAkariSolution } from "./akari";
import { generateFrost, verifyFrostSolution } from "./frost";
import { generateSignal, verifySignalSolution } from "./signal";

export type PuzzleTypeDef = {
  type: string;
  displayName: string;
  difficulty: "Medium" | "Hard" | "Super Hard";
  order: number;
  width: number;
  height: number;
  generate: (
    w: number,
    h: number,
    seed: number
  ) => { width: number; height: number; grid: string; solution: string };
  verify: (
    grid: string,
    width: number,
    height: number,
    answer: unknown
  ) => { valid: boolean; reason?: string };
};

export const PUZZLE_TYPES: PuzzleTypeDef[] = [
  {
    type: "akari",
    displayName: "Light Up",
    difficulty: "Medium",
    order: 1,
    width: 7,
    height: 7,
    generate: (w, h, seed) => {
      const p = generateAkari(w, h, seed);
      return { ...p, solution: JSON.stringify(p.solution) };
    },
    verify: (grid, w, h, answer) =>
      verifyAkariSolution(grid, w, h, answer as number[])
  },
  {
    type: "signal",
    displayName: "Signal",
    difficulty: "Hard",
    order: 2,
    width: 6,
    height: 6,
    generate: generateSignal,
    verify: (grid, w, h, answer) =>
      verifySignalSolution(grid, w, h, answer as Record<string, string>)
  },
  {
    type: "frost",
    displayName: "Frost",
    difficulty: "Super Hard",
    order: 3,
    width: 7,
    height: 7,
    generate: generateFrost,
    verify: (grid, w, h, answer) =>
      verifyFrostSolution(grid, w, h, answer as number[])
  }
];

export function getPuzzleTypeDef(type: string): PuzzleTypeDef | undefined {
  return PUZZLE_TYPES.find((t) => t.type === type);
}
