/** @jsxImportSource hono/jsx */
import { authMiddleware } from "@kcodes/auth";
import { mountUiAssets } from "@kcodes/ui";
import { Hono } from "hono";
import { Layout } from "./components/Layout";
import authRoutes from "./routes/auth";
import type { AppVars, Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

app.use("*", authMiddleware);

mountUiAssets(app);

type GameCard = {
  href: string;
  title: string;
  bang: string;
  tag: string;
  desc: string;
  meta: string;
  status: "live" | "soon";
};

// Hardcoded list for now. The portal stays fast and dumb — adding a game
// is a one-line edit here, no DB lookup needed.
const GAMES: GameCard[] = [
  {
    href: "https://click.kcodes.me",
    title: "click",
    bang: "!",
    tag: "wikipedia racing",
    desc: "Get from one Wikipedia article to another in as few clicks as possible. Daily route + freeplay.",
    meta: "live · daily challenge",
    status: "live"
  },
  {
    href: "https://confuzzled.kcodes.me",
    title: "confuzzled",
    bang: "!",
    tag: "path puzzles",
    desc: "2 hard Icebarn path puzzles daily — navigate ice, follow arrows, find the only valid route. Inspired by BmMT.",
    meta: "live · daily challenge",
    status: "live"
  }
];

app.get("/", (c) => {
  const user = c.get("user");

  return c.html(
    <Layout title="kcodes games" user={user}>
      <section class="portal-hero">
        <div class="wrap">
          <h1>
            <span class="wob-1">kcodes</span> <span class="wob-2">games</span>
          </h1>
          <p>
            tiny browser games. one account works across all of them. play with friends, or grind the daily on your own time.
          </p>
        </div>
      </section>

      <section class="wrap">
        <div class="portal-grid">
          {GAMES.map((game) => (
            <a
              href={game.href}
              class={`game-card${game.status === "soon" ? " game-card--soon" : ""}`}
            >
              <span class="game-card-tag">{game.tag}</span>
              <span class="game-card-title">
                {game.title}
                <span class="bang">{game.bang}</span>
              </span>
              <p class="game-card-desc">{game.desc}</p>
              <div class="game-card-meta">{game.meta}</div>
            </a>
          ))}
        </div>
      </section>

      <footer class="footer">
        <div class="wrap">
          <p>more games soon. probably.</p>
        </div>
      </footer>
    </Layout>
  );
});

app.route("/auth", authRoutes);

export default app;
