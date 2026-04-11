/** @jsxImportSource hono/jsx */
import type { WeaveBoard } from "../lib/board-gen";

type LetterGridProps = {
  board: WeaveBoard;
};

export function LetterGrid({ board }: LetterGridProps) {
  return (
    <div class="weave-grid" role="grid" aria-label="Letter weave board">
      {board.cells.map((letter, index) => {
        const x = index % board.width;
        const y = Math.floor(index / board.width);
        return (
          <button
            type="button"
            class="weave-tile"
            data-index={index}
            data-x={x}
            data-y={y}
            data-letter={letter}
            aria-label={`Letter ${letter} at row ${y + 1}, column ${x + 1}`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
