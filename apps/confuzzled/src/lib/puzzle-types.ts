import { generateMathPuzzle, verifyMathAnswer } from "./mathpuzzle";

export type PuzzleTypeDef = {
  type: string;
  displayName: string;
  difficulty: "Hard";
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
    type: "math",
    displayName: "Daily Challenge",
    difficulty: "Hard",
    order: 1,
    width: 0,
    height: 0,
    generate: generateMathPuzzle,
    verify: verifyMathAnswer
  }
];

export function getPuzzleTypeDef(type: string): PuzzleTypeDef | undefined {
  return PUZZLE_TYPES.find((t) => t.type === type);
}
