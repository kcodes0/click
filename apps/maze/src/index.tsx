/** @jsxImportSource hono/jsx */
import { authMiddleware } from "@kcodes/auth";
import { mountUiAssets } from "@kcodes/ui";
import { Hono } from "hono";
import { Layout } from "./components/Layout";
import type { AppVars, Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

mountUiAssets(app);

app.get("/", (c) => {
  const user = c.get("user");

  return c.html(
    <Layout title="maze? / kcodes games" user={user}>
      <section class="maze-hero">
        <div class="wrap">
          <h1>
            <span class="wob-1">paper</span> <span class="wob-2">maze</span>
          </h1>
          <p>
            A new hand-drawn maze drops every day. Race the clock, race your friends, or just doodle through it whenever.
          </p>
          <div>
            <span class="maze-coming-soon">~ coming soon ~</span>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="wrap">
          <p>still drawing the walls. check back!</p>
        </div>
      </footer>
    </Layout>
  );
});

export default app;
