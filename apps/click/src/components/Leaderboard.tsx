/** @jsxImportSource hono/jsx */
import type { CrownEntry, LeaderboardEntry } from "../types";
import { formatDuration } from "../lib/time";

type LeaderboardProps =
  | {
      kind: "runs";
      entries: LeaderboardEntry[];
    }
  | {
      kind: "crown";
      entries: CrownEntry[];
    };

export function Leaderboard(props: LeaderboardProps) {
  if (props.kind === "runs") {
    return (
      <table class="board-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Time</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {props.entries.length ? (
            props.entries.map((entry, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>{formatDuration(entry.bestTimeMs)}</td>
                <td>{entry.bestClicks}</td>
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

  return (
    <table class="board-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Crown Time</th>
        </tr>
      </thead>
      <tbody>
        {props.entries.length ? (
          props.entries.map((entry, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{formatDuration(entry.heldMs)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No crown history yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
