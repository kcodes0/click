import { Hono } from "hono";
import {
  createRun,
  getBestRunByUser,
  getChallengeById,
  getLeaderboard
} from "../db/queries";
import { maybeUpdateCrownForRun } from "../lib/crown";
import {
  ARTICLE_CACHE_CONTROL,
  getCachedSanitizedArticle
} from "../lib/wikipedia";
import { requireAuth } from "../middleware/auth";
import type { AppVars, Bindings } from "../types";

const api = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

api.get("/wikipedia/:title", async (c) => {
  const articleCache = await caches.open("wiki-articles");
  const article = await getCachedSanitizedArticle(c.req.param("title"), {
    cache: articleCache,
    cacheUrlBase: c.req.url,
    waitUntil: (promise) => c.executionCtx.waitUntil(promise)
  });

  return c.json(article, 200, {
    "cache-control": ARTICLE_CACHE_CONTROL
  });
});

api.post("/runs", async (c) => {
  const guard = requireAuth(c);
  if (guard) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = c.get("user");
  const body = await c.req.json<{
    challengeId?: string;
    timeMs?: number;
    clicks?: number;
    path?: string[];
  }>();

  if (
    !user ||
    !body.challengeId ||
    !Number.isInteger(body.timeMs) ||
    !Number.isInteger(body.clicks) ||
    !Array.isArray(body.path) ||
    body.path.length < 1
  ) {
    return c.json({ error: "Invalid run payload" }, 400);
  }

  const challenge = await getChallengeById(c.env.DB, body.challengeId);
  if (!challenge) {
    return c.json({ error: "Challenge not found" }, 404);
  }

  const timeMs = body.timeMs as number;
  const clicks = body.clicks as number;

  const normalizedPath = body.path
    .map((title) => String(title || "").trim())
    .filter(Boolean);

  if (
    normalizedPath[0] !== challenge.start_article ||
    normalizedPath[normalizedPath.length - 1] !== challenge.end_article
  ) {
    return c.json({ error: "Run path does not match challenge endpoints" }, 400);
  }

  const completedAt = Date.now();
  const runId = crypto.randomUUID();

  await createRun(c.env.DB, {
    id: runId,
    challengeId: challenge.id,
    userId: user.id,
    timeMs,
    clicks,
    path: JSON.stringify(normalizedPath),
    completedAt
  });

  await maybeUpdateCrownForRun(c.env.DB, challenge, runId, user.id, completedAt);

  const leaderboard = await getLeaderboard(c.env.DB, challenge.id);
  const rank = leaderboard.findIndex((entry) => entry.userId === user.id) + 1;
  const personalBest = await getBestRunByUser(c.env.DB, challenge.id, user.id);

  return c.json({
    ok: true,
    rank,
    personalBestTimeMs: personalBest?.time_ms ?? timeMs,
    leaderboard
  });
});

export default api;
