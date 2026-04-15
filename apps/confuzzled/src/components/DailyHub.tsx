/** @jsxImportSource hono/jsx */
import { getPuzzleTypeDef } from "../lib/puzzle-types";
import { formatDateKey, formatDuration } from "../lib/time";
import type { AppVars, CombinedLeaderboardEntry, PuzzleRow, PuzzleSolveRow } from "../types";
import { CombinedLeaderboard } from "./CombinedLeaderboard";

type DailyHubProps = {
  dateKey: string;
  puzzles: PuzzleRow[];
  solves: Map<string, PuzzleSolveRow>;
  leaderboard: CombinedLeaderboardEntry[];
  user: AppVars["user"];
};

const DIFF_CLASS: Record<string, string> = {
  Hard: "hub-card--hard",
  Expert: "hub-card--expert"
};

export function DailyHub({ dateKey, puzzles, solves, leaderboard, user }: DailyHubProps) {
  const items = puzzles.map((puzzle) => {
    const def = getPuzzleTypeDef(puzzle.type);
    const solve = solves.get(puzzle.id);
    return { def, puzzle, solve };
  });

  return (
    <div class="hub">
      <div class="hub-header">
        <h2 class="hub-date">{formatDateKey(dateKey)}</h2>
        <p class="hub-subtitle">2 puzzles. 1 leaderboard. fastest combined time wins.</p>
      </div>
      <div class="hub-cards">
        {items.map(({ def, puzzle, solve }) => (
          <a
            href={`/play/${puzzle.id}`}
            class={`hub-card ${DIFF_CLASS[def?.difficulty || ""] || ""} ${solve ? "hub-card--done" : ""}`}
          >
            <span class="hub-card-diff">{def?.difficulty || "Hard"}</span>
            <span class="hub-card-name">{def?.displayName || puzzle.type}</span>
            <span class="hub-card-size">{puzzle.width}x{puzzle.height}</span>
            {solve ? (
              <span class="hub-card-time">{formatDuration(solve.time_ms)}</span>
            ) : (
              <span class="hub-card-cta">Play</span>
            )}
          </a>
        ))}
      </div>
      <aside class="hub-leaderboard">
        <h3 class="pz-side-heading">Daily Leaderboard</h3>
        <CombinedLeaderboard entries={leaderboard} />
      </aside>
    </div>
  );
}
