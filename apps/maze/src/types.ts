import type { AuthBindings, AuthVars } from "@kcodes/auth";

export type Bindings = AuthBindings;
export type AppVars = AuthVars;

export type MazeRow = {
  id: string;
  type: "daily" | "freeplay";
  daily_date: string | null;
  width: number;
  height: number;
  layout: string;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  created_by: string | null;
  created_at: number;
};

export type MazeRunRow = {
  id: string;
  maze_id: string;
  user_id: string;
  time_ms: number;
  path_length: number;
  completed_at: number;
};

export type MazeLeaderboardEntry = {
  userId: string;
  username: string;
  bestTimeMs: number;
  bestPathLength: number;
  completedAt: number;
};
