import { requireAuth } from "@kcodes/auth";
import { Hono } from "hono";
import {
  createPuzzleSolve,
  getPuzzleById,
  getPuzzleLeaderboard,
  getUserSolve
} from "../db/queries";
import { verifyAkariSolution } from "../lib/akari";
import type { AppVars, Bindings } from "../types";

const api = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

const MAX_SOLVE_MS = 60 * 60 * 1000; // 1 hour

api.post("/solves", async (c) => {
  const guard = requireAuth(c);
  if (guard) return c.json({ error: "Unauthorized" }, 401);

  const user = c.get("user");
  const body = await c.req.json<{
    puzzleId?: string;
    timeMs?: number;
    bulbs?: number[];
  }>();

  if (
    !user ||
    !body.puzzleId ||
    !Number.isInteger(body.timeMs) ||
    !Array.isArray(body.bulbs)
  ) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const puzzle = await getPuzzleById(c.env.DB, body.puzzleId);
  if (!puzzle) return c.json({ error: "Puzzle not found" }, 404);

  const timeMs = body.timeMs as number;
  if (timeMs < 0 || timeMs > MAX_SOLVE_MS) {
    return c.json({ error: "Time out of range" }, 400);
  }

  const existing = await getUserSolve(c.env.DB, puzzle.id, user.id);
  if (existing) {
    return c.json({ error: "Already submitted a solve for this puzzle" }, 409);
  }

  const { valid, reason } = verifyAkariSolution(
    puzzle.grid,
    puzzle.width,
    puzzle.height,
    body.bulbs
  );

  if (!valid) {
    return c.json({ error: `Invalid solution: ${reason}` }, 400);
  }

  const solveId = crypto.randomUUID();
  await createPuzzleSolve(c.env.DB, {
    id: solveId,
    puzzleId: puzzle.id,
    userId: user.id,
    timeMs,
    completedAt: new Date().toISOString()
  });

  const leaderboard = await getPuzzleLeaderboard(c.env.DB, puzzle.id);
  const rank =
    leaderboard.findIndex((entry) => entry.userId === user.id) + 1;

  return c.json({ ok: true, rank, timeMs, leaderboard });
});

export default api;
