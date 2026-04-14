import { createPuzzle, getDailyPuzzleByDate } from "../db/queries";
import type { PuzzleRow } from "../types";
import { hashStringToSeed } from "./prng";
import { PUZZLE_TYPES } from "./puzzle-types";
import { getDailyDateKey, nowMs } from "./time";

export async function ensureDailyPuzzle(
  db: D1Database,
  type: string
): Promise<PuzzleRow> {
  const dateKey = getDailyDateKey();
  const existing = await getDailyPuzzleByDate(db, type, dateKey);
  if (existing) return existing;

  const def = PUZZLE_TYPES.find((t) => t.type === type);
  if (!def) throw new Error(`Unknown puzzle type: ${type}`);

  let puzzle: ReturnType<typeof def.generate> | null = null;
  for (let seedOffset = 0; seedOffset < 10; seedOffset++) {
    try {
      const seed = hashStringToSeed(`confuzzled:${type}:${dateKey}:${seedOffset}`);
      puzzle = def.generate(def.width, def.height, seed);
      break;
    } catch {
      // Try next seed offset
    }
  }
  if (!puzzle) throw new Error(`Failed to generate ${type} puzzle after retries`);

  const id = crypto.randomUUID();
  try {
    await createPuzzle(db, {
      id,
      type,
      dailyDate: dateKey,
      width: puzzle.width,
      height: puzzle.height,
      grid: puzzle.grid,
      solution: puzzle.solution,
      createdAt: new Date(nowMs()).toISOString()
    });
  } catch {
    // Lost the race — re-read the winner's row
  }

  const row = await getDailyPuzzleByDate(db, type, dateKey);
  if (!row) throw new Error(`Failed to seed daily ${type} puzzle for ${dateKey}`);
  return row;
}

export async function ensureDailyPuzzles(
  db: D1Database
): Promise<PuzzleRow[]> {
  const results: PuzzleRow[] = [];
  for (const def of PUZZLE_TYPES) {
    results.push(await ensureDailyPuzzle(db, def.type));
  }
  return results;
}
