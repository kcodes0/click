import type { Challenge, CrownEntry, LeaderboardEntry, Run } from "../types";

function must<T>(value: T | null | undefined, message: string): T {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}

export async function createChallenge(
  db: D1Database,
  challenge: {
    id: string;
    startArticle: string;
    endArticle: string;
    type: "daily" | "freeplay";
    dailyDate: string | null;
    createdBy: string | null;
    createdAt: number;
  }
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO challenges (id, start_article, end_article, type, daily_date, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      challenge.id,
      challenge.startArticle,
      challenge.endArticle,
      challenge.type,
      challenge.dailyDate,
      challenge.createdBy,
      challenge.createdAt
    )
    .run();
}

export async function getChallengeById(
  db: D1Database,
  challengeId: string
): Promise<Challenge | null> {
  const result = await db
    .prepare("SELECT * FROM challenges WHERE id = ? LIMIT 1")
    .bind(challengeId)
    .first<Challenge>();
  return result ?? null;
}

export async function getDailyChallengeByDate(
  db: D1Database,
  dateKey: string
): Promise<Challenge | null> {
  const result = await db
    .prepare(
      "SELECT * FROM challenges WHERE type = 'daily' AND daily_date = ? LIMIT 1"
    )
    .bind(dateKey)
    .first<Challenge>();
  return result ?? null;
}

export async function listDailyChallenges(
  db: D1Database,
  limit = 14
): Promise<Challenge[]> {
  const result = await db
    .prepare(
      "SELECT * FROM challenges WHERE type = 'daily' ORDER BY daily_date DESC LIMIT ?"
    )
    .bind(limit)
    .all<Challenge>();
  return result.results;
}

export async function createRun(
  db: D1Database,
  run: {
    id: string;
    challengeId: string;
    userId: string;
    timeMs: number;
    clicks: number;
    path: string;
    completedAt: number;
  }
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO runs (id, challenge_id, user_id, time_ms, clicks, path, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(
      run.id,
      run.challengeId,
      run.userId,
      run.timeMs,
      run.clicks,
      run.path,
      run.completedAt
    )
    .run();
}

export async function getTopRun(
  db: D1Database,
  challengeId: string
): Promise<(Run & { username: string }) | null> {
  const result = await db
    .prepare(
      `SELECT runs.*, users.username
       FROM runs
       JOIN users ON users.id = runs.user_id
       WHERE runs.challenge_id = ?
       ORDER BY runs.time_ms ASC, runs.completed_at ASC
       LIMIT 1`
    )
    .bind(challengeId)
    .first<Run & { username: string }>();
  return result ?? null;
}

export async function getBestRunByUser(
  db: D1Database,
  challengeId: string,
  userId: string
): Promise<Run | null> {
  const result = await db
    .prepare(
      `SELECT *
       FROM runs
       WHERE challenge_id = ? AND user_id = ?
       ORDER BY time_ms ASC, completed_at ASC
       LIMIT 1`
    )
    .bind(challengeId, userId)
    .first<Run>();
  return result ?? null;
}

export async function getLeaderboard(
  db: D1Database,
  challengeId: string
): Promise<LeaderboardEntry[]> {
  const rows = await db
    .prepare(
      `WITH ranked AS (
        SELECT
          runs.id,
          runs.user_id AS userId,
          users.username AS username,
          runs.time_ms AS bestTimeMs,
          runs.clicks AS bestClicks,
          runs.completed_at AS completedAt,
          ROW_NUMBER() OVER (
            PARTITION BY runs.user_id
            ORDER BY runs.time_ms ASC, runs.completed_at ASC
          ) AS row_num
        FROM runs
        JOIN users ON users.id = runs.user_id
        WHERE runs.challenge_id = ?
      )
      SELECT userId, username, bestTimeMs, bestClicks, completedAt
      FROM ranked
      WHERE row_num = 1
      ORDER BY bestTimeMs ASC, completedAt ASC`
    )
    .bind(challengeId)
    .all<LeaderboardEntry>();

  return rows.results;
}

export async function getDailyChallengeByArchiveDate(
  db: D1Database,
  dateKey: string
): Promise<Challenge | null> {
  return getDailyChallengeByDate(db, dateKey);
}

export async function getOpenCrownLog(
  db: D1Database,
  challengeId: string
): Promise<{ id: string; user_id: string; started_at: number } | null> {
  const result = await db
    .prepare(
      "SELECT id, user_id, started_at FROM crown_log WHERE challenge_id = ? AND ended_at IS NULL LIMIT 1"
    )
    .bind(challengeId)
    .first<{ id: string; user_id: string; started_at: number }>();
  return result ?? null;
}

export async function closeCrownLog(
  db: D1Database,
  id: string,
  endedAt: number
): Promise<void> {
  await db
    .prepare("UPDATE crown_log SET ended_at = ? WHERE id = ?")
    .bind(endedAt, id)
    .run();
}

export async function openCrownLog(
  db: D1Database,
  entry: {
    id: string;
    challengeId: string;
    userId: string;
    startedAt: number;
  }
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO crown_log (id, challenge_id, user_id, started_at, ended_at) VALUES (?, ?, ?, ?, NULL)"
    )
    .bind(entry.id, entry.challengeId, entry.userId, entry.startedAt)
    .run();
}

export async function closeExpiredCrowns(
  db: D1Database,
  currentDailyKey: string,
  closeTimestampForDate: (dateKey: string) => number
): Promise<void> {
  const openRows = await db
    .prepare(
      `SELECT crown_log.id, challenges.daily_date
       FROM crown_log
       JOIN challenges ON challenges.id = crown_log.challenge_id
       WHERE challenges.type = 'daily'
         AND challenges.daily_date IS NOT NULL
         AND challenges.daily_date < ?
         AND crown_log.ended_at IS NULL`
    )
    .bind(currentDailyKey)
    .all<{ id: string; daily_date: string }>();

  await Promise.all(
    openRows.results.map((row) =>
      closeCrownLog(db, row.id, closeTimestampForDate(must(row.daily_date, "daily date missing")))
    )
  );
}

export async function getCrownLeaderboard(
  db: D1Database,
  now: number
): Promise<CrownEntry[]> {
  const result = await db
    .prepare(
      `SELECT
        crown_log.user_id AS userId,
        users.username AS username,
        SUM(COALESCE(crown_log.ended_at, ?) - crown_log.started_at) AS heldMs
      FROM crown_log
      JOIN users ON users.id = crown_log.user_id
      GROUP BY crown_log.user_id, users.username
      ORDER BY heldMs DESC, users.username ASC`
    )
    .bind(now)
    .all<CrownEntry>();
  return result.results;
}
