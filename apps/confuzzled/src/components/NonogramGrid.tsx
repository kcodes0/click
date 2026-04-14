/** @jsxImportSource hono/jsx */
import type { NonogramData } from "../lib/nonogram";

export function NonogramGrid({ gridData }: { gridData: NonogramData }) {
  const { rows, cols, w, h } = gridData;
  const maxRowClue = Math.max(...rows.map((r) => r.length));
  const maxColClue = Math.max(...cols.map((c) => c.length));

  return (
    <div class="nono-wrapper">
      <table class="nono-table">
        <thead>
          {Array.from({ length: maxColClue }, (_, ci) => (
            <tr>
              {Array.from({ length: maxRowClue }, () => (
                <td class="nono-corner"></td>
              ))}
              {cols.map((col) => {
                const padded = Array(maxColClue - col.length).fill(null).concat(col);
                const val = padded[ci];
                return <td class="nono-col-clue">{val != null ? val : ""}</td>;
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr>
              {Array.from({ length: maxRowClue }, (_, ci) => {
                const padded = Array(maxRowClue - row.length).fill(null).concat(row);
                const val = padded[ci];
                return <td class="nono-row-clue">{val != null ? val : ""}</td>;
              })}
              {Array.from({ length: w }, (_, ci) => (
                <td
                  class="nono-cell"
                  data-idx={ri * w + ci}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
