/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { DailyHub } from "../components/DailyHub";
import { IcebarnGrid } from "../components/IcebarnGrid";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import {
  getDailyCombinedLeaderboard,
  getPuzzleById,
  getPuzzleLeaderboard,
  getUserSolve
} from "../db/queries";
import type { IcebarnData } from "../lib/icebarn";
import { getPuzzleTypeDef } from "../lib/puzzle-types";
import { ensureDailyPuzzles } from "../lib/seed";
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
        <div class="wrap"><p>draw the path. find the only way.</p></div>
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
    ? `${def?.difficulty || ""} · ${puzzle.width}x${puzzle.height} — ${formatDateKey(puzzle.daily_date)}`
    : "Practice";
  const scriptSrc = `/static/${def?.scriptName || "game-icebarn"}.js`;
  const gridData = JSON.parse(puzzle.grid) as IcebarnData;

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
            <p class="error-banner">You need an account to submit solves. You can still play.</p>
          )}
          <div id="game-result" class="result-banner hidden" />

          <div class="pz-canvas">
            <IcebarnGrid gridData={gridData} />
          </div>

          <div class="pz-actions">
            <button type="button" id="pz-reset" class="btn btn--ghost btn--sm">Reset</button>
            {puzzle.daily_date && (
              <a href="/play/daily" class="btn btn--ghost btn--sm">Back to hub</a>
            )}
          </div>

          <IcebarnRules variant={gridData.variant} />

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

function IcebarnRules({ variant }: { variant: string }) {
  return (
    <div id="pz-rules" class="pz-rules">
      <h3>Icebarn{variant === "worldtour" ? ": World Tour" : ""}</h3>
      <ol class="pz-rules-list">
        <li>Draw a path from <strong>IN</strong> to <strong>OUT</strong>. Move horizontally or vertically, turning only at cell centers.</li>
        <li>Follow all <strong>arrows</strong> — the arrow shows the direction of travel through that cell.</li>
        <li><strong>Ice cells</strong> (blue): cannot change direction on ice. You slide straight through.</li>
        <li>Connected ice cells form <strong>ice patches</strong>. The path must enter every ice patch at least once.</li>
        <li>The path <strong>cannot cross itself</strong> on normal cells, but <strong>can cross on ice</strong>.</li>
        {variant === "worldtour" && (
          <li><strong>World Tour:</strong> the path must visit <strong>every non-ice cell</strong>.</li>
        )}
        <li>Click cells adjacent to the path head to extend. Click the head to undo.</li>
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
