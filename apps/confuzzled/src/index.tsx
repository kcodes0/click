/** @jsxImportSource hono/jsx */
import { authMiddleware } from "@kcodes/auth";
import { mountUiAssets } from "@kcodes/ui";
import { Hono } from "hono";
import { Layout } from "./components/Layout";
import apiRoutes from "./routes/api";
import gameRoutes from "./routes/game";
import { GAME_AKARI_JS } from "./static/game-akari";
import { GAME_FROST_JS } from "./static/game-frost";
import { GAME_SIGNAL_JS } from "./static/game-signal";
import type { AppVars, Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

mountUiAssets(app);

const JS_HEADERS = {
  "content-type": "application/javascript; charset=utf-8",
  "cache-control": "public, max-age=3600"
};

app.get("/static/game-akari.js", (c) => c.body(GAME_AKARI_JS, 200, JS_HEADERS));
app.get("/static/game-signal.js", (c) => c.body(GAME_SIGNAL_JS, 200, JS_HEADERS));
app.get("/static/game-frost.js", (c) => c.body(GAME_FROST_JS, 200, JS_HEADERS));

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
            3 fresh logic puzzles drop every day at noon UTC. Medium, Hard, and
            Super Hard. Solve all three for the best leaderboard time.
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

app.route("/play", gameRoutes);
app.route("/api", apiRoutes);

export default app;
