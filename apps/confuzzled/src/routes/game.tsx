/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import {
  getPuzzleById,
  getPuzzleLeaderboard,
  getUserSolve
} from "../db/queries";
import type { MathPuzzleGrid } from "../lib/mathpuzzle";
import { getPuzzleTypeDef } from "../lib/puzzle-types";
import { ensureDailyPuzzles } from "../lib/seed";
import { formatDateKey } from "../lib/time";
import type { AppVars, Bindings, PuzzleRow } from "../types";

const game = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

// ── Daily redirect ──────────────────────────────────────────────

game.get("/daily", async (c) => {
  const puzzles = await ensureDailyPuzzles(c.env.DB);
  const puzzle = puzzles[0];
  if (!puzzle) return c.notFound();
  return c.redirect(`/play/${puzzle.id}`);
});

// ── Individual puzzle page ──────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  algebra: "Algebra",
  "number-theory": "Number Theory",
  combinatorics: "Combinatorics",
  geometry: "Geometry"
};

function GamePage({
  puzzle,
  user,
  leaderboard,
  alreadySolved
}: {
  puzzle: PuzzleRow;
  user: AppVars["user"];
  leaderboard: Awaited<ReturnType<typeof getPuzzleLeaderboard>>;
  alreadySolved: boolean;
}) {
  const def = getPuzzleTypeDef(puzzle.type);
  const gridData = JSON.parse(puzzle.grid) as MathPuzzleGrid;

  const subtitle = puzzle.daily_date
    ? formatDateKey(puzzle.daily_date)
    : "Practice";

  const diffStars = "★".repeat(Math.min(gridData.difficulty, 5));
  const catClass = `math-category math-category--${gridData.category}`;

  return (
    <Layout
      title={`Daily Challenge / confuzzled`}
      user={user}
      head={<script defer src="/static/game-math.js"></script>}
    >
      <div class="wrap page-content">
        <section
          class="pz-shell"
          data-puzzle-id={puzzle.id}
          data-puzzle-type={puzzle.type}
          data-grid={puzzle.grid}
          data-grid-width={puzzle.width}
          data-grid-height={puzzle.height}
        >
          <div class="pz-topline">
            <div class="pz-bar">
              <span class="label">{subtitle}</span>
              <h1 class="pz-title">{def?.displayName || "Daily Challenge"}</h1>
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
              You need an account to submit solves. You can still work on it.
            </p>
          )}

          {alreadySolved && (
            <div class="result-banner">
              You already solved this puzzle!
            </div>
          )}

          {!alreadySolved && (
            <div id="game-result" class="result-banner hidden" />
          )}

          <div class="math-problem">
            <span class={catClass}>
              {CATEGORY_LABELS[gridData.category] || gridData.category}
            </span>
            <span class="diff-stars" title={`Difficulty: ${gridData.difficulty}/5`}>
              {" "}{diffStars}
            </span>

            <div class="math-statement">
              {gridData.statement}
            </div>
          </div>

          {!alreadySolved && (
            <div class="math-answer-row">
              <input
                type="text"
                id="math-answer"
                class="math-input"
                placeholder="Enter your answer (e.g. 42 or 3/4)"
                autocomplete="off"
                spellcheck={false}
              />
              <button type="button" id="math-submit" class="math-submit">
                Submit
              </button>
            </div>
          )}

          <div class="math-meta">
            {!alreadySolved && (
              <span>Attempts: <strong id="attempts-count">0</strong></span>
            )}
          </div>

          <div class="pz-actions">
            <button
              type="button"
              id="pz-reset"
              class="btn btn--ghost btn--sm"
            >
              Clear
            </button>
          </div>

          <MathRules />

          <aside class="pz-side">
            <h3 class="pz-side-heading">Fastest Solves</h3>
            <Leaderboard entries={leaderboard} />
          </aside>
        </section>
      </div>

      <footer class="footer">
        <div class="wrap">
          <p>competition math. one problem a day.</p>
        </div>
      </footer>
    </Layout>
  );
}

function MathRules() {
  return (
    <div id="pz-rules" class="pz-rules">
      <h3>How It Works</h3>
      <ol class="pz-rules-list">
        <li>
          Read the problem carefully. It's a <strong>competition math</strong> problem
          — no tricks, just math.
        </li>
        <li>
          Enter your answer as an <strong>integer</strong> (e.g. <code>42</code>) or
          a <strong>simplified fraction</strong> (e.g. <code>3/4</code>).
        </li>
        <li>
          The timer starts when the page loads. Solve as fast as you can.
        </li>
        <li>
          Wrong answers don't end the game — keep trying. But the clock keeps running.
        </li>
      </ol>
    </div>
  );
}

// ── Routes ──────────────────────────────────────────────────────

game.get("/:puzzleId", async (c) => {
  const puzzle = await getPuzzleById(c.env.DB, c.req.param("puzzleId"));
  if (!puzzle) return c.notFound();

  const user = c.get("user");
  const leaderboard = await getPuzzleLeaderboard(c.env.DB, puzzle.id);
  const alreadySolved = user
    ? !!(await getUserSolve(c.env.DB, puzzle.id, user.id))
    : false;

  return c.html(
    <GamePage
      puzzle={puzzle}
      user={user}
      leaderboard={leaderboard}
      alreadySolved={alreadySolved}
    />
  );
});

export default game;
