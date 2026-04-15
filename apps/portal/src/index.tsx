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
          <p>more games soon. probably. · <a href="/privacy">privacy</a></p>
        </div>
      </footer>
    </Layout>
  );
});

app.get("/privacy", (c) => {
  const user = c.get("user");
  return c.html(
    <Layout title="privacy / kcodes games" user={user}>
      <div class="wrap page-content privacy-page">
        <h1>Privacy Policy</h1>
        <p class="privacy-updated">Last updated: April 14, 2026</p>

        <h2>What we collect</h2>
        <p>
          When you create an account, we store your username, email (if you
          provide one), and a hashed version of your password. We never store
          your password in plain text.
        </p>
        <p>
          When you play games, we store your solve times and answers so we can
          show leaderboards. That is it. We do not track what pages you visit,
          how long you spend on the site, or anything like that.
        </p>

        <h2>Cookies</h2>
        <p>
          We use one cookie called <code>wiki_session</code>. It holds a login
          token (a JWT) so you stay logged in across all kcodes games. It is
          set on the <code>.kcodes.me</code> domain, which is why logging in on
          one game logs you in everywhere.
        </p>
        <p>
          We do not use analytics cookies, tracking cookies, or any third-party
          cookies. There is no Google Analytics, no Facebook pixel, nothing
          like that.
        </p>

        <h2>Where your data lives</h2>
        <p>
          Everything runs on Cloudflare. Your account data and game data are
          stored in a Cloudflare D1 database. The servers that handle your
          requests are Cloudflare Workers. We do not send your data to any
          other service.
        </p>
        <p>
          Cloudflare has their own privacy policy that covers how their
          infrastructure works. You can read it
          at <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">cloudflare.com/privacypolicy</a>.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell your data.</li>
          <li>We do not show ads.</li>
          <li>We do not share your information with third parties.</li>
          <li>We do not use your data for anything other than running the games.</li>
        </ul>

        <h2>Deleting your data</h2>
        <p>
          If you want your account and data deleted, email <a href="mailto:team@kcodes.me">team@kcodes.me</a> and
          we will take care of it.
        </p>

        <h2>Questions</h2>
        <p>
          If you have questions about any of this, reach out
          at <a href="mailto:team@kcodes.me">team@kcodes.me</a>.
        </p>
      </div>
      <footer class="footer">
        <div class="wrap">
          <p><a href="/">back to games</a></p>
        </div>
      </footer>
    </Layout>
  );
});

app.route("/auth", authRoutes);

export default app;
