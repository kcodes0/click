import type {
  WeaveLeaderboardEntry,
  WeaveRow,
  WeaveRunRow
} from "../types";

export async function getWeaveById(
  db: D1Database,
  id: string
): Promise<WeaveRow | null> {
  const result = await db
    .prepare("SELECT * FROM weaves WHERE id = ? LIMIT 1")
    .bind(id)
    .first<WeaveRow>();
  return result ?? null;
}

export async function getDailyWeaveByDate(
  db: D1Database,
  dateKey: string
): Promise<WeaveRow | null> {
  const result = await db
    .prepare(
      "SELECT * FROM weaves WHERE type = 'daily' AND daily_date = ? LIMIT 1"
    )
    .bind(dateKey)
    .first<WeaveRow>();
  return result ?? null;
}

export async function createWeave(
  db: D1Database,
  weave: {
    id: string;
    type: "daily" | "freeplay";
    dailyDate: string | null;
    board: string;
    createdBy: string | null;
    createdAt: number;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO weaves (id, type, daily_date, board, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      weave.id,
      weave.type,
      weave.dailyDate,
      weave.board,
      weave.createdBy,
      weave.createdAt
    )
    .run();
}

export async function createWeaveRun(
  db: D1Database,
  run: {
    id: string;
    weaveId: string;
    userId: string;
    score: number;
    wordCount: number;
    timeMs: number;
    words: string;
    completedAt: number;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO weave_runs
         (id, weave_id, user_id, score, word_count, time_ms, words, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      run.id,
      run.weaveId,
      run.userId,
      run.score,
      run.wordCount,
      run.timeMs,
      run.words,
      run.completedAt
    )
    .run();
}

export async function getWeaveLeaderboard(
  db: D1Database,
  weaveId: string
): Promise<WeaveLeaderboardEntry[]> {
  const rows = await db
    .prepare(
      `WITH ranked AS (
         SELECT
           weave_runs.user_id AS userId,
           users.username AS username,
           weave_runs.score AS bestScore,
           weave_runs.word_count AS wordCount,
           weave_runs.time_ms AS timeMs,
           weave_runs.completed_at AS completedAt,
           ROW_NUMBER() OVER (
             PARTITION BY weave_runs.user_id
             ORDER BY weave_runs.score DESC, weave_runs.completed_at ASC
           ) AS row_num
         FROM weave_runs
         JOIN users ON users.id = weave_runs.user_id
         WHERE weave_runs.weave_id = ?
       )
       SELECT userId, username, bestScore, wordCount, timeMs, completedAt
       FROM ranked
       WHERE row_num = 1
       ORDER BY bestScore DESC, completedAt ASC
       LIMIT 50`
    )
    .bind(weaveId)
    .all<WeaveLeaderboardEntry>();
  return rows.results;
}

export async function getBestWeaveRunByUser(
  db: D1Database,
  weaveId: string,
  userId: string
): Promise<WeaveRunRow | null> {
  const result = await db
    .prepare(
      `SELECT *
       FROM weave_runs
       WHERE weave_id = ? AND user_id = ?
       ORDER BY score DESC, completed_at ASC
       LIMIT 1`
    )
    .bind(weaveId, userId)
    .first<WeaveRunRow>();
  return result ?? null;
}
