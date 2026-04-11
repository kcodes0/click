import { createMaze, getDailyMazeByDate } from "../db/queries";
import type { MazeRow } from "../types";
import {
  generateMaze,
  hashStringToSeed,
  serializeLayout
} from "./maze-gen";
import { getDailyDateKey, nowMs } from "./time";

// Fixed size for every daily maze. Big enough to feel like a real puzzle,
// small enough to render comfortably on phones without scrolling.
const DAILY_WIDTH = 15;
const DAILY_HEIGHT = 15;

// Ensure there's a daily maze row for today's date. If one exists, return
// it as-is. Otherwise deterministically generate the maze for today's date
// and insert it. Safe to call on every request — the date key is unique
// in the mazes table so concurrent callers can't double-insert.
export async function ensureDailyMaze(db: D1Database): Promise<MazeRow> {
  const dateKey = getDailyDateKey();
  const existing = await getDailyMazeByDate(db, dateKey);
  if (existing) return existing;

  const seed = hashStringToSeed(`maze:${dateKey}`);
  const maze = generateMaze(DAILY_WIDTH, DAILY_HEIGHT, seed);

  const id = crypto.randomUUID();
  try {
    await createMaze(db, {
      id,
      type: "daily",
      dailyDate: dateKey,
      width: maze.width,
      height: maze.height,
      layout: serializeLayout(maze),
      startX: maze.startX,
      startY: maze.startY,
      endX: maze.endX,
      endY: maze.endY,
      createdBy: null,
      createdAt: nowMs()
    });
  } catch {
    // Lost the race with a concurrent insert — the unique index on
    // daily_date kicks us out and we just re-read the winner's row.
  }

  const row = await getDailyMazeByDate(db, dateKey);
  if (!row) {
    throw new Error(`Failed to seed daily maze for ${dateKey}`);
  }
  return row;
}
