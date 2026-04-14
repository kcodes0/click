/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import { PuzzleGrid } from "../components/PuzzleGrid";
import { getPuzzleById, getPuzzleLeaderboard } from "../db/queries";
import { ensureDailyPuzzle } from "../lib/seed";
import { formatDateKey } from "../lib/time";
import type { AppVars, Bindings, PuzzleRow } from "../types";

const game = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

function GamePage({
  puzzle,
  user,
  leaderboard
}: {
  puzzle: PuzzleRow;
  user: AppVars["user"];
  leaderboard: Awaited<ReturnType<typeof getPuzzleLeaderboard>>;
}) {
  const subtitle =
    puzzle.daily_date
      ? `Daily — ${formatDateKey(puzzle.daily_date)}`
      : "Practice";

  return (
    <Layout
      title="confuzzled / kcodes games"
      user={user}
      head={<script defer src="/static/game.js"></script>}
    >
      <div class="wrap page-content">
        <section
          class="pz-shell"
          data-puzzle-id={puzzle.id}
          data-grid={puzzle.grid}
          data-grid-width={puzzle.width}
          data-grid-height={puzzle.height}
        >
          <div class="pz-topline">
            <div class="pz-bar">
              <span class="label">{subtitle}</span>
              <h1 class="pz-title">light up</h1>
            </div>
            <div class="pz-stats" role="group" aria-label="Puzzle stats">
              <div class="stat stat--timer">
                <span class="stat-label">Timer</span>
                <span class="stat-val" id="timer">0:00.00</span>
              </div>
            </div>
          </div>

          {!user && (
            <p class="error-banner">
              You need an account to submit solves. You can still play the
              puzzle.
            </p>
          )}
          <div id="game-result" class="result-banner hidden" />

          <div class="pz-canvas">
            <PuzzleGrid
              grid={puzzle.grid}
              width={puzzle.width}
              height={puzzle.height}
            />
          </div>

          <div id="pz-rules" class="pz-rules">
            <div class="pz-rules-header">
              <h3>How to play</h3>
              <button
                type="button"
                id="pz-help"
                class="pz-help-btn"
                aria-label="Toggle rules"
                aria-expanded="true"
                aria-controls="pz-rules-body"
              >
                hide
              </button>
            </div>
            <div id="pz-rules-body" class="pz-rules-body">
              <div class="pz-legend">
                <span class="pz-legend-item">
                  <span class="pz-legend-swatch pz-legend--empty" />
                  empty cell
                </span>
                <span class="pz-legend-item">
                  <span class="pz-legend-swatch pz-legend--wall" />
                  wall
                </span>
                <span class="pz-legend-item">
                  <span class="pz-legend-swatch pz-legend--num">2</span>
                  numbered wall
                </span>
                <span class="pz-legend-item">
                  <span class="pz-legend-swatch pz-legend--bulb" />
                  bulb (click 1x)
                </span>
                <span class="pz-legend-item">
                  <span class="pz-legend-swatch pz-legend--xmark" />
                  no bulb (click 2x)
                </span>
              </div>
              <ol class="pz-rules-list">
                <li>
                  Place bulbs to <strong>light up every white cell</strong>.
                  A bulb shines left, right, up, and down until it hits a wall.
                </li>
                <li>
                  <strong>No two bulbs can see each other.</strong> If two bulbs
                  share a row or column with no wall between them, that's a
                  conflict (they'll turn red).
                </li>
                <li>
                  A number on a wall means <strong>exactly that many</strong> of
                  its 4 neighbors (up/down/left/right) are bulbs. Walls without
                  a number have no constraint.
                </li>
                <li>
                  Click a cell to cycle: empty &rarr; bulb &rarr; X &rarr;
                  empty. Use X to mark cells you've ruled out.
                </li>
              </ol>
              <p class="pz-rules-goal">
                When every cell is lit with no conflicts, you win and your
                time is saved.
              </p>
            </div>
          </div>

          <div class="pz-actions">
            <button
              type="button"
              id="pz-reset"
              class="btn btn--ghost btn--sm"
            >
              Reset
            </button>
          </div>

          <aside class="pz-side">
            <h3 class="pz-side-heading">Fastest Solves</h3>
            <Leaderboard entries={leaderboard} />
          </aside>
        </section>
      </div>

      <footer class="footer">
        <div class="wrap">
          <p>every bulb matters. light it all up.</p>
        </div>
      </footer>
    </Layout>
  );
}

game.get("/daily", async (c) => {
  const puzzle = await ensureDailyPuzzle(c.env.DB);
  return c.redirect(`/play/${puzzle.id}`);
});

game.get("/:puzzleId", async (c) => {
  const puzzle = await getPuzzleById(c.env.DB, c.req.param("puzzleId"));
  if (!puzzle) return c.notFound();
  const leaderboard = await getPuzzleLeaderboard(c.env.DB, puzzle.id);
  return c.html(
    <GamePage
      puzzle={puzzle}
      user={c.get("user")}
      leaderboard={leaderboard}
    />
  );
});

export default game;
