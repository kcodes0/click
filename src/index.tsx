/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { ArticleView } from "./components/ArticleView";
import { Layout } from "./components/Layout";
import { authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";
import gameRoutes from "./routes/game";
import leaderboardRoutes, { crown as crownRoutes } from "./routes/leaderboard";
import { ensureDailyChallenge } from "./lib/seed";
import { closeExpiredDailyCrowns } from "./lib/crown";
import { fetchSanitizedArticle } from "./lib/wikipedia";
import type { AppVars, Bindings } from "./types";
import { GAME_JS } from "./static/assets";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

app.get("/static/game.js", (c) =>
  c.body(GAME_JS, 200, {
    "content-type": "application/javascript; charset=utf-8"
  })
);

app.get("/", async (c) => {
  await closeExpiredDailyCrowns(c.env.DB);
  const challenge = await ensureDailyChallenge(c.env.DB);
  const user = c.get("user");

  return c.html(
    <Layout title="WikiRace" user={user}>
      <section class="hero">
        <p class="eyebrow">Wikipedia racing</p>
        <h1>Reach the target article in the fewest clicks and the fastest time.</h1>
        <p>
          Shared daily routes reset at noon UTC. Freeplay spins up a new random pair
          you can share with anyone.
        </p>
        <div class="hero-actions">
          <a href="/play/daily">
            <button type="button">Play today&apos;s challenge</button>
          </a>
          {user ? (
            <a class="secondary-link" href="/play/free">
              Start freeplay
            </a>
          ) : (
            <a class="secondary-link" href="/auth/register">
              Create account
            </a>
          )}
        </div>
        <div class="challenge-card-grid">
          <div class="challenge-mini-card">
            <p class="eyebrow">Today</p>
            <strong>{challenge.start_article}</strong>
            <p>to</p>
            <strong>{challenge.end_article}</strong>
          </div>
          <div class="challenge-mini-card">
            <p class="eyebrow">How scoring works</p>
            <p>Timer starts on your first click. Leaderboards use your best completed run.</p>
          </div>
          <div class="challenge-mini-card">
            <p class="eyebrow">Crown</p>
            <p>The crown leaderboard tracks total time spent in first place on dailies.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
});

app.get("/wiki/:title", async (c) => {
  const article = await fetchSanitizedArticle(c.req.param("title"));
  const user = c.get("user");

  return c.html(
    <Layout title={article.displayTitle} user={user}>
      <section class="stack-block">
        <p class="eyebrow">Fallback article view</p>
        <h1>{article.displayTitle}</h1>
        <p class="muted">
          In-game article clicks should load inline without leaving the challenge.
        </p>
        <ArticleView html={article.html} />
      </section>
    </Layout>
  );
});

app.route("/auth", authRoutes);
app.route("/api", apiRoutes);
app.route("/play", gameRoutes);
app.route("/leaderboard", leaderboardRoutes);
app.route("/crown", crownRoutes);

export default app;
