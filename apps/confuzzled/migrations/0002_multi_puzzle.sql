-- Speed up combined leaderboard lookups
CREATE INDEX IF NOT EXISTS idx_solves_user
  ON puzzle_solves(user_id);
