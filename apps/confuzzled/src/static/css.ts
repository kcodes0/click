export const PUZZLE_CSS = String.raw`/* confuzzled — puzzle-specific styles */

/* ==============================================================
   HOME HERO
   ============================================================== */

.pz-hero {
  padding: 3.5rem 0 2.4rem;
  position: relative;
  text-align: center;
}
.pz-hero::before {
  content: "★";
  position: absolute;
  top: 1rem; left: 12%;
  font-size: 2.4rem;
  color: var(--sun);
  transform: rotate(-12deg);
}
.pz-hero::after {
  content: "✦";
  position: absolute;
  top: 1rem; right: 10%;
  font-size: 2.2rem;
  color: var(--teal);
  transform: rotate(14deg);
}
.pz-hero h1 {
  font-size: clamp(2.6rem, 9vw, 5rem);
  line-height: .95;
  margin-bottom: .9rem;
  letter-spacing: -.015em;
}
.pz-hero h1 .wob-1 { display: inline-block; transform: rotate(-3deg); color: var(--orange); }
.pz-hero h1 .wob-2 { display: inline-block; transform: rotate(2deg); color: var(--lav); }
.pz-hero p {
  font-family: var(--ff-read);
  font-size: 1.25rem;
  color: var(--ink-soft);
  max-width: 540px;
  margin: 0 auto 1.6rem;
  transform: rotate(-.4deg);
  display: inline-block;
}

/* ==============================================================
   GAME PAGE
   ============================================================== */

.pz-shell { position: relative; }

.pz-topline {
  display: flex;
  justify-content: space-between;
  gap: 1.6rem 1.5rem;
  align-items: flex-start;
  margin-bottom: 1.4rem;
  flex-wrap: wrap;
}

.pz-bar { flex: 1 1 auto; min-width: 0; }

.pz-title {
  font-size: clamp(2rem, 4.5vw, 2.8rem);
  line-height: 1;
  display: inline-block;
  transform: rotate(-2deg);
  color: var(--lav);
}

.pz-stats {
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  align-items: flex-start;
}
.pz-stats .stat-val { color: var(--lav); }
.pz-stats .stat--timer .stat-val { color: var(--orange); font-size: 2rem; }

/* ==============================================================
   PUZZLE GRID
   ============================================================== */

.pz-canvas {
  display: flex;
  justify-content: center;
  padding: 1rem 0 1.4rem;
}

.pz-grid {
  display: grid;
  gap: 0;
  width: min(100%, 420px);
  aspect-ratio: 1;
  border: 3px solid var(--ink);
  border-radius: 6px;
  overflow: hidden;
}

.pz-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper);
  color: var(--ink);
  font: 400 clamp(1.1rem, 4vw, 1.6rem) var(--ff-goofy);
  border: 1px solid rgba(42, 28, 16, .25);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  padding: 0;
  aspect-ratio: 1;
  -webkit-tap-highlight-color: transparent;
  transition: background .1s ease;
}

.pz-cell:hover:not(:disabled) {
  background: rgba(255, 207, 43, .15);
}

.pz-cell:focus-visible {
  outline: 3px dashed var(--orange);
  outline-offset: -3px;
  z-index: 2;
}

/* Walls */
.pz-cell--wall {
  background: var(--ink);
  cursor: default;
}
.pz-cell--wall:hover { background: var(--ink); }
.pz-cell--num {
  background: var(--ink);
}
.pz-wall-num {
  color: var(--paper);
  font: 700 clamp(1.2rem, 4.5vw, 1.8rem) var(--ff-goofy);
}

/* Numbered wall error (too many adjacent bulbs) */
.pz-cell--wall-error .pz-wall-num {
  color: var(--red);
}

/* Bulb placed */
.pz-cell--bulb {
  background: var(--sun);
}
.pz-cell--bulb::after {
  content: "★";
  font-size: clamp(1.4rem, 5vw, 2rem);
  color: var(--orange);
  line-height: 1;
}

/* Lit by a nearby bulb */
.pz-cell--lit {
  background: rgba(255, 207, 43, .22);
}

/* X marker (definitely no bulb) */
.pz-cell--x::after {
  content: "×";
  font-size: clamp(1.4rem, 5vw, 2rem);
  color: var(--ink-soft);
  line-height: 1;
  opacity: .5;
}

/* Conflict — two bulbs seeing each other */
.pz-cell--conflict {
  background: rgba(220, 38, 38, .25);
}
.pz-cell--conflict::after {
  color: var(--red);
}

/* Solved flash */
@keyframes pz-solved {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
.pz-grid.solved {
  animation: pz-solved .5s ease;
}
.pz-grid.solved .pz-cell:not(.pz-cell--wall) {
  background: rgba(16, 191, 160, .18);
}
.pz-grid.solved .pz-cell--bulb {
  background: var(--teal);
}
.pz-grid.solved .pz-cell--bulb::after {
  color: var(--paper);
}

/* ==============================================================
   ACTION ROW
   ============================================================== */

.pz-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  flex-wrap: wrap;
  align-items: center;
}

/* ==============================================================
   RULES PANEL
   ============================================================== */

.pz-rules {
  margin-top: 1.2rem;
  padding: 1rem 1.4rem 1.2rem;
  border: 3px dashed var(--ink);
  border-radius: 18px 26px 14px 22px / 22px 14px 26px 16px;
  background: rgba(255, 251, 240, .85);
  max-width: 600px;
}
.pz-rules-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
  margin-bottom: .6rem;
}
.pz-rules h3 {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--lav);
  display: inline-block;
  transform: rotate(-2deg);
  margin: 0;
}
.pz-help-btn {
  border: 2px dashed var(--ink-soft);
  background: var(--paper);
  color: var(--ink-soft);
  font: 400 .85rem var(--ff-read);
  cursor: pointer;
  padding: .2rem .7rem;
  border-radius: 8px;
  transition: background .12s ease;
}
.pz-help-btn:hover { background: var(--sun); color: var(--ink); }
.pz-help-btn:focus-visible { outline: 3px dashed var(--orange); outline-offset: 3px; }

.pz-rules-body.hidden { display: none; }

/* Visual legend */
.pz-legend {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem .9rem;
  margin-bottom: .9rem;
  padding: .6rem .8rem;
  background: var(--paper);
  border: 2px solid rgba(42, 28, 16, .15);
  border-radius: 10px;
}
.pz-legend-item {
  display: flex;
  align-items: center;
  gap: .35rem;
  font: .85rem var(--ff-read);
  color: var(--ink-soft);
}
.pz-legend-swatch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border: 2px solid rgba(42, 28, 16, .3);
  border-radius: 4px;
  font-size: .85rem;
  line-height: 1;
  flex-shrink: 0;
}
.pz-legend--empty { background: var(--paper); }
.pz-legend--wall { background: var(--ink); }
.pz-legend--num {
  background: var(--ink);
  color: var(--paper);
  font-weight: 700;
  font-family: var(--ff-goofy);
}
.pz-legend--bulb {
  background: var(--sun);
}
.pz-legend--bulb::after {
  content: "\2605";
  color: var(--orange);
  font-size: 1rem;
}
.pz-legend--xmark {
  background: var(--paper);
}
.pz-legend--xmark::after {
  content: "\00d7";
  color: var(--ink-soft);
  font-size: 1.1rem;
  opacity: .6;
}

/* Numbered rules */
.pz-rules-list {
  margin: 0 0 .6rem;
  padding: 0 0 0 1.5rem;
  font: 1rem/1.6 var(--ff-read);
  color: var(--ink);
}
.pz-rules-list li {
  padding: .2rem 0;
}
.pz-rules-list li::marker {
  color: var(--lav);
  font-family: var(--ff-goofy);
  font-weight: 700;
}

.pz-rules-goal {
  font: italic .95rem/1.5 var(--ff-read);
  color: var(--ink-soft);
  margin: 0;
  padding-top: .3rem;
  border-top: 2px dotted rgba(42, 28, 16, .2);
}

/* ==============================================================
   SIDE LEADERBOARD
   ============================================================== */

.pz-side { margin-top: 1.6rem; }
.pz-side-heading {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--lav);
  margin-bottom: .6rem;
  display: inline-block;
  transform: rotate(-3deg);
}

.board-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ff-read);
  font-size: 1.1rem;
}
.board-table th {
  text-align: left;
  font: 400 1.05rem var(--ff-goofy);
  color: var(--lav);
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

/* ==============================================================
   RESULT BANNER
   ============================================================== */

.result-banner {
  margin: .8rem 0;
  padding: .8rem 1.2rem;
  border: 3px dashed var(--teal);
  border-radius: 14px 22px 14px 22px / 20px 14px 22px 14px;
  background: rgba(16, 191, 160, .12);
  font-family: var(--ff-read);
  transform: rotate(-.3deg);
}
.result-banner.hidden { display: none; }

@media (max-width: 720px) {
  .pz-topline { flex-direction: column; gap: .6rem; }
  .pz-stats { width: 100%; }
  .pz-title { font-size: 1.6rem; }
  .pz-grid { width: 100%; }
}
`;
