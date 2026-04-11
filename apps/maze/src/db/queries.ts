import type { MazeLeaderboardEntry, MazeRow, MazeRunRow } from "../types";

export async function getMazeById(
  db: D1Database,
  id: string
): Promise<MazeRow | null> {
  const result = await db
    .prepare("SELECT * FROM mazes WHERE id = ? LIMIT 1")
    .bind(id)
    .first<MazeRow>();
  return result ?? null;
}

export async function getDailyMazeByDate(
  db: D1Database,
  dateKey: string
): Promise<MazeRow | null> {
  const result = await db
    .prepare(
      "SELECT * FROM mazes WHERE type = 'daily' AND daily_date = ? LIMIT 1"
    )
    .bind(dateKey)
    .first<MazeRow>();
  return result ?? null;
}

export async function createMaze(
  db: D1Database,
  maze: {
    id: string;
    type: "daily" | "freeplay";
    dailyDate: string | null;
    width: number;
    height: number;
    layout: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    createdBy: string | null;
    createdAt: number;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO mazes
         (id, type, daily_date, width, height, layout,
          start_x, start_y, end_x, end_y, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      maze.id,
      maze.type,
      maze.dailyDate,
      maze.width,
      maze.height,
      maze.layout,
      maze.startX,
      maze.startY,
      maze.endX,
      maze.endY,
      maze.createdBy,
      maze.createdAt
    )
    .run();
}

export async function createMazeRun(
  db: D1Database,
  run: {
    id: string;
    mazeId: string;
    userId: string;
    timeMs: number;
    pathLength: number;
    completedAt: number;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO maze_runs
         (id, maze_id, user_id, time_ms, path_length, completed_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      run.id,
      run.mazeId,
      run.userId,
      run.timeMs,
      run.pathLength,
      run.completedAt
    )
    .run();
}

export async function getMazeLeaderboard(
  db: D1Database,
  mazeId: string
): Promise<MazeLeaderboardEntry[]> {
  const rows = await db
    .prepare(
      `WITH ranked AS (
         SELECT
           maze_runs.user_id AS userId,
           users.username AS username,
           maze_runs.time_ms AS bestTimeMs,
           maze_runs.path_length AS bestPathLength,
           maze_runs.completed_at AS completedAt,
           ROW_NUMBER() OVER (
             PARTITION BY maze_runs.user_id
             ORDER BY maze_runs.time_ms ASC, maze_runs.completed_at ASC
           ) AS row_num
         FROM maze_runs
         JOIN users ON users.id = maze_runs.user_id
         WHERE maze_runs.maze_id = ?
       )
       SELECT userId, username, bestTimeMs, bestPathLength, completedAt
       FROM ranked
       WHERE row_num = 1
       ORDER BY bestTimeMs ASC, completedAt ASC
       LIMIT 50`
    )
    .bind(mazeId)
    .all<MazeLeaderboardEntry>();
  return rows.results;
}

export async function getBestMazeRunByUser(
  db: D1Database,
  mazeId: string,
  userId: string
): Promise<MazeRunRow | null> {
  const result = await db
    .prepare(
      `SELECT *
       FROM maze_runs
       WHERE maze_id = ? AND user_id = ?
       ORDER BY time_ms ASC, completed_at ASC
       LIMIT 1`
    )
    .bind(mazeId, userId)
    .first<MazeRunRow>();
  return result ?? null;
}
