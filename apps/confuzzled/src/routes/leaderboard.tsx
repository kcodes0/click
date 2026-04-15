/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import { getCrownLeaderboard, getDailyCombinedLeaderboard } from "../db/queries";
import { formatDateKey, formatDuration, getDailyDateKey } from "../lib/time";
import type { AppVars, Bindings } from "../types";

const lb = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

function timeOrDash(ms: number | null): string {
  return ms != null ? formatDuration(ms) : "-";
}

lb.get("/", async (c) => {
  const user = c.get("user");
  const dateKey = getDailyDateKey();
  const [crowns, today] = await Promise.all([
    getCrownLeaderboard(c.env.DB),
    getDailyCombinedLeaderboard(c.env.DB, dateKey)
  ]);

  return c.html(
    <Layout title="leaderboard / confuzzled" user={user}>
      <div class="wrap page-content">
        <div class="lb-page">
          <h1 class="lb-title">Leaderboard</h1>

          <div class="lb-split">
            <div class="lb-col">
              <h2 class="lb-section">Today — {formatDateKey(dateKey)}</h2>
              <table class="board-table board-table--wide">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>7x7</th>
                    <th>9x9</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {today.length ? (
                    today.map((e, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{e.username}</td>
                        <td>{timeOrDash(e.icebarnTimeMs)}</td>
                        <td>{timeOrDash(e.icebarnLgTimeMs)}</td>
                        <td>{formatDuration(e.totalTimeMs)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No solves yet today.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div class="lb-col">
              <h2 class="lb-section">All-Time Crowns</h2>
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
                      <td colSpan={3}>No crowns yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p class="lb-sub">Fastest solve on a puzzle = 1 crown.</p>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="wrap"><p>fastest solver takes the crown.</p></div>
      </footer>
    </Layout>
  );
});

export default lb;
