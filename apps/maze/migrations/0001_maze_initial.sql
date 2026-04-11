-- Maze tables. Lives alongside the existing click tables in the same D1
-- database. The shared `users` table is owned by apps/click/migrations and
-- is intentionally not re-created here.

CREATE TABLE IF NOT EXISTS mazes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('daily', 'freeplay')),
  daily_date TEXT,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  layout TEXT NOT NULL,
  start_x INTEGER NOT NULL,
  start_y INTEGER NOT NULL,
  end_x INTEGER NOT NULL,
  end_y INTEGER NOT NULL,
  created_by TEXT,
  created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mazes_daily_date
  ON mazes (daily_date)
  WHERE type = 'daily';

CREATE TABLE IF NOT EXISTS maze_runs (
  id TEXT PRIMARY KEY,
  maze_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  time_ms INTEGER NOT NULL,
  path_length INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  FOREIGN KEY (maze_id) REFERENCES mazes (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_maze_runs_by_maze
  ON maze_runs (maze_id, time_ms ASC, completed_at ASC);

CREATE INDEX IF NOT EXISTS idx_maze_runs_by_user
  ON maze_runs (user_id, completed_at DESC);
