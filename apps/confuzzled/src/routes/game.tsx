/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { DailyHub } from "../components/DailyHub";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import { NonogramGrid } from "../components/NonogramGrid";
import { StarBattleGrid } from "../components/StarBattleGrid";
import { TentsGrid } from "../components/TentsGrid";
import {
  getDailyCombinedLeaderboard,
  getPuzzleById,
  getPuzzleLeaderboard,
  getUserSolve
} from "../db/queries";
import type { NonogramData } from "../lib/nonogram";
import { getPuzzleTypeDef } from "../lib/puzzle-types";
import { ensureDailyPuzzles } from "../lib/seed";
import type { StarBattleData } from "../lib/starbattle";
import type { TentsData } from "../lib/tents";
import { formatDateKey, getDailyDateKey } from "../lib/time";
import type { AppVars, Bindings, PuzzleRow, PuzzleSolveRow } from "../types";

const game = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

game.get("/daily", async (c) => {
  const user = c.get("user");
  const puzzles = await ensureDailyPuzzles(c.env.DB);
  const dateKey = getDailyDateKey();
  const leaderboard = await getDailyCombinedLeaderboard(c.env.DB, dateKey);

  const solves = new Map<string, PuzzleSolveRow>();
  if (user) {
    for (const p of puzzles) {
      const s = await getUserSolve(c.env.DB, p.id, user.id);
      if (s) solves.set(p.id, s);
    }
  }

  return c.html(
    <Layout title="confuzzled / daily puzzles" user={user}>
      <div class="wrap page-content">
        <DailyHub
          dateKey={dateKey}
          puzzles={puzzles}
          solves={solves}
          leaderboard={leaderboard}
          user={user}
        />
      </div>
      <footer class="footer">
        <div class="wrap">
          <p>3 puzzles. pure spatial logic. no guessing.</p>
        </div>
      </footer>
    </Layout>
  );
});

function GamePage({
  puzzle,
  user,
  leaderboard
}: {
  puzzle: PuzzleRow;
  user: AppVars["user"];
  leaderboard: Awaited<ReturnType<typeof getPuzzleLeaderboard>>;
}) {
  const def = getPuzzleTypeDef(puzzle.type);
  const subtitle = puzzle.daily_date
    ? `${def?.difficulty || ""} — ${formatDateKey(puzzle.daily_date)}`
    : "Practice";
  const scriptSrc = `/static/game-${puzzle.type}.js`;

  return (
    <Layout
      title={`${def?.displayName || puzzle.type} / confuzzled`}
      user={user}
      head={<script defer src={scriptSrc}></script>}
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
              <h1 class="pz-title">{def?.displayName || puzzle.type}</h1>
            </div>
            <div class="pz-stats" role="group">
              <div class="stat stat--timer">
                <span class="stat-label">Timer</span>
                <span class="stat-val" id="timer">0:00.00</span>
              </div>
            </div>
          </div>

          {!user && (
            <p class="error-banner">
              You need an account to submit solves. You can still play.
            </p>
          )}
          <div id="game-result" class="result-banner hidden" />

          <div class="pz-canvas">
            {puzzle.type === "nonogram" && (
              <NonogramGrid gridData={JSON.parse(puzzle.grid) as NonogramData} />
            )}
            {puzzle.type === "starbattle" && (
              <StarBattleGrid gridData={JSON.parse(puzzle.grid) as StarBattleData} />
            )}
            {puzzle.type === "tents" && (
              <TentsGrid gridData={JSON.parse(puzzle.grid) as TentsData} />
            )}
          </div>

          <div class="pz-actions">
            <button type="button" id="pz-reset" class="btn btn--ghost btn--sm">Reset</button>
            {puzzle.daily_date && (
              <a href="/play/daily" class="btn btn--ghost btn--sm">Back to hub</a>
            )}
          </div>

          {puzzle.type === "nonogram" && <NonogramRules />}
          {puzzle.type === "starbattle" && <StarBattleRules />}
          {puzzle.type === "tents" && <TentsRules />}

          <aside class="pz-side">
            <h3 class="pz-side-heading">Fastest Solves</h3>
            <Leaderboard entries={leaderboard} />
          </aside>
        </section>
      </div>
      <footer class="footer"><div class="wrap"><p>every cell counts.</p></div></footer>
    </Layout>
  );
}

function NonogramRules() {
  return (
    <div id="pz-rules" class="pz-rules">
      <h3>Nonogram</h3>
      <ol class="pz-rules-list">
        <li>Numbers on each row/column tell you the lengths of <strong>consecutive filled blocks</strong>.</li>
        <li>Blocks are separated by <strong>at least one empty cell</strong>.</li>
        <li>Click to fill. Right-click to mark empty.</li>
        <li>Puzzle auto-submits when the grid matches the clues.</li>
      </ol>
    </div>
  );
}

function StarBattleRules() {
  return (
    <div id="pz-rules" class="pz-rules">
      <h3>Star Battle</h3>
      <ol class="pz-rules-list">
        <li>Place exactly <strong>1 star per row</strong>, <strong>1 per column</strong>, and <strong>1 per colored region</strong>.</li>
        <li><strong>No two stars can touch</strong> — not even diagonally.</li>
        <li>Click a cell to place or remove a star.</li>
        <li>Puzzle auto-submits when all stars are correctly placed.</li>
      </ol>
    </div>
  );
}

function TentsRules() {
  return (
    <div id="pz-rules" class="pz-rules">
      <h3>Tents &amp; Trees</h3>
      <ol class="pz-rules-list">
        <li>Place one <strong>tent next to each tree</strong> (up/down/left/right). Each tree gets one tent.</li>
        <li><strong>No two tents can touch</strong> — not even diagonally.</li>
        <li>Row/column numbers show <strong>how many tents</strong> belong there.</li>
        <li>Click to cycle: empty → tent → grass → empty. Right-click for grass.</li>
      </ol>
    </div>
  );
}

game.get("/:puzzleId", async (c) => {
  const puzzle = await getPuzzleById(c.env.DB, c.req.param("puzzleId"));
  if (!puzzle) return c.notFound();
  const leaderboard = await getPuzzleLeaderboard(c.env.DB, puzzle.id);
  return c.html(
    <GamePage puzzle={puzzle} user={c.get("user")} leaderboard={leaderboard} />
  );
});

export default game;
