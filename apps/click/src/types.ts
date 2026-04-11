import type { AuthBindings, AuthVars, User } from "@kcodes/auth";

export type RateLimit = {
  limit(options: { key: string }): Promise<{ success: boolean }>;
};

export type Bindings = AuthBindings & {
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RL_PLAYFREE: RateLimit;
  RL_REGISTER: RateLimit;
  RL_LOGIN: RateLimit;
};

// Re-export so click code that does `import type { User } from "../types"`
// keeps compiling without paying attention to the auth package boundary.
export type { User };

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

export type AppVars = AuthVars;
