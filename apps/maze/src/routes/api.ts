import { requireAuth } from "@kcodes/auth";
import { Hono } from "hono";
import {
  createMazeRun,
  getBestMazeRunByUser,
  getMazeById,
  getMazeLeaderboard
} from "../db/queries";
import { canMove, parseLayout } from "../lib/maze-gen";
import type { AppVars, Bindings } from "../types";

const api = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

// Tunable validation thresholds. Deliberately loose — we only want to
// reject runs that are impossible or obviously spoofed, not punish fast
// players.
const MIN_STEP_MS = 50; // ≈20 steps per second is already superhuman
const MAX_RUN_MS = 30 * 60 * 1000; // 30 minutes
// Paths can revisit cells (via click-to-truncate) but we still cap the
// submitted length against a pathological loop.
const MAX_PATH_MULTIPLIER = 4;

api.post("/runs", async (c) => {
  const guard = requireAuth(c);
  if (guard) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = c.get("user");
  const body = await c.req.json<{
    mazeId?: string;
    timeMs?: number;
    path?: Array<[number, number]>;
  }>();

  if (
    !user ||
    !body.mazeId ||
    !Number.isInteger(body.timeMs) ||
    !Array.isArray(body.path) ||
    body.path.length < 2
  ) {
    return c.json({ error: "Invalid run payload" }, 400);
  }

  const maze = await getMazeById(c.env.DB, body.mazeId);
  if (!maze) {
    return c.json({ error: "Maze not found" }, 404);
  }

  const timeMs = body.timeMs as number;
  if (timeMs < 0 || timeMs > MAX_RUN_MS) {
    return c.json({ error: "Run time out of range" }, 400);
  }

  const path = body.path;
  const maxPathLength = maze.width * maze.height * MAX_PATH_MULTIPLIER;
  if (path.length > maxPathLength) {
    return c.json({ error: "Path is too long" }, 400);
  }

  // Shape check — every entry must be [x, y] inside the grid.
  for (const step of path) {
    if (
      !Array.isArray(step) ||
      step.length !== 2 ||
      !Number.isInteger(step[0]) ||
      !Number.isInteger(step[1]) ||
      step[0] < 0 ||
      step[1] < 0 ||
      step[0] >= maze.width ||
      step[1] >= maze.height
    ) {
      return c.json({ error: "Malformed path coordinate" }, 400);
    }
  }

  // Endpoints must match the maze's recorded start / end.
  const first = path[0];
  const last = path[path.length - 1];
  if (first[0] !== maze.start_x || first[1] !== maze.start_y) {
    return c.json({ error: "Path must start at the maze start" }, 400);
  }
  if (last[0] !== maze.end_x || last[1] !== maze.end_y) {
    return c.json({ error: "Path must finish at the maze end" }, 400);
  }

  // Walk the path and confirm every hop is adjacent + unblocked by walls.
  // We reuse canMove from the same generator the client + renderer use,
  // so the client and server can't disagree about whether a move is legal.
  const layout = parseLayout(maze.layout);
  for (let i = 1; i < path.length; i++) {
    const [fromX, fromY] = path[i - 1];
    const [toX, toY] = path[i];
    if (!canMove(layout, fromX, fromY, toX, toY)) {
      return c.json(
        { error: `Illegal move at step ${i} (${fromX},${fromY})→(${toX},${toY})` },
        400
      );
    }
  }

  const hopCount = path.length - 1;
  if (timeMs < hopCount * MIN_STEP_MS) {
    return c.json({ error: "Run time is faster than physically possible" }, 400);
  }

  const completedAt = Date.now();
  const runId = crypto.randomUUID();

  await createMazeRun(c.env.DB, {
    id: runId,
    mazeId: maze.id,
    userId: user.id,
    timeMs,
    pathLength: hopCount,
    completedAt
  });

  const leaderboard = await getMazeLeaderboard(c.env.DB, maze.id);
  const rank = leaderboard.findIndex((entry) => entry.userId === user.id) + 1;
  const personalBest = await getBestMazeRunByUser(c.env.DB, maze.id, user.id);

  return c.json({
    ok: true,
    rank,
    personalBestTimeMs: personalBest?.time_ms ?? timeMs,
    leaderboard
  });
});

export default api;
