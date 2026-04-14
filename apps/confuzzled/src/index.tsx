/** @jsxImportSource hono/jsx */
import { authMiddleware } from "@kcodes/auth";
import { mountUiAssets } from "@kcodes/ui";
import { Hono } from "hono";
import { Layout } from "./components/Layout";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";
import { GAME_NONOGRAM_JS } from "./static/game-nonogram";
import { GAME_STARBATTLE_JS } from "./static/game-starbattle";
import { GAME_TENTS_JS } from "./static/game-tents";
import type { AppVars, Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

mountUiAssets(app);

const JS_HEADERS = {
  "content-type": "application/javascript; charset=utf-8",
  "cache-control": "public, max-age=3600"
};

app.get("/static/game-nonogram.js", (c) => c.body(GAME_NONOGRAM_JS, 200, JS_HEADERS));
app.get("/static/game-starbattle.js", (c) => c.body(GAME_STARBATTLE_JS, 200, JS_HEADERS));
app.get("/static/game-tents.js", (c) => c.body(GAME_TENTS_JS, 200, JS_HEADERS));

app.get("/", (c) => {
  const user = c.get("user");

  return c.html(
    <Layout title="confuzzled / kcodes games" user={user}>
      <section class="pz-hero">
        <div class="wrap">
          <h1>
            <span class="wob-1">con</span>
            <span class="wob-2">fuzzled</span>
          </h1>
          <p>
            3 fresh spatial puzzles every day at noon UTC. Nonogram, Star Battle,
            and Tents &amp; Trees. Solve all three for the best time.
          </p>
          <div>
            <a href="/play/daily" class="btn">Play today's puzzles</a>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="wrap">
          <p>pure logic. no guessing. every cell counts.</p>
        </div>
      </footer>
    </Layout>
  );
});

app.route("/auth", authRoutes);
app.route("/play", gameRoutes);
app.route("/api", apiRoutes);

export default app;
