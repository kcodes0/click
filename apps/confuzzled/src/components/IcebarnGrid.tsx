/** @jsxImportSource hono/jsx */
import type { IcebarnData } from "../lib/icebarn";

const ARROWS: Record<number, string> = { 0: "\u2191", 1: "\u2192", 2: "\u2193", 3: "\u2190" };

function markerStyle(m: { side: string; pos: number }, w: number, h: number, cellPct: number): string {
  if (m.side === "top") return `top:-1.8rem;left:${(m.pos + 0.5) * cellPct}%`;
  if (m.side === "bottom") return `bottom:-1.8rem;left:${(m.pos + 0.5) * cellPct}%`;
  if (m.side === "left") return `left:-2.2rem;top:${(m.pos + 0.5) * cellPct}%`;
  return `right:-2.2rem;top:${(m.pos + 0.5) * cellPct}%`;
}

function markerArrow(side: string, isIn: boolean): string {
  if (isIn) {
    if (side === "top") return "\u2193";
    if (side === "bottom") return "\u2191";
    if (side === "left") return "\u2192";
    return "\u2190";
  }
  if (side === "top") return "\u2191";
  if (side === "bottom") return "\u2193";
  if (side === "left") return "\u2190";
  return "\u2192";
}

export function IcebarnGrid({ gridData }: { gridData: IcebarnData }) {
  const { w, h, ice, arrows, inMarker, outMarker } = gridData;
  const iceSet = new Set(ice);
  const arrowMap = new Map<number, number>();
  for (const a of arrows) arrowMap.set(a.cell, a.dir);
  const cellPct = 100 / w;

  return (
    <div class="ib-wrapper" style="position:relative">
      <div class="ib-label ib-label--in" style={markerStyle(inMarker, w, h, cellPct)}>
        <span>{markerArrow(inMarker.side, true)}</span> IN
      </div>
      <div class="ib-label ib-label--out" style={markerStyle(outMarker, w, h, cellPct)}>
        OUT <span>{markerArrow(outMarker.side, false)}</span>
      </div>
      <div
        class="pz-grid ib-grid"
        style={`grid-template-columns:repeat(${w},1fr)`}
      >
        {Array.from({ length: w * h }, (_, i) => {
          const isIce = iceSet.has(i);
          const arrowDir = arrowMap.get(i);
          return (
            <button
              type="button"
              class={`pz-cell ib-cell${isIce ? " ib-cell--ice" : ""}`}
              data-idx={i}
            >
              {arrowDir !== undefined && (
                <span class="ib-arrow">{ARROWS[arrowDir]}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
