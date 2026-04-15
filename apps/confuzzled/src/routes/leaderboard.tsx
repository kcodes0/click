/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import { getCrownLeaderboard } from "../db/queries";
import type { AppVars, Bindings } from "../types";

const lb = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

lb.get("/", async (c) => {
  const user = c.get("user");
  const crowns = await getCrownLeaderboard(c.env.DB);

  return c.html(
    <Layout title="leaderboard / confuzzled" user={user}>
      <div class="wrap page-content">
        <div class="lb-page">
          <h1 class="lb-title">Leaderboard</h1>
          <p class="lb-sub">
            Each day has 2 puzzles. Fastest solve on any puzzle earns a crown
            for that puzzle. More crowns = more days at #1.
          </p>

          <h2 class="lb-section">Crown Leaders</h2>
          <table class="board-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Crowns</th>
              </tr>
            </thead>
            <tbody>
              {crowns.length ? (
                crowns.map((e, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{e.username}</td>
                    <td>{e.crowns}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No crowns yet. Be the first!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <footer class="footer">
        <div class="wrap"><p>fastest solver takes the crown.</p></div>
      </footer>
    </Layout>
  );
});

export default lb;
