/** @jsxImportSource hono/jsx */
import type { SignalGridData } from "../lib/signal";

type Props = { gridData: SignalGridData; width: number; height: number };

const ARROW: Record<string, string> = {
  top: "\u2193",
  bottom: "\u2191",
  left: "\u2192",
  right: "\u2190"
};

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

  const edgeMarkers = gridData.signals.flatMap((sig) => {
    const markers = [];
    markers.push({
      ...sig.from,
      color: sig.color,
      id: sig.id,
      arrow: ARROW[sig.from.edge]
    });
    markers.push({
      ...sig.to,
      color: sig.color,
      id: sig.id,
      arrow: ARROW[sig.to.edge]
    });
    return markers;
  });

  return (
    <div class="sig-wrapper">
      <div class="sig-edge sig-edge--top">
        {Array.from({ length: width }, (_, x) => {
          const m = edgeMarkers.find(
            (e) => e.edge === "top" && e.pos === x
          );
          return (
            <span
              class={`sig-marker${m ? " sig-marker--active" : ""}`}
              style={m ? `color:${m.color}` : ""}
            >
              {m ? m.arrow : ""}
            </span>
          );
        })}
      </div>
      <div class="sig-mid">
        <div class="sig-edge sig-edge--left">
          {Array.from({ length: height }, (_, y) => {
            const m = edgeMarkers.find(
              (e) => e.edge === "left" && e.pos === y
            );
            return (
              <span
                class={`sig-marker${m ? " sig-marker--active" : ""}`}
                style={m ? `color:${m.color}` : ""}
              >
                {m ? m.arrow : ""}
              </span>
            );
          })}
        </div>
        <div
          class="pz-grid sig-grid"
          style={`grid-template-columns:repeat(${width},1fr)`}
        >
          {cells}
        </div>
        <div class="sig-edge sig-edge--right">
          {Array.from({ length: height }, (_, y) => {
            const m = edgeMarkers.find(
              (e) => e.edge === "right" && e.pos === y
            );
            return (
              <span
                class={`sig-marker${m ? " sig-marker--active" : ""}`}
                style={m ? `color:${m.color}` : ""}
              >
                {m ? m.arrow : ""}
              </span>
            );
          })}
        </div>
      </div>
      <div class="sig-edge sig-edge--bottom">
        {Array.from({ length: width }, (_, x) => {
          const m = edgeMarkers.find(
            (e) => e.edge === "bottom" && e.pos === x
          );
          return (
            <span
              class={`sig-marker${m ? " sig-marker--active" : ""}`}
              style={m ? `color:${m.color}` : ""}
            >
              {m ? m.arrow : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}
