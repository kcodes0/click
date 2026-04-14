/** @jsxImportSource hono/jsx */
import type { FrostGridData } from "../lib/frost";

type Props = { gridData: FrostGridData; width: number; height: number };

const ARROW_CHAR: Record<string, string> = {
  N: "\u2191",
  S: "\u2193",
  E: "\u2192",
  W: "\u2190"
};

export function FrostGrid({ gridData, width, height }: Props) {
  const arrowMap = new Map<number, string>();
  for (const a of gridData.arrows) {
    arrowMap.set(a.idx, a.dir);
  }

  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const ch = gridData.cells[i];
      const isNum = ch >= "0" && ch <= "9";
      const arrow = arrowMap.get(i);

      cells.push(
        <button
          type="button"
          class={`pz-cell frost-cell${isNum ? " frost-cell--num" : ""}`}
          data-idx={i}
          data-x={x}
          data-y={y}
          aria-label={
            isNum
              ? `Clue: ${ch}${arrow ? `, arrow ${arrow}` : ""}`
              : `Cell ${x},${y}`
          }
        >
          {isNum ? <span class="frost-num">{ch}</span> : null}
          {arrow ? (
            <span class="frost-arrow">{ARROW_CHAR[arrow] || ""}</span>
          ) : null}
        </button>
      );
    }
  }

  return (
    <div
      class="pz-grid frost-grid"
      style={`grid-template-columns:repeat(${width},1fr)`}
    >
      {cells}
    </div>
  );
}
