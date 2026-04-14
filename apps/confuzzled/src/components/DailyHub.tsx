/** @jsxImportSource hono/jsx */
import { PUZZLE_TYPES } from "../lib/puzzle-types";
import { formatDateKey, formatDuration } from "../lib/time";
import type {
  AppVars,
  CombinedLeaderboardEntry,
  PuzzleRow,
  PuzzleSolveRow
} from "../types";
import { CombinedLeaderboard } from "./CombinedLeaderboard";

type DailyHubProps = {
  dateKey: string;
  puzzles: PuzzleRow[];
  solves: Map<string, PuzzleSolveRow>;
  leaderboard: CombinedLeaderboardEntry[];
  user: AppVars["user"];
};

const DIFF_CLASS: Record<string, string> = {
  Medium: "hub-card--medium",
  Hard: "hub-card--hard",
  "Super Hard": "hub-card--super"
};

export function DailyHub({
  dateKey,
  puzzles,
  solves,
  leaderboard,
  user
}: DailyHubProps) {
  const sorted = PUZZLE_TYPES.map((def) => {
    const puzzle = puzzles.find((p) => p.type === def.type);
    const solve = puzzle ? solves.get(puzzle.id) : undefined;
    return { def, puzzle, solve };
  }).sort((a, b) => a.def.order - b.def.order);

  return (
    <div class="hub">
      <div class="hub-header">
        <h2 class="hub-date">{formatDateKey(dateKey)}</h2>
        <p class="hub-subtitle">3 puzzles. 1 leaderboard. fastest total wins.</p>
      </div>

      <div class="hub-cards">
        {sorted.map(({ def, puzzle, solve }) => (
          <a
            href={puzzle ? `/play/${puzzle.id}` : "#"}
            class={`hub-card ${DIFF_CLASS[def.difficulty] || ""} ${solve ? "hub-card--done" : ""}`}
          >
            <span class="hub-card-diff">{def.difficulty}</span>
            <span class="hub-card-name">{def.displayName}</span>
            {solve ? (
              <span class="hub-card-time">
                {formatDuration(solve.time_ms)}
              </span>
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
