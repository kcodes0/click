/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import { MazeView } from "../components/MazeView";
import { getMazeById } from "../db/queries";
import { parseLayout } from "../lib/maze-gen";
import { ensureDailyMaze } from "../lib/seed";
import { formatDateKey } from "../lib/time";
import type { AppVars, Bindings, MazeRow } from "../types";

const game = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

function GamePage({ maze, user }: { maze: MazeRow; user: AppVars["user"] }) {
  const layout = parseLayout(maze.layout);
  const subtitle =
    maze.type === "daily" && maze.daily_date
      ? `Daily — ${formatDateKey(maze.daily_date)}`
      : "Freeplay";

  return (
    <Layout
      title="paper maze / kcodes games"
      user={user}
      head={<script defer src="/static/game.js"></script>}
    >
      <div class="wrap page-content">
        <section
          class="maze-shell"
          data-maze-id={maze.id}
          data-layout={maze.layout}
          data-start-x={maze.start_x}
          data-start-y={maze.start_y}
          data-end-x={maze.end_x}
          data-end-y={maze.end_y}
        >
          <div class="maze-topline">
            <div class="maze-bar">
              <span class="label">{subtitle}</span>
              <h1 class="maze-title">paper maze</h1>
            </div>
            <div class="maze-stats" role="group" aria-label="Run stats">
              <div class="stat stat--timer">
                <span class="stat-label">Timer</span>
                <span class="stat-val" id="timer">0:00.00</span>
              </div>
              <div class="stat">
                <span class="stat-label">Steps</span>
                <span class="stat-val" id="step-count">0</span>
              </div>
            </div>
          </div>

          {!user && (
            <p class="error-banner">
              You need an account to submit runs. You can still explore the maze.
            </p>
          )}
          <div id="game-result" class="result-banner hidden" />

          <div class="maze-canvas">
            <MazeView
              layout={layout}
              startX={maze.start_x}
              startY={maze.start_y}
              endX={maze.end_x}
              endY={maze.end_y}
            />
          </div>

          <div class="maze-actions">
            <button type="button" id="maze-reset" class="btn btn--ghost btn--sm">
              Reset path
            </button>
          </div>
        </section>
      </div>

      <footer class="footer">
        <div class="wrap">
          <p>click adjacent cells to draw your way out.</p>
        </div>
      </footer>
    </Layout>
  );
}

game.get("/daily", async (c) => {
  const maze = await ensureDailyMaze(c.env.DB);
  return c.redirect(`/play/${maze.id}`);
});

game.get("/:mazeId", async (c) => {
  const maze = await getMazeById(c.env.DB, c.req.param("mazeId"));
  if (!maze) return c.notFound();
  return c.html(<GamePage maze={maze} user={c.get("user")} />);
});

export default game;
