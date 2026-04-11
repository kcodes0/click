/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import { LetterGrid } from "../components/LetterGrid";
import { getWeaveById, getWeaveLeaderboard } from "../db/queries";
import { parseBoard } from "../lib/board-gen";
import { ensureDailyWeave } from "../lib/seed";
import { formatDateKey } from "../lib/time";
import type { AppVars, Bindings, WeaveRow } from "../types";

const game = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

function GamePage({
  weave,
  user,
  leaderboard
}: {
  weave: WeaveRow;
  user: AppVars["user"];
  leaderboard: Awaited<ReturnType<typeof getWeaveLeaderboard>>;
}) {
  const board = parseBoard(weave.board);
  const subtitle =
    weave.type === "daily" && weave.daily_date
      ? `Daily — ${formatDateKey(weave.daily_date)}`
      : "Freeplay";

  return (
    <Layout
      title="letter weave / kcodes games"
      user={user}
      head={<script defer src="/static/game.js"></script>}
    >
      <div class="wrap page-content">
        <section
          class="weave-shell"
          data-weave-id={weave.id}
          data-board={weave.board}
          data-grid-width={board.width}
          data-grid-height={board.height}
        >
          <div class="weave-topline">
            <div class="weave-bar">
              <span class="label">{subtitle}</span>
              <h1 class="weave-title">letter weave</h1>
            </div>
            <div class="weave-stats" role="group" aria-label="Run stats">
              <div class="stat stat--timer">
                <span class="stat-label">Timer</span>
                <span class="stat-val" id="timer">3:00.00</span>
              </div>
              <div class="stat stat--score">
                <span class="stat-label">Score</span>
                <span class="stat-val" id="score">0</span>
              </div>
              <div class="stat">
                <span class="stat-label">Words</span>
                <span class="stat-val" id="word-count">0</span>
              </div>
            </div>
          </div>

          {!user && (
            <p class="error-banner">
              You need an account to submit runs. You can still explore the grid.
            </p>
          )}
          <div id="game-result" class="result-banner hidden" />

          <div class="weave-canvas">
            <LetterGrid board={board} />
          </div>

          <div class="weave-current">
            <div class="weave-current-text">
              <span
                class="weave-current-word weave-current-word--empty"
                id="weave-current"
              >
                tap or drag letters
              </span>
              <span class="weave-current-hint" id="weave-hint">
                release a drag to submit, or use the button
              </span>
            </div>
            <button
              type="button"
              id="weave-submit"
              class="weave-current-submit"
            >
              Submit
            </button>
          </div>

          <div class="weave-actions">
            <button
              type="button"
              id="weave-clear"
              class="btn btn--ghost btn--sm"
            >
              Clear
            </button>
            <button
              type="button"
              id="weave-finish"
              class="btn btn--ghost btn--sm"
            >
              Finish run
            </button>
            <button
              type="button"
              id="weave-help"
              class="weave-help-btn"
              aria-label="How to play"
              aria-expanded="false"
              aria-controls="weave-rules"
            >
              ?
            </button>
          </div>

          <div id="weave-rules" class="weave-rules hidden">
            <h3>How to play</h3>
            <ul>
              <li><strong>Drag</strong> across adjacent letters to trace a word, then release — it auto-submits if it's 4+ letters and in the dictionary.</li>
              <li>Or <strong>tap</strong> letters one at a time and hit Enter / <em>Submit word</em> when you're done. Each next tile must touch the previous one (horizontal, vertical, or diagonal).</li>
              <li>You can't reuse the same tile within a single word. Drag back over your trail to undo the tail.</li>
              <li>Minimum 4 letters. Longer words are worth way more — 8+ letters gets you 11 points.</li>
              <li>You get 3 minutes. The run auto-submits when time runs out, or tap <em>Finish run</em> to send it early.</li>
            </ul>
          </div>

          <section class="weave-words">
            <h3 class="weave-words-heading">Found words</h3>
            <ul class="weave-words-list" id="weave-words">
              <li class="weave-words-empty">none yet</li>
            </ul>
          </section>

          <aside class="weave-side">
            <h3 class="weave-side-heading">Best Runs</h3>
            <Leaderboard entries={leaderboard} />
          </aside>
        </section>
      </div>

      <footer class="footer">
        <div class="wrap">
          <p>every tile matters. you got 3 minutes.</p>
        </div>
      </footer>
    </Layout>
  );
}

game.get("/daily", async (c) => {
  const weave = await ensureDailyWeave(c.env.DB);
  return c.redirect(`/play/${weave.id}`);
});

game.get("/:weaveId", async (c) => {
  const weave = await getWeaveById(c.env.DB, c.req.param("weaveId"));
  if (!weave) return c.notFound();
  const leaderboard = await getWeaveLeaderboard(c.env.DB, weave.id);
  return c.html(
    <GamePage weave={weave} user={c.get("user")} leaderboard={leaderboard} />
  );
});

export default game;
