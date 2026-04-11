/** @jsxImportSource hono/jsx */
import { authMiddleware } from "@kcodes/auth";
import { mountUiAssets } from "@kcodes/ui";
import { Hono } from "hono";
import { Layout } from "./components/Layout";
import apiRoutes from "./routes/api";
import gameRoutes from "./routes/game";
import { GAME_JS } from "./static/game";
import type { AppVars, Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

mountUiAssets(app);

app.get("/static/game.js", (c) =>
  c.body(GAME_JS, 200, {
    "content-type": "application/javascript; charset=utf-8",
    "cache-control": "public, max-age=3600"
  })
);

app.get("/", (c) => {
  const user = c.get("user");

  return c.html(
    <Layout title="paper maze / kcodes games" user={user}>
      <section class="maze-hero">
        <div class="wrap">
          <h1>
            <span class="wob-1">paper</span> <span class="wob-2">maze</span>
          </h1>
          <p>
            A new hand-drawn maze drops every day. Race the clock, race your friends, or just doodle through it whenever.
          </p>
          <div>
            <a href="/play/daily" class="btn">Play today&apos;s</a>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="wrap">
          <p>click adjacent cells to draw your way through.</p>
        </div>
      </footer>
    </Layout>
  );
});

app.route("/play", gameRoutes);
app.route("/api", apiRoutes);

export default app;
