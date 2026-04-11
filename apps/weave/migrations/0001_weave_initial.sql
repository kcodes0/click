-- Weave tables. Live alongside click + maze in the shared wiki-race D1.
-- The `users` table is owned by apps/click/migrations and is reused here.

CREATE TABLE IF NOT EXISTS weaves (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('daily', 'freeplay')),
  daily_date TEXT,
  board TEXT NOT NULL,
  created_by TEXT,
  created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_weaves_daily_date
  ON weaves (daily_date)
  WHERE type = 'daily';

CREATE TABLE IF NOT EXISTS weave_runs (
  id TEXT PRIMARY KEY,
  weave_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  word_count INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  words TEXT NOT NULL,
  completed_at INTEGER NOT NULL,
  FOREIGN KEY (weave_id) REFERENCES weaves (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_weave_runs_by_weave
  ON weave_runs (weave_id, score DESC, completed_at ASC);

CREATE INDEX IF NOT EXISTS idx_weave_runs_by_user
  ON weave_runs (user_id, completed_at DESC);
