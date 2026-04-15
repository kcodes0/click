import type {
  CombinedLeaderboardEntry,
  CrownEntry,
  LeaderboardEntry,
  PuzzleRow,
  PuzzleSolveRow
} from "../types";

export async function getPuzzleById(
  db: D1Database,
  id: string
): Promise<PuzzleRow | null> {
  const result = await db
    .prepare("SELECT * FROM puzzles WHERE id = ? LIMIT 1")
    .bind(id)
    .first<PuzzleRow>();
  return result ?? null;
}

export async function getDailyPuzzleByDate(
  db: D1Database,
  type: string,
  dateKey: string
): Promise<PuzzleRow | null> {
  const result = await db
    .prepare(
      "SELECT * FROM puzzles WHERE type = ? AND daily_date = ? LIMIT 1"
    )
    .bind(type, dateKey)
    .first<PuzzleRow>();
  return result ?? null;
}

export async function createPuzzle(
  db: D1Database,
  puzzle: {
    id: string;
    type: string;
    dailyDate: string | null;
    width: number;
    height: number;
    grid: string;
    solution: string;
    createdAt: string;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO puzzles
         (id, type, daily_date, width, height, grid, solution, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      puzzle.id,
      puzzle.type,
      puzzle.dailyDate,
      puzzle.width,
      puzzle.height,
      puzzle.grid,
      puzzle.solution,
      puzzle.createdAt
    )
    .run();
}

export async function createPuzzleSolve(
  db: D1Database,
  solve: {
    id: string;
    puzzleId: string;
    userId: string;
    timeMs: number;
    completedAt: string;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO puzzle_solves
         (id, puzzle_id, user_id, time_ms, completed_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(
      solve.id,
      solve.puzzleId,
      solve.userId,
      solve.timeMs,
      solve.completedAt
    )
    .run();
}

export async function getUserSolve(
  db: D1Database,
  puzzleId: string,
  userId: string
): Promise<PuzzleSolveRow | null> {
  const result = await db
    .prepare(
      "SELECT * FROM puzzle_solves WHERE puzzle_id = ? AND user_id = ? LIMIT 1"
    )
    .bind(puzzleId, userId)
    .first<PuzzleSolveRow>();
  return result ?? null;
}

export async function getPuzzleLeaderboard(
  db: D1Database,
  puzzleId: string
): Promise<LeaderboardEntry[]> {
  const rows = await db
    .prepare(
      `SELECT
         puzzle_solves.user_id AS userId,
         users.username AS username,
         puzzle_solves.time_ms AS timeMs,
         puzzle_solves.completed_at AS completedAt
       FROM puzzle_solves
       JOIN users ON users.id = puzzle_solves.user_id
       WHERE puzzle_solves.puzzle_id = ?
       ORDER BY puzzle_solves.time_ms ASC, puzzle_solves.completed_at ASC
       LIMIT 50`
    )
    .bind(puzzleId)
    .all<LeaderboardEntry>();
  return rows.results;
}

export async function getDailyCombinedLeaderboard(
  db: D1Database,
  dateKey: string
): Promise<CombinedLeaderboardEntry[]> {
  const rows = await db
    .prepare(
      `SELECT
         u.id AS userId,
         u.username AS username,
         COUNT(ps.id) AS puzzlesCompleted,
         SUM(ps.time_ms) AS totalTimeMs,
         MAX(CASE WHEN p.type = 'icebarn' THEN ps.time_ms END) AS icebarnTimeMs,
         MAX(CASE WHEN p.type = 'icebarn-lg' THEN ps.time_ms END) AS icebarnLgTimeMs
       FROM users u
       JOIN puzzle_solves ps ON ps.user_id = u.id
       JOIN puzzles p ON p.id = ps.puzzle_id
       WHERE p.daily_date = ?
       GROUP BY u.id
       ORDER BY puzzlesCompleted DESC, totalTimeMs ASC
       LIMIT 50`
    )
    .bind(dateKey)
    .all<CombinedLeaderboardEntry>();
  return rows.results;
}

export async function getCrownLeaderboard(
  db: D1Database
): Promise<CrownEntry[]> {
  const rows = await db
    .prepare(
      `SELECT u.id AS userId, u.username, COUNT(*) AS crowns
       FROM users u
       JOIN puzzle_solves ps ON ps.user_id = u.id
       WHERE ps.id IN (
         SELECT ps2.id FROM puzzle_solves ps2
         JOIN puzzles p2 ON p2.id = ps2.puzzle_id
         WHERE p2.daily_date IS NOT NULL
         AND ps2.time_ms = (
           SELECT MIN(ps3.time_ms) FROM puzzle_solves ps3
           WHERE ps3.puzzle_id = ps2.puzzle_id
         )
       )
       GROUP BY u.id
       ORDER BY crowns DESC
       LIMIT 50`
    )
    .all<CrownEntry>();
  return rows.results;
}

export async function getArchiveDates(
  db: D1Database
): Promise<string[]> {
  const rows = await db
    .prepare(
      `SELECT DISTINCT daily_date FROM puzzles
       WHERE daily_date IS NOT NULL
       ORDER BY daily_date DESC
       LIMIT 60`
    )
    .all<{ daily_date: string }>();
  return rows.results.map((r) => r.daily_date);
}

export async function getPuzzlesByDate(
  db: D1Database,
  dateKey: string
): Promise<PuzzleRow[]> {
  const rows = await db
    .prepare("SELECT * FROM puzzles WHERE daily_date = ? ORDER BY type")
    .bind(dateKey)
    .all<PuzzleRow>();
  return rows.results;
}
