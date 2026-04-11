/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { ArticleView } from "../components/ArticleView";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import {
  createChallenge,
  getChallengeById,
  getLeaderboard
} from "../db/queries";
import { closeExpiredDailyCrowns } from "../lib/crown";
import {
  consumeFromPool,
  scheduleRefillIfLow
} from "../lib/freeplay-pool";
import { checkRateLimit, clientIp } from "../lib/rate-limit";
import { ensureDailyChallenge } from "../lib/seed";
import { formatDateKey } from "../lib/time";
import {
  getCachedSanitizedArticle,
  getRandomArticlePair,
  type ArticleRenderer
} from "../lib/wikipedia";
import { requireAuth } from "../middleware/auth";
import type { AppVars, Bindings, Challenge } from "../types";

const game = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

function GamePage({
  challenge,
  articleHtml,
  articleTitle,
  user,
  leaderboard,
  renderer
}: {
  challenge: Challenge;
  articleHtml: string;
  articleTitle: string;
  user: AppVars["user"];
  leaderboard: Awaited<ReturnType<typeof getLeaderboard>>;
  renderer: ArticleRenderer;
}) {
  const isDaily = challenge.type === "daily";
  const subtitle = isDaily && challenge.daily_date
    ? `Daily — ${formatDateKey(challenge.daily_date)}`
    : "Freeplay";
  const rendererToggleHref =
    renderer === "legacy"
      ? `/play/${challenge.id}`
      : `/play/${challenge.id}?legacy=1`;
  const rendererToggleLabel =
    renderer === "legacy"
      ? "Back to new renderer"
      : "Use classic renderer";

  return (
    <Layout
      title="click!"
      user={user}
      head={<script defer src="/static/game.js"></script>}
    >
      <div class="wrap page-content">
        <section
          class="game-shell"
          data-challenge-id={challenge.id}
          data-start-title={challenge.start_article}
          data-target-title={challenge.end_article}
          data-renderer={renderer}
        >
          <div class="game-bar">
            <div class="game-bar-left">
              <span class="label">{subtitle}</span>
              <h1 class="game-title">
                <span>{challenge.start_article}</span>
                <span class="game-arrow">~&gt;</span>
                <span>{challenge.end_article}</span>
              </h1>
            </div>
            <div class="game-stats">
              <div class="stat stat--timer">
                <span class="stat-label">Timer</span>
                <span class="stat-val" id="timer">0:00.00</span>
              </div>
              <div class="stat">
                <span class="stat-label">Target</span>
                <span class="stat-val" id="target-title">{challenge.end_article}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Clicks</span>
                <span class="stat-val" id="click-count">0</span>
              </div>
            </div>
          </div>

          {!user && (
            <p class="error-banner">
              You need an account to submit runs. You can still preview the route.
            </p>
          )}
          <div id="game-result" class="result-banner hidden" />

          <div class="game-cols">
            <div class="article-paper">
              <h2 id="article-title">{articleTitle}</h2>
              <div id="article-content">
                <ArticleView html={articleHtml} />
              </div>
            </div>
            <aside class="game-side">
              <h3 class="side-heading">Best Runs</h3>
              <Leaderboard kind="runs" entries={leaderboard} />
              <div class="share-actions">
                <button type="button" id="copy-link-button" class="btn btn--ghost btn--sm">
                  Copy challenge link
                </button>
                <a href={rendererToggleHref} class="renderer-toggle">
                  {rendererToggleLabel}
                </a>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </Layout>
  );
}

game.get("/daily", async (c) => {
  await closeExpiredDailyCrowns(c.env.DB);
  const challenge = await ensureDailyChallenge(c.env.DB);
  return c.redirect(`/play/${challenge.id}`);
});

game.get("/free", async (c) => {
  const guard = requireAuth(c);
  if (guard) return guard;

  const userId = c.get("user")?.id;
  const key = userId ? `playfree:user:${userId}` : `playfree:ip:${clientIp(c)}`;
  if (!(await checkRateLimit(c.env.RL_PLAYFREE, key))) {
    return c.text(
      "You're creating new freeplay challenges too fast. Slow down and try again in a minute.",
      429
    );
  }

  const pooled = await consumeFromPool(c.env.DB);
  const { startArticle, endArticle } = pooled ?? (await getRandomArticlePair());
  const challengeId = crypto.randomUUID();

  scheduleRefillIfLow(c.env.DB, (promise) => c.executionCtx.waitUntil(promise));

  await createChallenge(c.env.DB, {
    id: challengeId,
    startArticle,
    endArticle,
    type: "freeplay",
    dailyDate: null,
    createdBy: c.get("user")?.id || null,
    createdAt: Date.now()
  });

  return c.redirect(`/play/${challengeId}`);
});

game.get("/:challengeId", async (c) => {
  const challenge = await getChallengeById(c.env.DB, c.req.param("challengeId"));
  if (!challenge) return c.notFound();
  const articleCache = await caches.open("wiki-articles");
  const renderer: ArticleRenderer =
    c.req.query("legacy") === "1" ? "legacy" : "experimental";

  const [article, leaderboard] = await Promise.all([
    getCachedSanitizedArticle(challenge.start_article, {
      cache: articleCache,
      cacheUrlBase: c.req.url,
      waitUntil: (promise) => c.executionCtx.waitUntil(promise),
      renderer
    }),
    getLeaderboard(c.env.DB, challenge.id)
  ]);

  return c.html(
    <GamePage
      challenge={challenge}
      articleHtml={article.html}
      articleTitle={article.displayTitle}
      user={c.get("user")}
      leaderboard={leaderboard}
      renderer={renderer}
    />
  );
});

export default game;
