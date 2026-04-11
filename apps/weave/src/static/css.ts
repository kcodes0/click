// weave-specific styles. Layered on top of @kcodes/ui's BASE_CSS via
// extraCss on Layout. Hero + grid + word-builder + leaderboard live
// here; tokens, header, nav, buttons, forms all come from the ui pkg.

export const STYLE_CSS = String.raw`/* letter weave — game-specific styles */

/* ==============================================================
   HOME HERO
   ============================================================== */

.weave-hero {
  padding: 3.5rem 0 2.4rem;
  position: relative;
  text-align: center;
}
.weave-hero::before {
  content: "✦";
  position: absolute;
  top: 1rem; left: 12%;
  font-size: 2.4rem;
  color: var(--teal);
  transform: rotate(-12deg);
}
.weave-hero::after {
  content: "✿";
  position: absolute;
  top: 1rem; right: 10%;
  font-size: 2.2rem;
  color: var(--pink);
  transform: rotate(14deg);
}
.weave-hero h1 {
  font-size: clamp(2.6rem, 9vw, 5rem);
  line-height: .95;
  margin-bottom: .9rem;
  letter-spacing: -.015em;
}
.weave-hero h1 .wob-1 { display: inline-block; transform: rotate(-3deg); color: var(--orange); }
.weave-hero h1 .wob-2 { display: inline-block; transform: rotate(2deg); color: var(--pink); }
.weave-hero p {
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

.weave-shell { position: relative; }

.weave-topline {
  display: flex;
  justify-content: space-between;
  gap: 1.6rem 1.5rem;
  align-items: flex-start;
  margin-bottom: 1.4rem;
  flex-wrap: wrap;
}

.weave-bar { flex: 1 1 auto; min-width: 0; }

.weave-title {
  font-size: clamp(2rem, 4.5vw, 2.8rem);
  line-height: 1;
  display: inline-block;
  transform: rotate(-2deg);
  color: var(--pink);
}

.weave-stats {
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  align-items: flex-start;
}
.weave-stats .stat-val { color: var(--lav); }
.weave-stats .stat--timer .stat-val { color: var(--orange); font-size: 2rem; }
.weave-stats .stat--score .stat-val { color: var(--teal); }

/* ==============================================================
   CURRENT WORD STRIP — what the player is building right now
   ============================================================== */

.weave-current {
  margin: 1rem auto 1.2rem;
  padding: .7rem 1rem .7rem 1.3rem;
  border: 3px dashed var(--ink);
  border-radius: 18px 26px 14px 22px / 22px 14px 26px 16px;
  background: var(--paper);
  max-width: 560px;
  display: flex;
  align-items: center;
  gap: .9rem;
  transform: rotate(-.3deg);
}
.weave-current-text {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: .15rem;
}
.weave-current-word {
  font: 400 2rem var(--ff-goofy);
  color: var(--orange);
  letter-spacing: .08em;
  min-height: 2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color .12s ease;
}
.weave-current-word--empty {
  color: var(--ink-soft);
  font-size: 1.2rem;
  font-family: var(--ff-read);
  font-style: italic;
}
.weave-current-word--bad {
  color: var(--red);
}
.weave-current-word--ok {
  color: var(--teal);
}
.weave-current-hint {
  font: 400 .9rem var(--ff-read);
  color: var(--ink-soft);
}

/* Big "commit this word" button sitting inline with the current-word
   strip. More prominent than a ghost button tucked below the grid. */
.weave-current-submit {
  flex: 0 0 auto;
  font: 400 1.2rem var(--ff-goofy);
  color: var(--ink);
  background: var(--sun);
  border: 3px solid var(--ink);
  border-radius: 14px 22px 14px 22px / 20px 14px 22px 14px;
  padding: .6rem 1.1rem;
  cursor: pointer;
  transform: rotate(1.5deg);
  transition: transform .12s ease, background .12s ease;
  -webkit-tap-highlight-color: transparent;
}
.weave-current-submit:hover {
  background: var(--orange);
  color: var(--paper);
  transform: rotate(-1deg) scale(1.04);
}
.weave-current-submit:active { transform: rotate(0) scale(.97); }
.weave-current-submit:disabled {
  opacity: .55;
  cursor: not-allowed;
  transform: rotate(1.5deg);
}

/* ==============================================================
   LETTER GRID
   ============================================================== */

.weave-canvas {
  display: flex;
  justify-content: center;
  padding: 1rem 0 1.4rem;
}

.weave-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: .7rem;
  width: min(100%, 500px);
  aspect-ratio: 1;
}

/* Shake animation applied to the grid when a submit bounces — tells the
   player loud and clear that the word was rejected without blocking the
   rest of the page. Added/removed by game.js via the .shake class. */
@keyframes weave-shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-8px) rotate(-.6deg); }
  30% { transform: translateX(7px) rotate(.5deg); }
  45% { transform: translateX(-5px) rotate(-.3deg); }
  60% { transform: translateX(4px) rotate(.3deg); }
  75% { transform: translateX(-2px); }
}
.weave-grid.shake {
  animation: weave-shake .45s ease-in-out;
}

.weave-tile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper-2);
  color: var(--ink);
  font: 400 clamp(1.6rem, 5.5vw, 2.4rem) var(--ff-goofy);
  border: 3px solid var(--ink);
  border-radius: 14px 22px 16px 24px / 22px 14px 24px 16px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  /* touch-action: none prevents touch-drag from being hijacked by the
     browser's scroll / zoom gestures, which is critical for drag-to-trace
     on phones. */
  touch-action: none;
  transition: transform .12s ease, background .12s ease;
  padding: 0;
  text-transform: uppercase;
  aspect-ratio: 1;
  -webkit-tap-highlight-color: transparent;
}
.weave-tile:nth-child(6n) { transform: rotate(-2deg); }
.weave-tile:nth-child(6n+1) { transform: rotate(1.5deg); }
.weave-tile:nth-child(6n+2) { transform: rotate(-1deg); }
.weave-tile:nth-child(6n+3) { transform: rotate(2deg); }
.weave-tile:nth-child(6n+4) { transform: rotate(-1.5deg); }
.weave-tile:nth-child(6n+5) { transform: rotate(1deg); }
.weave-tile:hover:not(.used):not(.disabled) {
  background: var(--sun);
  transform: rotate(0) scale(1.04);
}
.weave-tile:focus-visible {
  outline: 3px dashed var(--orange);
  outline-offset: 3px;
}

.weave-tile.used {
  background: var(--teal);
  color: var(--paper);
  cursor: pointer;
}
.weave-tile.used.head {
  background: var(--orange);
  color: var(--paper);
  border-style: dashed;
}
.weave-tile.disabled {
  opacity: .55;
  cursor: not-allowed;
}

/* ==============================================================
   ACTION ROW
   ============================================================== */

.weave-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  flex-wrap: wrap;
  align-items: center;
}
.weave-help-btn {
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
.weave-help-btn:hover { background: var(--sun); transform: rotate(2deg) scale(1.08); }
.weave-help-btn:focus-visible { outline: 3px dashed var(--orange); outline-offset: 3px; }

.weave-rules {
  margin-top: 1rem;
  padding: 1rem 1.2rem;
  border: 3px dashed var(--ink);
  border-radius: 18px 26px 14px 22px / 22px 14px 26px 16px;
  background: rgba(255, 251, 240, .75);
  transform: rotate(-.4deg);
  max-width: 560px;
}
.weave-rules.hidden { display: none; }
.weave-rules h3 {
  font: 400 1.3rem var(--ff-goofy);
  color: var(--pink);
  margin-bottom: .5rem;
  display: inline-block;
  transform: rotate(-2deg);
}
.weave-rules ul {
  list-style: none;
  margin: 0;
  padding: 0;
  font: 1rem/1.55 var(--ff-read);
}
.weave-rules li {
  padding: .25rem 0 .25rem 1.4rem;
  position: relative;
}
.weave-rules li::before {
  content: "~";
  position: absolute;
  left: .2rem;
  top: .25rem;
  color: var(--teal);
  font-family: var(--ff-goofy);
}

/* ==============================================================
   FOUND WORDS LIST
   ============================================================== */

.weave-words {
  margin-top: 1.6rem;
}
.weave-words-heading {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--pink);
  margin-bottom: .6rem;
  display: inline-block;
  transform: rotate(-3deg);
}
.weave-words-list {
  display: flex;
  flex-wrap: wrap;
  gap: .4rem .7rem;
  font-family: var(--ff-read);
  font-size: 1rem;
  color: var(--ink);
  list-style: none;
  margin: 0;
  padding: 0;
}
.weave-words-list li {
  padding: .2rem .55rem;
  background: rgba(16, 191, 160, .2);
  border: 2px dashed rgba(42, 28, 16, .4);
  border-radius: 10px 14px 10px 14px / 14px 10px 14px 10px;
}
.weave-words-list li::after {
  content: " +" attr(data-score);
  color: var(--ink-soft);
  font-size: .8rem;
}
.weave-words-empty {
  font: italic 1rem var(--ff-read);
  color: var(--ink-soft);
}

/* ==============================================================
   SIDE LEADERBOARD (borrowed table style)
   ============================================================== */

.weave-side { margin-top: 1.6rem; }
.weave-side-heading {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--pink);
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
  .weave-topline { flex-direction: column; gap: .6rem; }
  .weave-stats { width: 100%; }
  .weave-title { font-size: 1.6rem; }
  .weave-grid { gap: .5rem; width: 100%; }
  .weave-tile { border-width: 2px; }
}
`;
