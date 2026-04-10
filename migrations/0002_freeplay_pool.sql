CREATE TABLE freeplay_pool (
  id TEXT PRIMARY KEY,
  start_article TEXT NOT NULL,
  end_article TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_freeplay_pool_created ON freeplay_pool (created_at);

CREATE TABLE freeplay_pool_lock (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  locked_at INTEGER NOT NULL DEFAULT 0
);

INSERT INTO freeplay_pool_lock (id, locked_at) VALUES (1, 0);
