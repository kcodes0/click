import { generateIcebarn, verifyIcebarnSolution } from "./icebarn";

export type PuzzleTypeDef = {
  type: string;
  displayName: string;
  difficulty: "Hard" | "Expert";
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
  scriptName: string;
};

export const PUZZLE_TYPES: PuzzleTypeDef[] = [
  {
    type: "icebarn",
    displayName: "Icebarn",
    difficulty: "Hard",
    order: 1,
    width: 7,
    height: 7,
    generate: generateIcebarn,
    verify: verifyIcebarnSolution,
    scriptName: "game-icebarn"
  },
  {
    type: "icebarn-lg",
    displayName: "Icebarn XL",
    difficulty: "Expert",
    order: 2,
    width: 9,
    height: 9,
    generate: generateIcebarn,
    verify: verifyIcebarnSolution,
    scriptName: "game-icebarn"
  }
];

export function getPuzzleTypeDef(type: string): PuzzleTypeDef | undefined {
  return PUZZLE_TYPES.find((t) => t.type === type);
}
