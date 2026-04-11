// Deterministic Letter Weave board generation.
//
// We roll the 25 dice of the standard Big Boggle (5x5) set via a
// mulberry32 PRNG seeded by an FNV-1a hash of the date string, then
// permute the dice into a 5x5 grid. Same date → same grid for every
// player, which is what lets the daily run sync + async at once.

export const GRID_WIDTH = 5;
export const GRID_HEIGHT = 5;

// Big Boggle "deluxe" dice set. Each string is one die; each character is
// one face. Q here is a plain Q (not "Qu") for simplicity.
const DICE = [
  "AAAFRS",
  "AAEEEE",
  "AAFIRS",
  "ADENNN",
  "AEEEEM",
  "AEEGMU",
  "AEGMNN",
  "AFIRSY",
  "BJKQXZ",
  "CCNSTW",
  "CEIILT",
  "CEILPT",
  "CEIPST",
  "DDLNOR",
  "DDHNOT",
  "DHHLOR",
  "DHLNOR",
  "EIIITT",
  "EILPST",
  "EMOTTT",
  "ENSSSU",
  "FIPRSY",
  "GORRVW",
  "HIPRRY",
  "NOOTUW"
] as const;

export type WeaveBoard = {
  width: number;
  height: number;
  // One uppercase letter per cell, row-major (y * width + x).
  cells: string[];
};

// Mulberry32 — same tiny PRNG the maze generator uses. Good enough for
// picking dice faces and shuffling positions deterministically.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// FNV-1a 32-bit. Shared shape with maze-gen's hashStringToSeed so the
// same date key produces correlated but distinct grids across games
// (both are keyed off `<game>:<date>`).
export function hashStringToSeed(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateBoard(seed: number): WeaveBoard {
  const rng = mulberry32(seed);

  // Roll each of the 25 dice to pick one face per die.
  const rolled: string[] = DICE.map((die) => {
    const face = Math.floor(rng() * die.length);
    return die[face];
  });

  // Fisher-Yates shuffle the rolled dice so their grid positions are
  // randomised independent of which die is which.
  for (let i = rolled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = rolled[i];
    rolled[i] = rolled[j];
    rolled[j] = tmp;
  }

  return {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    cells: rolled
  };
}

// Serialise a board as a flat string ("ABCDE...") — 25 chars fit in a
// tiny TEXT column and parse is trivially `.split("")` back.
export function serializeBoard(board: WeaveBoard): string {
  return board.cells.join("");
}

export function parseBoard(raw: string): WeaveBoard {
  return {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    cells: raw.split("")
  };
}

// Walk a path of cell indexes and confirm it describes a legal Boggle
// trace: every step is 8-directionally adjacent to the previous one and
// no cell is visited twice. This is the shared oracle used by both the
// client word builder and the server validator so the two never drift.
export function canTrace(
  board: Pick<WeaveBoard, "width" | "height">,
  pathIndexes: number[]
): boolean {
  if (pathIndexes.length === 0) return false;

  const seen = new Set<number>();
  for (const idx of pathIndexes) {
    if (idx < 0 || idx >= board.width * board.height) return false;
    if (seen.has(idx)) return false;
    seen.add(idx);
  }

  for (let i = 1; i < pathIndexes.length; i++) {
    const prev = pathIndexes[i - 1];
    const curr = pathIndexes[i];
    const px = prev % board.width;
    const py = Math.floor(prev / board.width);
    const cx = curr % board.width;
    const cy = Math.floor(curr / board.width);
    const dx = Math.abs(cx - px);
    const dy = Math.abs(cy - py);
    if (dx > 1 || dy > 1 || (dx === 0 && dy === 0)) {
      return false;
    }
  }

  return true;
}

// Return the word spelled out by a sequence of cell indexes.
export function traceWord(board: WeaveBoard, pathIndexes: number[]): string {
  return pathIndexes.map((idx) => board.cells[idx] || "").join("");
}

// Given a board and a candidate word, search for any legal trace that
// spells it. Used on the server — the client submits the word list, not
// the trace, so we search. DFS with a Set of used indexes, early-exit on
// the first match. Good enough for 5x5 grids and ≤15-letter words.
export function findTrace(
  board: WeaveBoard,
  word: string
): number[] | null {
  const upper = word.toUpperCase();
  const total = board.width * board.height;

  const step = (idx: number, depth: number, used: Set<number>, acc: number[]): number[] | null => {
    if (board.cells[idx] !== upper[depth]) return null;
    acc.push(idx);
    used.add(idx);
    if (depth === upper.length - 1) {
      return acc.slice();
    }
    const x = idx % board.width;
    const y = Math.floor(idx / board.width);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= board.width || ny >= board.height) continue;
        const next = ny * board.width + nx;
        if (used.has(next)) continue;
        const found = step(next, depth + 1, used, acc);
        if (found) return found;
      }
    }
    acc.pop();
    used.delete(idx);
    return null;
  };

  for (let i = 0; i < total; i++) {
    const result = step(i, 0, new Set<number>(), []);
    if (result) return result;
  }
  return null;
}

// Big Boggle scoring — min word length is 4.
export const MIN_WORD_LENGTH = 4;

export function scoreWord(word: string): number {
  const len = word.length;
  if (len < MIN_WORD_LENGTH) return 0;
  if (len === 4) return 1;
  if (len === 5) return 2;
  if (len === 6) return 3;
  if (len === 7) return 5;
  return 11;
}
