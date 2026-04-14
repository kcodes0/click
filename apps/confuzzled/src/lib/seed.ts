import { createPuzzle, getDailyPuzzleByDate } from "../db/queries";
import type { PuzzleRow } from "../types";
import { generateAkari, hashStringToSeed } from "./akari";
import { getDailyDateKey, nowMs } from "./time";

const DAILY_WIDTH = 7;
const DAILY_HEIGHT = 7;

export async function ensureDailyPuzzle(db: D1Database): Promise<PuzzleRow> {
  const dateKey = getDailyDateKey();
  const existing = await getDailyPuzzleByDate(db, dateKey);
  if (existing) return existing;

  const seed = hashStringToSeed(`confuzzled:${dateKey}`);
  const puzzle = generateAkari(DAILY_WIDTH, DAILY_HEIGHT, seed);

  const id = crypto.randomUUID();
  try {
    await createPuzzle(db, {
      id,
      type: "akari",
      dailyDate: dateKey,
      width: puzzle.width,
      height: puzzle.height,
      grid: puzzle.grid,
      solution: JSON.stringify(puzzle.solution),
      createdAt: new Date(nowMs()).toISOString()
    });
  } catch {
    // Lost the race — re-read the winner's row
  }

  const row = await getDailyPuzzleByDate(db, dateKey);
  if (!row) throw new Error(`Failed to seed daily puzzle for ${dateKey}`);
  return row;
}
