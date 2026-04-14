import { generateNonogram, verifyNonogramSolution } from "./nonogram";
import { generateStarBattle, verifyStarBattleSolution } from "./starbattle";
import { generateTents, verifyTentsSolution } from "./tents";

export type PuzzleTypeDef = {
  type: string;
  displayName: string;
  difficulty: "Medium" | "Hard" | "Expert";
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
    type: "nonogram",
    displayName: "Nonogram",
    difficulty: "Medium",
    order: 1,
    width: 8,
    height: 8,
    generate: generateNonogram,
    verify: verifyNonogramSolution
  },
  {
    type: "starbattle",
    displayName: "Star Battle",
    difficulty: "Hard",
    order: 2,
    width: 8,
    height: 8,
    generate: generateStarBattle,
    verify: verifyStarBattleSolution
  },
  {
    type: "tents",
    displayName: "Tents & Trees",
    difficulty: "Expert",
    order: 3,
    width: 8,
    height: 8,
    generate: generateTents,
    verify: verifyTentsSolution
  }
];

export function getPuzzleTypeDef(type: string): PuzzleTypeDef | undefined {
  return PUZZLE_TYPES.find((t) => t.type === type);
}
