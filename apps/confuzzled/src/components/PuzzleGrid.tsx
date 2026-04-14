/** @jsxImportSource hono/jsx */

type PuzzleGridProps = {
  grid: string;
  width: number;
  height: number;
};

function isWall(ch: string): boolean {
  return ch === "#" || (ch >= "0" && ch <= "4");
}

function wallNumber(ch: string): string | null {
  if (ch >= "0" && ch <= "4") return ch;
  return null;
}

export function PuzzleGrid({ grid, width, height }: PuzzleGridProps) {
  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const ch = grid[i];
      const wall = isWall(ch);
      const num = wallNumber(ch);

      cells.push(
        <button
          type="button"
          class={`pz-cell${wall ? " pz-cell--wall" : ""}${num !== null ? " pz-cell--num" : ""}`}
          data-idx={i}
          data-x={x}
          data-y={y}
          disabled={wall}
          aria-label={
            wall
              ? num !== null
                ? `Wall with number ${num}`
                : "Wall"
              : `Cell ${x},${y}`
          }
        >
          {num !== null ? <span class="pz-wall-num">{num}</span> : null}
        </button>
      );
    }
  }

  return (
    <div
      class="pz-grid"
      style={`grid-template-columns:repeat(${width},1fr)`}
    >
      {cells}
    </div>
  );
}
