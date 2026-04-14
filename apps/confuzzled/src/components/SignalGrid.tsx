/** @jsxImportSource hono/jsx */
import type { SignalGridData } from "../lib/signal";

type Props = { gridData: SignalGridData; width: number; height: number };

export function SignalGrid({ gridData, width, height }: Props) {
  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const ch = gridData.cells[i];
      const isWall = ch === "#";
      const isFixed = ch === "/" || ch === "\\";

      cells.push(
        <button
          type="button"
          class={`pz-cell sig-cell${isWall ? " pz-cell--wall" : ""}${isFixed ? " sig-cell--fixed" : ""}`}
          data-idx={i}
          data-x={x}
          data-y={y}
          disabled={isWall || isFixed}
          aria-label={
            isWall
              ? "Wall"
              : isFixed
                ? `Fixed mirror ${ch}`
                : `Cell ${x},${y}`
          }
        >
          {isFixed ? <span class="sig-mirror">{ch}</span> : null}
        </button>
      );
    }
  }

  return (
    <div
      class="pz-grid sig-grid"
      style={`grid-template-columns:repeat(${width},1fr)`}
    >
      {cells}
    </div>
  );
}
