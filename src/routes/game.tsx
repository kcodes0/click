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
    ? `Daily — ${formatDateKey(challenge.daily_date)}`
    : "Freeplay";

  return (
    <Layout title="click!" user={user}>
      <div class="wrap page-content">
        <section
          class="game-shell"
          data-challenge-id={challenge.id}
          data-start-title={challenge.start_article}
          data-target-title={challenge.end_article}
        >
          <div class="game-bar">
            <div class="game-bar-left">
              <span class="label">{subtitle}</span>
              <h1 class="game-title">
                {challenge.start_article} <span class="game-arrow">&rarr;</span> {challenge.end_article}
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
              </div>
            </aside>
          </div>
        </section>
      </div>
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
  if (guard) return guard;

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
  if (!challenge) return c.notFound();

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
