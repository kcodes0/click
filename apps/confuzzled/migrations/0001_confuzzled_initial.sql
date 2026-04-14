-- Puzzles table: stores generated puzzles (currently Akari / Light Up)
CREATE TABLE IF NOT EXISTS puzzles (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'akari',
  daily_date TEXT,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  grid TEXT NOT NULL,
  solution TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_puzzles_daily
  ON puzzles(type, daily_date);

-- One solve per user per puzzle (first valid solve wins)
CREATE TABLE IF NOT EXISTS puzzle_solves (
  id TEXT PRIMARY KEY,
  puzzle_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  time_ms INTEGER NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_solves_unique
  ON puzzle_solves(puzzle_id, user_id);
CREATE INDEX IF NOT EXISTS idx_solves_puzzle
  ON puzzle_solves(puzzle_id);
