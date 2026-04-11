import { requireAuth } from "@kcodes/auth";
import { Hono } from "hono";
import {
  createWeaveRun,
  getBestWeaveRunByUser,
  getWeaveById,
  getWeaveLeaderboard
} from "../db/queries";
import {
  findTrace,
  MIN_WORD_LENGTH,
  parseBoard,
  scoreWord
} from "../lib/board-gen";
import { isValidWord } from "../lib/dictionary";
import type { AppVars, Bindings } from "../types";

const api = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

const MAX_RUN_MS = 5 * 60 * 1000; // timer is 3 min; give some slack for finish
const MAX_WORDS_PER_RUN = 400;
const MAX_WORD_LENGTH = 15;

api.post("/runs", async (c) => {
  const guard = requireAuth(c);
  if (guard) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = c.get("user");
  const body = await c.req.json<{
    weaveId?: string;
    timeMs?: number;
    words?: unknown;
  }>();

  if (
    !user ||
    !body.weaveId ||
    !Number.isInteger(body.timeMs) ||
    !Array.isArray(body.words)
  ) {
    return c.json({ error: "Invalid run payload" }, 400);
  }

  const weave = await getWeaveById(c.env.DB, body.weaveId);
  if (!weave) {
    return c.json({ error: "Weave not found" }, 404);
  }

  const timeMs = body.timeMs as number;
  if (timeMs < 0 || timeMs > MAX_RUN_MS) {
    return c.json({ error: "Run time out of range" }, 400);
  }

  if (body.words.length > MAX_WORDS_PER_RUN) {
    return c.json({ error: "Too many words submitted" }, 400);
  }

  const board = parseBoard(weave.board);

  // Walk every submitted word, de-dup case-insensitively, and score only
  // the ones that pass length + dictionary + legal-trace checks. Rejected
  // words are returned so the client can strike them through.
  const accepted: string[] = [];
  const rejected: string[] = [];
  const seen = new Set<string>();
  let score = 0;

  for (const raw of body.words) {
    if (typeof raw !== "string") continue;
    const word = raw.trim().toUpperCase();
    if (!word) continue;
    if (word.length < MIN_WORD_LENGTH || word.length > MAX_WORD_LENGTH) {
      rejected.push(word);
      continue;
    }
    if (!/^[A-Z]+$/.test(word)) {
      rejected.push(word);
      continue;
    }
    if (seen.has(word)) continue;
    seen.add(word);

    if (!isValidWord(word)) {
      rejected.push(word);
      continue;
    }
    if (!findTrace(board, word)) {
      rejected.push(word);
      continue;
    }
    accepted.push(word);
    score += scoreWord(word);
  }

  const completedAt = Date.now();
  const runId = crypto.randomUUID();

  await createWeaveRun(c.env.DB, {
    id: runId,
    weaveId: weave.id,
    userId: user.id,
    score,
    wordCount: accepted.length,
    timeMs,
    words: JSON.stringify(accepted),
    completedAt
  });

  const leaderboard = await getWeaveLeaderboard(c.env.DB, weave.id);
  const rank = leaderboard.findIndex((entry) => entry.userId === user.id) + 1;
  const personalBest = await getBestWeaveRunByUser(c.env.DB, weave.id, user.id);

  return c.json({
    ok: true,
    score,
    wordCount: accepted.length,
    rank,
    personalBestScore: personalBest?.score ?? score,
    acceptedWords: accepted,
    rejectedWords: rejected,
    refreshLeaderboard: leaderboard
  });
});

export default api;
