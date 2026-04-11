import type { AuthBindings, AuthVars } from "@kcodes/auth";

export type Bindings = AuthBindings;
export type AppVars = AuthVars;

export type WeaveRow = {
  id: string;
  type: "daily" | "freeplay";
  daily_date: string | null;
  board: string;
  created_by: string | null;
  created_at: number;
};

export type WeaveRunRow = {
  id: string;
  weave_id: string;
  user_id: string;
  score: number;
  word_count: number;
  time_ms: number;
  words: string;
  completed_at: number;
};

export type WeaveLeaderboardEntry = {
  userId: string;
  username: string;
  bestScore: number;
  wordCount: number;
  timeMs: number;
  completedAt: number;
};
