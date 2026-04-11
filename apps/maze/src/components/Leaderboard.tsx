/** @jsxImportSource hono/jsx */
import { formatDuration } from "../lib/time";
import type { MazeLeaderboardEntry } from "../types";

type LeaderboardProps = {
  entries: MazeLeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <table class="board-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Time</th>
          <th>Steps</th>
        </tr>
      </thead>
      <tbody>
        {entries.length ? (
          entries.map((entry, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{formatDuration(entry.bestTimeMs)}</td>
              <td>{entry.bestPathLength}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4}>No runs yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
