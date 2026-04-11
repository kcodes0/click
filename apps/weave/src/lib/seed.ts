import { createWeave, getDailyWeaveByDate } from "../db/queries";
import type { WeaveRow } from "../types";
import {
  generateBoard,
  hashStringToSeed,
  serializeBoard
} from "./board-gen";
import { getDailyDateKey, nowMs } from "./time";

// Make sure there's a daily weave row for today's date; insert one if not.
// Safe to call on every request — the unique index on daily_date prevents
// concurrent duplicates.
export async function ensureDailyWeave(db: D1Database): Promise<WeaveRow> {
  const dateKey = getDailyDateKey();
  const existing = await getDailyWeaveByDate(db, dateKey);
  if (existing) return existing;

  const seed = hashStringToSeed(`weave:${dateKey}`);
  const board = generateBoard(seed);

  const id = crypto.randomUUID();
  try {
    await createWeave(db, {
      id,
      type: "daily",
      dailyDate: dateKey,
      board: serializeBoard(board),
      createdBy: null,
      createdAt: nowMs()
    });
  } catch {
    // Lost the insert race with a concurrent caller — fall through and
    // re-read whichever row won.
  }

  const row = await getDailyWeaveByDate(db, dateKey);
  if (!row) {
    throw new Error(`Failed to seed daily weave for ${dateKey}`);
  }
  return row;
}
