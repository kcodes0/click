/** @jsxImportSource hono/jsx */
import { E, N, S, W, type StoredLayout } from "../lib/maze-gen";

type MazeViewProps = {
  layout: StoredLayout;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  cellSize?: number;
  padding?: number;
};

type WallLine = { x1: number; y1: number; x2: number; y2: number };

// Build the list of wall lines for the SVG. We walk every cell and, for
// each, emit its N and W walls if they're present. That covers every
// shared interior wall exactly once. Then we tack on the S walls of the
// bottom row and the E walls of the right column so the outer border
// always closes cleanly.
function collectWallLines(layout: StoredLayout, cellSize: number): WallLine[] {
  const { width, height, walls } = layout;
  const lines: WallLine[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = walls[y * width + x];
      const x0 = x * cellSize;
      const y0 = y * cellSize;
      const x1 = x0 + cellSize;
      const y1 = y0 + cellSize;

      if (cell & N) {
        lines.push({ x1: x0, y1: y0, x2: x1, y2: y0 });
      }
      if (cell & W) {
        lines.push({ x1: x0, y1: y0, x2: x0, y2: y1 });
      }
      if (y === height - 1 && cell & S) {
        lines.push({ x1: x0, y1, x2: x1, y2: y1 });
      }
      if (x === width - 1 && cell & E) {
        lines.push({ x1, y1: y0, x2: x1, y2: y1 });
      }
    }
  }

  return lines;
}

export function MazeView({
  layout,
  startX,
  startY,
  endX,
  endY,
  cellSize = 36,
  padding = 18
}: MazeViewProps) {
  const innerWidth = layout.width * cellSize;
  const innerHeight = layout.height * cellSize;
  const viewBoxWidth = innerWidth + padding * 2;
  const viewBoxHeight = innerHeight + padding * 2;
  const walls = collectWallLines(layout, cellSize);

  const startCx = startX * cellSize + cellSize / 2;
  const startCy = startY * cellSize + cellSize / 2;
  const endCx = endX * cellSize + cellSize / 2;
  const endCy = endY * cellSize + cellSize / 2;

  return (
    <svg
      class="maze-svg"
      viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
      role="img"
      aria-label="Paper maze"
    >
      <g class="maze-walls">
        {walls.map((w) => (
          <line x1={w.x1} y1={w.y1} x2={w.x2} y2={w.y2} />
        ))}
      </g>

      {/* Invisible hit targets, one per cell. game.js reads data-x/data-y
          to figure out which cell the user clicked. */}
      <g class="maze-cells">
        {Array.from({ length: layout.height }, (_, y) =>
          Array.from({ length: layout.width }, (_, x) => (
            <rect
              class="maze-cell"
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              data-x={x}
              data-y={y}
            />
          ))
        )}
      </g>

      {/* Path polyline — game.js updates `points` as the user moves. */}
      <polyline class="maze-path" points="" />

      {/* Start / end markers rendered on top of the path. */}
      <g class="maze-endpoints">
        <circle class="maze-start" cx={startCx} cy={startCy} r={cellSize / 3} />
        <text
          class="maze-endpoint-label"
          x={startCx}
          y={startCy}
          text-anchor="middle"
          dominant-baseline="central"
        >
          S
        </text>
        <circle class="maze-end" cx={endCx} cy={endCy} r={cellSize / 3} />
        <text
          class="maze-endpoint-label"
          x={endCx}
          y={endCy}
          text-anchor="middle"
          dominant-baseline="central"
        >
          E
        </text>
      </g>
    </svg>
  );
}
