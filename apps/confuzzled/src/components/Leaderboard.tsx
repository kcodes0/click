/** @jsxImportSource hono/jsx */
import { formatDuration } from "../lib/time";
import type { LeaderboardEntry } from "../types";

type LeaderboardProps = {
  entries: LeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <table class="board-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {entries.length ? (
          entries.map((entry, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{formatDuration(entry.timeMs)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No solves yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
