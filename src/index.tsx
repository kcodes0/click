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
      <section class="hero">
        <div class="hero-text">
          <span class="label">Wikipedia racing</span>
          <h1>
            Get from<br />
            A to B.<br />
            Click <em>fast.</em><br />
            Click <em>smart.</em>
          </h1>
          <p class="hero-desc">
            A new route drops every day at noon UTC.
            Or spin up a random one and race your friends.
          </p>
          <div class="hero-btns">
            <a href="/play/daily" class="btn">Play today&apos;s</a>
            {user ? (
              <a class="btn btn--ghost" href="/play/free">Freeplay</a>
            ) : (
              <a class="btn btn--ghost" href="/auth/register">Sign up</a>
            )}
          </div>
        </div>
        <div class="hero-img" />
      </section>

      <section class="board">
        <div class="wrap board-grid">
          <div class="card card--route">
            <span class="label label--sm">Today&apos;s route</span>
            <div class="route">
              <strong>{challenge.start_article}</strong>
              <span class="route-arrow">&rarr;</span>
              <strong>{challenge.end_article}</strong>
            </div>
          </div>
          <div class="card card--yellow card--tilt-l">
            <span class="label label--sm label--dark">Scoring</span>
            <p>Timer starts on first click. Best run wins.</p>
          </div>
          <div class="card card--peach card--tilt-r">
            <span class="label label--sm label--dark">Crown</span>
            <p>Hold #1 on dailies. Stack crown time. Flex.</p>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="wrap">
          <p>you&apos;re not lost, you&apos;re exploring. probably.</p>
        </div>
      </footer>
    </Layout>
  );
});

app.get("/wiki/:title", async (c) => {
  const article = await fetchSanitizedArticle(c.req.param("title"));
  const user = c.get("user");

  return c.html(
    <Layout title={article.displayTitle} user={user}>
      <div class="wrap page-content">
        <span class="label">Fallback article view</span>
        <h1>{article.displayTitle}</h1>
        <p class="sub">
          In-game article clicks load inline without leaving the challenge.
        </p>
        <ArticleView html={article.html} />
      </div>
    </Layout>
  );
});

app.route("/auth", authRoutes);
app.route("/api", apiRoutes);
app.route("/play", gameRoutes);
app.route("/leaderboard", leaderboardRoutes);
app.route("/crown", crownRoutes);

export default app;
