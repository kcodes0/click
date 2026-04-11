CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  start_article TEXT NOT NULL,
  end_article TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('daily', 'freeplay')),
  daily_date TEXT UNIQUE,
  created_by TEXT REFERENCES users(id),
  created_at INTEGER NOT NULL
);

CREATE TABLE runs (
  id TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL REFERENCES challenges(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  time_ms INTEGER NOT NULL,
  clicks INTEGER NOT NULL,
  path TEXT NOT NULL,
  completed_at INTEGER NOT NULL
);

CREATE TABLE crown_log (
  id TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL REFERENCES challenges(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  started_at INTEGER NOT NULL,
  ended_at INTEGER
);

CREATE INDEX idx_runs_challenge_time ON runs (challenge_id, time_ms, completed_at);
CREATE INDEX idx_runs_user_challenge ON runs (user_id, challenge_id);
CREATE INDEX idx_challenges_type_date ON challenges (type, daily_date);
CREATE INDEX idx_crown_challenge_open ON crown_log (challenge_id, ended_at);
