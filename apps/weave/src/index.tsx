/** @jsxImportSource hono/jsx */
import { authMiddleware } from "@kcodes/auth";
import { mountUiAssets } from "@kcodes/ui";
import { Hono } from "hono";
import { Layout } from "./components/Layout";
import apiRoutes from "./routes/api";
import gameRoutes from "./routes/game";
import DICTIONARY_TXT from "./static/dictionary.txt";
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

// Ship the full Big Boggle dictionary to the client so the game can
// reject non-words the moment the player traces them, instead of waiting
// for the end-of-run server validation. Aggressively cached so most
// players pay the ~600KB gzipped fetch exactly once per browser.
app.get("/static/dictionary.txt", (c) =>
  c.body(DICTIONARY_TXT, 200, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "public, max-age=31536000, immutable"
  })
);

app.get("/", (c) => {
  const user = c.get("user");

  return c.html(
    <Layout title="letter weave / kcodes games" user={user}>
      <section class="weave-hero">
        <div class="wrap">
          <h1>
            <span class="wob-1">letter</span> <span class="wob-2">weave</span>
          </h1>
          <p>
            A fresh 5×5 Boggle-style grid drops every day. You get 3 minutes to find every word you can by tracing adjacent letters. Race friends live or grind the daily on your own time.
          </p>
          <div>
            <a href="/play/daily" class="btn">Play today&apos;s</a>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="wrap">
          <p>trace long words for big points. you know more than you think.</p>
        </div>
      </footer>
    </Layout>
  );
});

app.route("/play", gameRoutes);
app.route("/api", apiRoutes);

export default app;
