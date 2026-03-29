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
import { ensureDailyChallenge } from "../lib/seed";
import { formatDateKey } from "../lib/time";
import { fetchSanitizedArticle, getRandomArticlePair } from "../lib/wikipedia";
import { requireAuth } from "../middleware/auth";
import type { AppVars, Bindings, Challenge } from "../types";

const game = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

function GamePage({
  challenge,
  articleHtml,
  articleTitle,
  user,
  leaderboard
}: {
  challenge: Challenge;
  articleHtml: string;
  articleTitle: string;
  user: AppVars["user"];
  leaderboard: Awaited<ReturnType<typeof getLeaderboard>>;
}) {
  const isDaily = challenge.type === "daily";
  const subtitle = isDaily && challenge.daily_date
    ? `Daily challenge for ${formatDateKey(challenge.daily_date)}`
    : "Freeplay challenge";

  return (
    <Layout title="Play WikiRace" user={user}>
      <section
        class="game-shell"
        data-challenge-id={challenge.id}
        data-start-title={challenge.start_article}
        data-target-title={challenge.end_article}
      >
        <div class="game-topbar">
          <div>
            <span class="tag">{subtitle}</span>
            <h1>
              {challenge.start_article} &rarr; {challenge.end_article}
            </h1>
          </div>
          <div class="status-panel">
            <div class="stat-box timer-box">
              <span class="stat-label">Timer</span>
              <span class="stat-value" id="timer">0:00.00</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Target</span>
              <span class="stat-value" id="target-title">{challenge.end_article}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Clicks</span>
              <span class="stat-value" id="click-count">0</span>
            </div>
          </div>
        </div>
        {!user ? (
          <p class="error-banner">
            You need an account to submit runs. You can still preview the route.
          </p>
        ) : null}
        <div id="game-result" class="result-banner hidden" />
        <div class="game-layout">
          <section class="article-zone">
            <h2 id="article-title">{articleTitle}</h2>
            <div id="article-content">
              <ArticleView html={articleHtml} />
            </div>
          </section>
          <aside class="sidebar">
            <h2>Best Runs</h2>
            <Leaderboard kind="runs" entries={leaderboard} />
            <div class="share-actions">
              <button type="button" id="copy-link-button" class="ghost-btn">
                Copy challenge link
              </button>
            </div>
          </aside>
        </div>
      </section>
      <script src="/static/game.js"></script>
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
  if (guard) {
    return guard;
  }

  const { startArticle, endArticle } = await getRandomArticlePair();
  const challengeId = crypto.randomUUID();

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
  if (!challenge) {
    return c.notFound();
  }

  const article = await fetchSanitizedArticle(challenge.start_article);
  const leaderboard = await getLeaderboard(c.env.DB, challenge.id);

  return c.html(
    <GamePage
      challenge={challenge}
      articleHtml={article.html}
      articleTitle={article.displayTitle}
      user={c.get("user")}
      leaderboard={leaderboard}
    />
  );
});

export default game;
