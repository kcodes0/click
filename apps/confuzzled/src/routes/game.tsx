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

          <div class="pz-actions">
            <button
              type="button"
              id="pz-reset"
              class="btn btn--ghost btn--sm"
            >
              Reset
            </button>
            <button
              type="button"
              id="pz-help"
              class="pz-help-btn"
              aria-label="How to play"
              aria-expanded="false"
              aria-controls="pz-rules"
            >
              ?
            </button>
          </div>

          <div id="pz-rules" class="pz-rules hidden">
            <h3>How to play — Light Up</h3>
            <ul>
              <li>
                <strong>Tap</strong> an empty cell to place a light bulb. Tap
                again to mark it X (no bulb). Tap once more to clear.
              </li>
              <li>
                Each bulb lights its entire row and column until blocked by a
                wall. <strong>Every</strong> white cell must be illuminated.
              </li>
              <li>
                No two bulbs may see each other — if they share a row or column
                with no wall between them, that's a conflict.
              </li>
              <li>
                Numbers on walls tell you <strong>exactly</strong> how many of
                the 4 adjacent cells (up/down/left/right) contain a bulb.
                Walls without numbers have no constraint.
              </li>
              <li>
                The puzzle is solved when every cell is lit, every number is
                satisfied, and no bulbs conflict. Your time is locked on
                completion.
              </li>
            </ul>
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
