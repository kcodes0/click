/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { CombinedLeaderboard } from "../components/CombinedLeaderboard";
import { DailyHub } from "../components/DailyHub";
import { FrostGrid } from "../components/FrostGrid";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import { PuzzleGrid } from "../components/PuzzleGrid";
import { SignalGrid } from "../components/SignalGrid";
import {
  getDailyCombinedLeaderboard,
  getPuzzleById,
  getPuzzleLeaderboard,
  getUserSolve
} from "../db/queries";
import type { FrostGridData } from "../lib/frost";
import { getPuzzleTypeDef } from "../lib/puzzle-types";
import { ensureDailyPuzzles } from "../lib/seed";
import type { SignalGridData } from "../lib/signal";
import { formatDateKey, getDailyDateKey } from "../lib/time";
import type { AppVars, Bindings, PuzzleRow, PuzzleSolveRow } from "../types";

const game = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

// ── Daily hub ────────────────────────────────────────────────────

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
          <p>3 puzzles. pure logic. no guessing.</p>
        </div>
      </footer>
    </Layout>
  );
});

// ── Individual puzzle page ───────────────────────────────────────

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
  const subtitle =
    puzzle.daily_date
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
            <div class="pz-stats" role="group" aria-label="Puzzle stats">
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
            {puzzle.type === "akari" && (
              <PuzzleGrid
                grid={puzzle.grid}
                width={puzzle.width}
                height={puzzle.height}
              />
            )}
            {puzzle.type === "signal" && (
              <SignalGrid
                gridData={JSON.parse(puzzle.grid) as SignalGridData}
                width={puzzle.width}
                height={puzzle.height}
              />
            )}
            {puzzle.type === "frost" && (
              <FrostGrid
                gridData={JSON.parse(puzzle.grid) as FrostGridData}
                width={puzzle.width}
                height={puzzle.height}
              />
            )}
          </div>

          <div class="pz-actions">
            <button
              type="button"
              id="pz-reset"
              class="btn btn--ghost btn--sm"
            >
              Reset
            </button>
            {puzzle.daily_date && (
              <a href="/play/daily" class="btn btn--ghost btn--sm">
                Back to hub
              </a>
            )}
          </div>

          {puzzle.type === "akari" && <AkariRules />}
          {puzzle.type === "signal" && <SignalRules />}
          {puzzle.type === "frost" && <FrostRules />}

          <aside class="pz-side">
            <h3 class="pz-side-heading">Fastest Solves</h3>
            <Leaderboard entries={leaderboard} />
          </aside>
        </section>
      </div>

      <footer class="footer">
        <div class="wrap">
          <p>every cell counts.</p>
        </div>
      </footer>
    </Layout>
  );
}

// ── Rules panels ─────────────────────────────────────────────────

function AkariRules() {
  return (
    <div id="pz-rules" class="pz-rules">
      <h3>Light Up</h3>
      <ol class="pz-rules-list">
        <li>
          Place bulbs to <strong>light up every white cell</strong>. A bulb
          shines left, right, up, and down until it hits a wall.
        </li>
        <li>
          <strong>No two bulbs can see each other</strong> (same row/column
          with no wall between them).
        </li>
        <li>
          Numbers on walls mean <strong>exactly that many</strong> of the 4
          neighbors are bulbs.
        </li>
        <li>
          Click to cycle: empty &rarr; bulb &rarr; X &rarr; empty.
        </li>
      </ol>
    </div>
  );
}

function SignalRules() {
  return (
    <div id="pz-rules" class="pz-rules">
      <h3>Signal</h3>
      <ol class="pz-rules-list">
        <li>
          Place <strong>/ or \</strong> mirrors in every empty cell to route
          each colored signal from its transmitter to its receiver.
        </li>
        <li>
          Signals travel in straight lines and{" "}
          <strong>bounce off mirrors</strong> at 90 degrees.
        </li>
        <li>
          <strong>No two signal paths may share a cell.</strong>
        </li>
        <li>
          Click to cycle: empty &rarr; / &rarr; \ &rarr; empty.
        </li>
      </ol>
    </div>
  );
}

function FrostRules() {
  return (
    <div id="pz-rules" class="pz-rules">
      <h3>Frost</h3>
      <ol class="pz-rules-list">
        <li>
          Determine which cells are <strong>ice</strong> (blue) and which are
          not.
        </li>
        <li>
          Each number tells you how many of the <strong>9 surrounding
          cells</strong> (including itself) are ice.
        </li>
        <li>
          <strong>Arrow cells are always ice.</strong> Every ice cell must be
          adjacent to at least one number.
        </li>
        <li>
          Click to cycle: unknown &rarr; ice &rarr; not-ice &rarr; unknown.
        </li>
      </ol>
    </div>
  );
}

// ── Routes ───────────────────────────────────────────────────────

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
