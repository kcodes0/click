/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { authMiddleware } from "@kcodes/auth";
import { ArticleView } from "./components/ArticleView";
import { Layout } from "./components/Layout";
import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";
import gameRoutes from "./routes/game";
import leaderboardRoutes, { crown as crownRoutes } from "./routes/leaderboard";
import { ensureDailyChallenge } from "./lib/seed";
import { closeExpiredDailyCrowns } from "./lib/crown";
import { getCachedSanitizedArticle } from "./lib/wikipedia";
import type { AppVars, Bindings } from "./types";
import { GAME_JS } from "./static/assets";
import HERO_IMG from "./static/hero.jpg";
import PAPERNOTES_REGULAR from "@kcodes/ui/fonts/papernotes-regular.woff2";
import PAPERNOTES_BOLD from "@kcodes/ui/fonts/papernotes-bold.woff2";
import POPPIN_REGULAR from "@kcodes/ui/fonts/poppin-regular.ttf";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

app.get("/static/game.js", (c) =>
  c.body(GAME_JS, 200, {
    "content-type": "application/javascript; charset=utf-8",
    "cache-control": "public, max-age=3600"
  })
);

app.get("/static/hero.jpg", (c) =>
  c.body(HERO_IMG, 200, {
    "content-type": "image/jpeg",
    "cache-control": "public, max-age=86400"
  })
);

const FONT_CACHE = "public, max-age=31536000, immutable";

app.get("/static/fonts/papernotes-regular.woff2", (c) =>
  c.body(PAPERNOTES_REGULAR, 200, {
    "content-type": "font/woff2",
    "cache-control": FONT_CACHE
  })
);

app.get("/static/fonts/papernotes-bold.woff2", (c) =>
  c.body(PAPERNOTES_BOLD, 200, {
    "content-type": "font/woff2",
    "cache-control": FONT_CACHE
  })
);

app.get("/static/fonts/poppin-regular.ttf", (c) =>
  c.body(POPPIN_REGULAR, 200, {
    "content-type": "font/ttf",
    "cache-control": FONT_CACHE
  })
);

app.get("/", async (c) => {
  await closeExpiredDailyCrowns(c.env.DB);
  const challenge = await ensureDailyChallenge(c.env.DB);
  const user = c.get("user");

  return c.html(
    <Layout title="click!" user={user}>
      <section class="hero">
        <div class="wrap hero-inner">
          <span class="label">~ wikipedia racing ~</span>
          <h1>
            <span class="wobble-1">Get from</span><br />
            <span class="wobble-2">A to B.</span><br />
            <span class="wobble-3">Click <em>fast.</em></span><br />
            <span class="wobble-4">Click <em>smart.</em></span>
          </h1>
          <p class="hero-desc">
            A new route drops every day at noon UTC.
            Or spin up a random one and race your friends!
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
      </section>

      <section class="board">
        <div class="wrap board-grid">
          <div class="board-item">
            <span class="label label--sm">today&apos;s route &darr;</span>
            <div class="route">
              <strong>{challenge.start_article}</strong>
              <span class="route-arrow">~&gt;</span>
              <strong>{challenge.end_article}</strong>
            </div>
          </div>
          <div class="board-item">
            <span class="label label--sm label--dark">scoring!!</span>
            <p>Timer starts on your first click. Best run wins. Easy peasy.</p>
          </div>
          <div class="board-item">
            <span class="label label--sm label--dark">the crown ✦</span>
            <p>Hold #1 on dailies. Stack crown time. Flex on everyone.</p>
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
  const articleCache = await caches.open("wiki-articles");
  const renderer = c.req.query("legacy") === "1" ? "legacy" : "experimental";
  const article = await getCachedSanitizedArticle(c.req.param("title"), {
    cache: articleCache,
    cacheUrlBase: c.req.url,
    waitUntil: (promise) => c.executionCtx.waitUntil(promise),
    renderer
  });
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
