/** @jsxImportSource hono/jsx */
import { formatDuration } from "../lib/time";
import type { CombinedLeaderboardEntry } from "../types";

type Props = { entries: CombinedLeaderboardEntry[] };

function timeOrDash(ms: number | null): string {
  return ms != null ? formatDuration(ms) : "-";
}

export function CombinedLeaderboard({ entries }: Props) {
  return (
    <table class="board-table board-table--wide">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Done</th>
          <th>Total</th>
          <th>Nono</th>
          <th>Star</th>
          <th>Tents</th>
        </tr>
      </thead>
      <tbody>
        {entries.length ? (
          entries.map((e, i) => (
            <tr>
              <td>{i + 1}</td>
              <td>{e.username}</td>
              <td>{e.puzzlesCompleted}/3</td>
              <td>{formatDuration(e.totalTimeMs)}</td>
              <td>{timeOrDash(e.nonogramTimeMs)}</td>
              <td>{timeOrDash(e.starbattleTimeMs)}</td>
              <td>{timeOrDash(e.tentsTimeMs)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7}>No solves yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
