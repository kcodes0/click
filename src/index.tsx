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
import HERO_IMG from "./static/hero.jpg";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

app.get("/static/game.js", (c) =>
  c.body(GAME_JS, 200, {
    "content-type": "application/javascript; charset=utf-8"
  })
);

app.get("/static/hero.jpg", (c) =>
  c.body(HERO_IMG, 200, {
    "content-type": "image/jpeg",
    "cache-control": "public, max-age=86400"
  })
);

app.get("/", async (c) => {
  await closeExpiredDailyCrowns(c.env.DB);
  const challenge = await ensureDailyChallenge(c.env.DB);
  const user = c.get("user");

  return c.html(
    <Layout title="click!" user={user}>
      <div class="hero-wrap">
        <div class="hero shell">
          <span class="tag">wikipedia racing</span>
          <h1>Get from A to B.<br />Click <em>fast</em>.<br />Click <em>smart</em>.</h1>
          <p class="hero-sub">
            A new Wikipedia route drops every day at noon UTC.
            Or spin up a random one and send it to your friends.
          </p>
          <div class="hero-actions">
            <a href="/play/daily" class="btn-primary">
              Play today&apos;s challenge
            </a>
            {user ? (
              <a class="btn-outline" href="/play/free">
                Start freeplay
              </a>
            ) : (
              <a class="btn-outline" href="/auth/register">
                Create account
              </a>
            )}
          </div>
        </div>
      </div>

      <div class="pinboard">
        <div class="note note--tilt-r">
          <span class="note-label">Today&apos;s route</span>
          <div class="note-route">
            <strong>{challenge.start_article}</strong>
            <span class="note-arrow">&rarr;</span>
            <strong>{challenge.end_article}</strong>
          </div>
        </div>
        <div class="sticky sticky--1">
          <strong>Scoring</strong>
          <p>Timer starts on your first click. Leaderboards rank by best run.</p>
        </div>
        <div class="sticky sticky--2">
          <strong>Crown</strong>
          <p>Hold first place on dailies. Accumulate crown time. Flex on everyone.</p>
        </div>
      </div>
    </Layout>
  );
});

app.get("/wiki/:title", async (c) => {
  const article = await fetchSanitizedArticle(c.req.param("title"));
  const user = c.get("user");

  return c.html(
    <Layout title={article.displayTitle} user={user}>
      <section class="section-page">
        <span class="tag">Fallback article view</span>
        <h1>{article.displayTitle}</h1>
        <p class="section-sub">
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
