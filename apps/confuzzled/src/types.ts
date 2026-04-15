import type { AuthBindings, AuthVars } from "@kcodes/auth";

export type Bindings = AuthBindings;
export type AppVars = AuthVars;

export type PuzzleRow = {
  id: string;
  type: string;
  daily_date: string | null;
  width: number;
  height: number;
  grid: string;
  solution: string;
  created_at: string;
};

export type PuzzleSolveRow = {
  id: string;
  puzzle_id: string;
  user_id: string;
  time_ms: number;
  completed_at: string;
};

export type LeaderboardEntry = {
  userId: string;
  username: string;
  timeMs: number;
  completedAt: string;
};

export type CombinedLeaderboardEntry = {
  userId: string;
  username: string;
  puzzlesCompleted: number;
  totalTimeMs: number;
  icebarnTimeMs: number | null;
  icebarnLgTimeMs: number | null;
};
