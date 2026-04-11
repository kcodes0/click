import { getRandomArticlePair } from "./wikipedia";

const TARGET_POOL_SIZE = 200;
const REFILL_THRESHOLD = 60;
const REFILL_LOCK_MS = 5 * 60 * 1000;
const REFILL_BATCH_SIZE = 20;

export type FreeplayPair = { startArticle: string; endArticle: string };

type PoolRow = {
  id: string;
  start_article: string;
  end_article: string;
};

export async function consumeFromPool(db: D1Database): Promise<FreeplayPair | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const row = await db
      .prepare(
        "SELECT id, start_article, end_article FROM freeplay_pool ORDER BY RANDOM() LIMIT 1"
      )
      .first<PoolRow>();

    if (!row) return null;

    const deleted = await db
      .prepare("DELETE FROM freeplay_pool WHERE id = ?")
      .bind(row.id)
      .run();

    if ((deleted.meta.changes ?? 0) > 0) {
      return { startArticle: row.start_article, endArticle: row.end_article };
    }
  }

  return null;
}

export async function getPoolCount(db: D1Database): Promise<number> {
  const row = await db
    .prepare("SELECT COUNT(*) AS count FROM freeplay_pool")
    .first<{ count: number }>();
  return row?.count ?? 0;
}

async function acquireRefillLock(db: D1Database): Promise<boolean> {
  const now = Date.now();
  const stale = now - REFILL_LOCK_MS;
  const result = await db
    .prepare(
      "UPDATE freeplay_pool_lock SET locked_at = ? WHERE id = 1 AND locked_at < ?"
    )
    .bind(now, stale)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

async function releaseRefillLock(db: D1Database): Promise<void> {
  await db
    .prepare("UPDATE freeplay_pool_lock SET locked_at = 0 WHERE id = 1")
    .run();
}

async function refillPool(db: D1Database): Promise<void> {
  const count = await getPoolCount(db);
  const room = TARGET_POOL_SIZE - count;
  if (room <= 0) return;

  if (!(await acquireRefillLock(db))) return;

  try {
    const toAdd = Math.min(room, REFILL_BATCH_SIZE);
    for (let i = 0; i < toAdd; i++) {
      try {
        const pair = await getRandomArticlePair();
        await db
          .prepare(
            "INSERT INTO freeplay_pool (id, start_article, end_article, created_at) VALUES (?, ?, ?, ?)"
          )
          .bind(crypto.randomUUID(), pair.startArticle, pair.endArticle, Date.now())
          .run();
      } catch {
        // Keep trying the rest of the batch; one failed summary shouldn't abort the refill.
      }
    }
  } finally {
    await releaseRefillLock(db);
  }
}

export function scheduleRefillIfLow(
  db: D1Database,
  waitUntil: (promise: Promise<unknown>) => void
): void {
  waitUntil(
    (async () => {
      const count = await getPoolCount(db);
      if (count < REFILL_THRESHOLD) {
        await refillPool(db);
      }
    })()
  );
}
