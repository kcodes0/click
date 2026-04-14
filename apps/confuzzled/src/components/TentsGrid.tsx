/** @jsxImportSource hono/jsx */
import type { TentsData } from "../lib/tents";

export function TentsGrid({ gridData }: { gridData: TentsData }) {
  const { trees, rowCounts, colCounts, w, h } = gridData;
  const treeSet = new Set(trees);

  return (
    <div class="tents-wrapper">
      <table class="tents-table">
        <thead>
          <tr>
            <td class="tents-corner"></td>
            {colCounts.map((c) => (
              <td class="tents-col-clue">{c}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: h }, (_, r) => (
            <tr>
              <td class="tents-row-clue">{rowCounts[r]}</td>
              {Array.from({ length: w }, (_, c) => {
                const idx = r * w + c;
                const isTree = treeSet.has(idx);
                return (
                  <td
                    class={`tents-cell ${isTree ? "tents-cell--tree" : ""}`}
                    data-idx={idx}
                  >
                    {isTree ? "🌲" : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
