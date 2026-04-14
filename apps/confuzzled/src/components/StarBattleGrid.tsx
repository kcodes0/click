/** @jsxImportSource hono/jsx */
import type { StarBattleData } from "../lib/starbattle";

const REGION_COLORS = [
  "rgba(255,107,26,.12)", "rgba(79,184,255,.12)", "rgba(255,79,154,.12)",
  "rgba(16,191,160,.12)", "rgba(255,207,43,.15)", "rgba(166,107,255,.12)",
  "rgba(255,71,71,.10)", "rgba(180,168,144,.12)"
];

export function StarBattleGrid({ gridData }: { gridData: StarBattleData }) {
  const { regions, w, h } = gridData;

  function borderClass(idx: number): string {
    const cx = idx % w, cy = Math.floor(idx / w);
    const r = regions[idx];
    const cls: string[] = [];
    if (cx === 0 || regions[cy * w + cx - 1] !== r) cls.push("sb-border-l");
    if (cx === w - 1 || regions[cy * w + cx + 1] !== r) cls.push("sb-border-r");
    if (cy === 0 || regions[(cy - 1) * w + cx] !== r) cls.push("sb-border-t");
    if (cy === h - 1 || regions[(cy + 1) * w + cx] !== r) cls.push("sb-border-b");
    return cls.join(" ");
  }

  return (
    <div
      class="pz-grid sb-grid"
      style={`grid-template-columns: repeat(${w}, 1fr)`}
    >
      {Array.from({ length: w * h }, (_, i) => (
        <button
          type="button"
          class={`pz-cell sb-cell ${borderClass(i)}`}
          data-idx={i}
          style={`background: ${REGION_COLORS[regions[i] % REGION_COLORS.length]}`}
        ></button>
      ))}
    </div>
  );
}
