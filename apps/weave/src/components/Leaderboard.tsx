/** @jsxImportSource hono/jsx */
import { formatDuration } from "../lib/time";
import type { WeaveLeaderboardEntry } from "../types";

type LeaderboardProps = {
  entries: WeaveLeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <table class="board-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Score</th>
          <th>Words</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {entries.length ? (
          entries.map((entry, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.bestScore}</td>
              <td>{entry.wordCount}</td>
              <td>{formatDuration(entry.timeMs)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>No runs yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
