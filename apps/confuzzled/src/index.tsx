/** @jsxImportSource hono/jsx */
import { authMiddleware } from "@kcodes/auth";
import { mountUiAssets } from "@kcodes/ui";
import { Hono } from "hono";
import { Layout } from "./components/Layout";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";
import { GAME_MATH_JS } from "./static/game-math";
import type { AppVars, Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

mountUiAssets(app);

const JS_HEADERS = {
  "content-type": "application/javascript; charset=utf-8",
  "cache-control": "public, max-age=3600"
};

app.get("/static/game-math.js", (c) => c.body(GAME_MATH_JS, 200, JS_HEADERS));

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
            One hard math problem every day at noon UTC. Competition-style.
            Solve it fast, climb the leaderboard.
          </p>
          <div>
            <a href="/play/daily" class="btn">Solve today's problem</a>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="wrap">
          <p>inspired by math olympiad & BmMT.</p>
        </div>
      </footer>
    </Layout>
  );
});

app.route("/auth", authRoutes);
app.route("/play", gameRoutes);
app.route("/api", apiRoutes);

export default app;
