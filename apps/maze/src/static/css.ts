// Maze-specific styles. Layered on top of @kcodes/ui's BASE_CSS via the
// extraCss prop on Layout. The placeholder home page only needs a hero
// block for now — actual maze gameplay styles will be added when the
// renderer + solver land.

export const MAZE_CSS = String.raw`/* maze.kcodes.me — game-specific styles */

.maze-hero {
  padding: 3.5rem 0 2.4rem;
  position: relative;
  text-align: center;
}
.maze-hero::before {
  content: "✦";
  position: absolute;
  top: .8rem; left: 14%;
  font-size: 2.4rem;
  color: var(--lav);
  transform: rotate(-12deg);
}
.maze-hero::after {
  content: "✿";
  position: absolute;
  top: 1.1rem; right: 12%;
  font-size: 2.2rem;
  color: var(--teal);
  transform: rotate(14deg);
}
.maze-hero h1 {
  font-size: clamp(2.8rem, 9vw, 5rem);
  line-height: .95;
  margin-bottom: .9rem;
  letter-spacing: -.015em;
}
.maze-hero h1 .wob-1 { display: inline-block; transform: rotate(-3deg); color: var(--teal); }
.maze-hero h1 .wob-2 { display: inline-block; transform: rotate(2deg); color: var(--lav); }
.maze-hero p {
  font-family: var(--ff-read);
  font-size: 1.25rem;
  color: var(--ink-soft);
  max-width: 540px;
  margin: 0 auto;
  transform: rotate(-.4deg);
  display: inline-block;
}

.maze-coming-soon {
  display: inline-block;
  margin-top: 1.6rem;
  padding: .9rem 1.6rem;
  font: 400 1.4rem var(--ff-goofy);
  color: var(--ink);
  background: var(--sun);
  border: 3px dashed var(--ink);
  border-radius: 18px 26px 14px 22px / 22px 14px 26px 16px;
  transform: rotate(-1.5deg);
}

/* ==============================================================
   MAZE GAME PAGE
   ============================================================== */

.maze-shell { position: relative; }

.maze-topline {
  display: flex;
  justify-content: space-between;
  gap: 1.6rem 1.5rem;
  align-items: flex-start;
  margin-bottom: 1.4rem;
  flex-wrap: wrap;
}

.maze-bar { flex: 1 1 auto; min-width: 0; }

.maze-title {
  font-size: clamp(2rem, 4.5vw, 2.8rem);
  line-height: 1;
  display: inline-block;
  transform: rotate(-2deg);
  color: var(--teal);
}

.maze-stats {
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  align-items: flex-start;
}
.maze-stats .stat-val { color: var(--lav); }
.maze-stats .stat--timer .stat-val { color: var(--orange); font-size: 2rem; }

.maze-canvas {
  display: flex;
  justify-content: center;
  padding: 1.2rem 0;
  background: var(--article-bg);
  border-radius: 2px;
  box-shadow:
    0 1px 0 #e8d9b3,
    0 14px 30px rgba(60,40,10,.22),
    0 2px 6px rgba(60,40,10,.12);
}

.maze-svg {
  width: 100%;
  max-width: 560px;
  height: auto;
  display: block;
}

.maze-walls line {
  stroke: var(--ink);
  stroke-width: 3;
  stroke-linecap: round;
  fill: none;
  /* The wobble filter displaces pixels by ~3px which at a 36px cell
     size nibbles visibly into the click zones and makes the maze feel
     mushy. Skip it for walls and keep the doodle look with just the
     round stroke-linecap + dashed cell outline on the head cell. */
}

.maze-cells .maze-cell {
  fill: transparent;
  stroke: none;
  cursor: default;
  pointer-events: all;
}
/* Cells that are legal next moves from the current head. game.js adds the
   class on each refreshPath based on the generator's canMove(). Only these
   cells get a hover hint so players aren't distracted by every tile they
   cross with the mouse. */
.maze-cells .maze-cell.legal {
  fill: rgba(255, 207, 43, .18);
  cursor: pointer;
}
.maze-cells .maze-cell.legal:hover {
  fill: rgba(255, 207, 43, .45);
}
.maze-cells .maze-cell.in-path {
  fill: rgba(16, 191, 160, .32);
  cursor: pointer;
}
.maze-cells .maze-cell.in-path:hover {
  fill: rgba(16, 191, 160, .45);
}
.maze-cells .maze-cell.head {
  fill: rgba(255, 107, 26, .42);
  stroke: var(--ink);
  stroke-width: 2;
  stroke-dasharray: 3 3;
}

.maze-path {
  fill: none;
  stroke: var(--orange);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: .85;
  pointer-events: none;
}

.maze-start {
  fill: var(--teal);
  stroke: var(--ink);
  stroke-width: 2.5;
}
.maze-end {
  fill: var(--pink);
  stroke: var(--ink);
  stroke-width: 2.5;
}
.maze-endpoint-label {
  font: 700 14px var(--ff-goofy);
  fill: var(--ink);
  pointer-events: none;
}

.maze-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  flex-wrap: wrap;
  align-items: center;
}

.maze-help-btn {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: 3px dashed var(--ink);
  background: var(--paper);
  color: var(--ink);
  font: 400 1.2rem var(--ff-goofy);
  cursor: pointer;
  transform: rotate(-3deg);
  transition: transform .14s ease, background .14s ease;
  padding: 0;
  line-height: 1;
}
.maze-help-btn:hover {
  background: var(--sun);
  transform: rotate(2deg) scale(1.08);
}
.maze-help-btn:focus-visible {
  outline: 3px dashed var(--orange);
  outline-offset: 3px;
}

.maze-rules {
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  border: 3px dashed var(--ink);
  border-radius: 18px 26px 14px 22px / 22px 14px 26px 16px;
  background: rgba(255, 251, 240, .75);
  transform: rotate(-.4deg);
  max-width: 560px;
}
.maze-rules.hidden { display: none; }
.maze-rules h3 {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--pink);
  margin-bottom: .5rem;
  display: inline-block;
  transform: rotate(-2deg);
}
.maze-rules ul {
  list-style: none;
  margin: 0;
  padding: 0;
  font: 1rem/1.55 var(--ff-read);
  color: var(--ink);
}
.maze-rules li {
  padding: .25rem 0 .25rem 1.4rem;
  position: relative;
}
.maze-rules li::before {
  content: "~";
  position: absolute;
  left: .2rem;
  top: .25rem;
  color: var(--teal);
  font-family: var(--ff-goofy);
}

.maze-side {
  margin-top: 1.6rem;
}
.maze-side-heading {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--pink);
  margin-bottom: .6rem;
  display: inline-block;
  transform: rotate(-3deg);
}

/* Leaderboard table — same pattern click uses, copied here so the maze
   app doesn't reach across to click's CSS. If a third game wants it too,
   factor this block into @kcodes/ui. */
.board-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ff-read);
  font-size: 1.1rem;
}
.board-table th {
  text-align: left;
  font: 400 1.05rem var(--ff-goofy);
  color: var(--pink);
  padding: .5rem .4rem;
  border-bottom: 3px dashed var(--ink);
}
.board-table td {
  padding: .55rem .4rem;
  border-bottom: 2px dotted rgba(42,28,16,.25);
}
.board-table tbody tr:hover td { background: rgba(255,207,43,.25); }
.board-table td:first-child {
  font: 400 1.4rem var(--ff-goofy);
  width: 2.4rem;
  color: var(--ink-soft);
}
.board-table tbody tr:nth-child(1) td:first-child { color: var(--sun); }
.board-table tbody tr:nth-child(2) td:first-child { color: #b7a890; }
.board-table tbody tr:nth-child(3) td:first-child { color: var(--orange); }

@media (max-width: 720px) {
  .maze-topline { flex-direction: column; gap: .6rem; }
  .maze-stats { width: 100%; }
  .maze-title { font-size: 1.6rem; }
  .maze-canvas { padding: .8rem .4rem; }
  .maze-svg { max-width: 100%; }
}
`;
