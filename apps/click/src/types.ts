export type RateLimit = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

export type Bindings = {
  DB: D1Database;
  JWT_SECRET?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RL_PLAYFREE: RateLimit;
  RL_REGISTER: RateLimit;
  RL_LOGIN: RateLimit;
};

export type User = {
  id: string;
  username: string;
  email: string | null;
  created_at: number;
};

export type Challenge = {
  id: string;
  start_article: string;
  end_article: string;
  type: "daily" | "freeplay";
  daily_date: string | null;
  created_by: string | null;
  created_at: number;
};

export type Run = {
  id: string;
  challenge_id: string;
  user_id: string;
  time_ms: number;
  clicks: number;
  path: string;
  completed_at: number;
};

export type LeaderboardEntry = {
  userId: string;
  username: string;
  bestTimeMs: number;
  bestClicks: number;
  completedAt: number;
};

export type CrownEntry = {
  userId: string;
  username: string;
  heldMs: number;
};

export type AppVars = {
  user: User | null;
};
