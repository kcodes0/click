export const PUZZLE_CSS = String.raw`/* confuzzled — math puzzle styles */

/* ==============================================================
   HOME HERO
   ============================================================== */

.pz-hero {
  padding: 3.5rem 0 2.4rem;
  position: relative;
  text-align: center;
}
.pz-hero::before {
  content: "∑";
  position: absolute;
  top: 1rem; left: 12%;
  font-size: 2.4rem;
  color: var(--sun);
  transform: rotate(-12deg);
}
.pz-hero::after {
  content: "π";
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

.pz-shell { position: relative; max-width: 700px; margin: 0 auto; }

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
   MATH PROBLEM DISPLAY
   ============================================================== */

.math-category {
  display: inline-block;
  font: 700 .75rem var(--ff-read);
  text-transform: uppercase;
  letter-spacing: .08em;
  padding: .2rem .6rem;
  border-radius: 6px;
  color: var(--paper);
  background: var(--lav);
  margin-bottom: .8rem;
}
.math-category--algebra { background: var(--orange); }
.math-category--number-theory { background: var(--teal); }
.math-category--combinatorics { background: var(--pink); }
.math-category--geometry { background: var(--lav); }

.math-problem {
  padding: 1.2rem 0;
}

.math-statement {
  font: 1.25rem/1.8 var(--ff-read);
  color: var(--ink);
  padding: 1.4rem 1.6rem;
  border: 3px solid var(--ink);
  border-radius: 16px 22px 14px 20px / 20px 14px 22px 16px;
  background: var(--paper);
  max-width: 100%;
}

.math-statement .katex-display {
  margin: .8rem 0;
}

/* ==============================================================
   ANSWER INPUT
   ============================================================== */

.math-answer-row {
  display: flex;
  gap: .8rem;
  margin-top: 1.4rem;
  flex-wrap: wrap;
  align-items: stretch;
}

.math-input {
  flex: 1 1 200px;
  font: 1.2rem var(--ff-read);
  padding: .7rem 1rem;
  border: 3px solid var(--ink);
  border-radius: 12px 16px 10px 14px / 14px 10px 16px 12px;
  background: var(--paper);
  color: var(--ink);
  outline: none;
  transition: border-color .15s ease;
  min-width: 0;
}
.math-input:focus {
  border-color: var(--lav);
  box-shadow: 0 0 0 3px rgba(137, 101, 224, .15);
}
.math-input::placeholder {
  color: var(--ink-soft);
  opacity: .5;
}
.math-input:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.math-submit {
  font: 700 1.1rem var(--ff-goofy);
  padding: .7rem 1.8rem;
  border: 3px solid var(--ink);
  border-radius: 10px 16px 12px 14px / 14px 12px 16px 10px;
  background: var(--lav);
  color: var(--paper);
  cursor: pointer;
  transition: transform .1s ease, background .1s ease;
  white-space: nowrap;
}
.math-submit:hover:not(:disabled) {
  transform: rotate(-1deg) scale(1.03);
  background: var(--orange);
}
.math-submit:disabled {
  opacity: .5;
  cursor: not-allowed;
}

/* ==============================================================
   ATTEMPTS COUNTER
   ============================================================== */

.math-meta {
  display: flex;
  gap: 1.4rem;
  margin-top: .8rem;
  font: .95rem var(--ff-read);
  color: var(--ink-soft);
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
.pz-rules h3 {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--lav);
  display: inline-block;
  transform: rotate(-2deg);
  margin: 0 0 .6rem;
}
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
.result-banner--error {
  border-color: var(--red);
  background: rgba(220, 38, 38, .08);
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
   DIFFICULTY STARS
   ============================================================== */

.diff-stars {
  color: var(--orange);
  letter-spacing: 2px;
  font-size: 1.1rem;
}

@media (max-width: 720px) {
  .pz-topline { flex-direction: column; gap: .6rem; }
  .pz-stats { width: 100%; }
  .pz-title { font-size: 1.6rem; }
  .math-statement { font-size: 1.1rem; padding: 1rem 1.2rem; }
  .math-answer-row { flex-direction: column; }
  .math-submit { width: 100%; }
}
`;
