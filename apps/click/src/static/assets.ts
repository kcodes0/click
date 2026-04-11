// click-only styles. Layered on top of @kcodes/ui's BASE_CSS by passing
// this string to <Layout extraCss={STYLE_CSS} />. Hero / board / game-shell
// / article / leaderboard / archive rules live here; tokens, fonts, header,
// nav, buttons, forms, and banners are in @kcodes/ui.

export const STYLE_CSS = String.raw`/* click! — game-specific styles */

/* ==============================================================
   HERO — cardless, free-floating tilted words
   ============================================================== */

.hero {
  padding: 3.5rem 0 3rem;
  position: relative;
}
.hero::before {
  content: "✦";
  position: absolute;
  top: 1rem; right: 10%;
  font-size: 3rem;
  color: var(--sun);
  transform: rotate(12deg);
}
.hero::after {
  content: "✿";
  position: absolute;
  bottom: 1rem; left: 6%;
  font-size: 2.5rem;
  color: var(--pink);
  transform: rotate(-18deg);
}

.hero-inner {
  max-width: 760px;
}

.hero h1 {
  font-size: clamp(2.6rem, 8.5vw, 5.8rem);
  line-height: .95;
  margin-bottom: 1.5rem;
  letter-spacing: -.015em;
}
.hero h1 .wobble-1 { display: inline-block; transform: rotate(-3deg); }
.hero h1 .wobble-2 { display: inline-block; transform: rotate(2deg); color: var(--orange); }
.hero h1 .wobble-3 { display: inline-block; transform: rotate(-1.5deg) translateY(4px); color: var(--pink); }
.hero h1 .wobble-4 { display: inline-block; transform: rotate(4deg); color: var(--teal); }
.hero h1 em {
  font-style: italic;
  color: var(--orange);
  display: inline-block;
  transform: rotate(-2deg);
}

.hero-desc {
  font-family: var(--ff-read);
  font-size: 1.35rem;
  color: var(--ink-soft);
  max-width: 520px;
  line-height: 1.45;
  transform: rotate(-.4deg);
}

.hero-btns {
  display: flex;
  gap: 1.4rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

/* ==============================================================
   BOARD — homepage info floats freely, no cards
   ============================================================== */

.board {
  padding: 2rem 0 3.5rem;
  position: relative;
}

.board-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.2rem;
}

.board-item {
  position: relative;
}
.board-item:nth-child(1) { transform: rotate(-1.2deg); }
.board-item:nth-child(2) { transform: rotate(1.5deg); padding-left: 2rem; }
.board-item:nth-child(3) { transform: rotate(-.8deg); padding-left: 4rem; }

.board-item p {
  font-family: var(--ff-read);
  font-size: 1.25rem;
  color: var(--ink-soft);
  max-width: 540px;
}

.route {
  display: flex;
  align-items: baseline;
  gap: .8rem;
  flex-wrap: wrap;
  font-family: var(--ff-goofy);
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  line-height: 1;
}
.route strong {
  color: var(--ink);
  font-weight: 400;
  display: inline-block;
  transform: rotate(-1deg);
}
.route strong:last-of-type {
  color: var(--orange);
  transform: rotate(1.5deg);
}
.route-arrow {
  color: var(--pink);
  font-family: var(--ff-goofy);
  display: inline-block;
  transform: rotate(-4deg) scale(1.1);
  padding: 0 .2rem;
}

/* ==============================================================
   GAME PAGE
   ============================================================== */

.game-shell { position: relative; }

.game-topline {
  display: flex;
  justify-content: space-between;
  gap: 2rem 1.5rem;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  position: relative;
}

.game-bar { flex: 1 1 auto; min-width: 0; }

.game-bar-left { max-width: 620px; }

.game-title {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  line-height: 1;
}
.game-title > :nth-child(1) { display: inline-block; transform: rotate(-2deg); }
.game-title > :nth-child(3) { display: inline-block; transform: rotate(2deg); color: var(--orange); }

.game-arrow {
  color: var(--pink);
  font-family: var(--ff-goofy);
  display: inline-block;
  transform: rotate(-5deg);
  padding: 0 .3rem;
}

.game-stats {
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.stat {
  text-align: left;
  min-width: 110px;
}
.stat:nth-child(1) { transform: rotate(-2deg); }
.stat:nth-child(2) { transform: rotate(1.5deg); }
.stat:nth-child(3) { transform: rotate(-1deg); }

.stat-label {
  display: block;
  font: 400 1rem var(--ff-read);
  color: var(--ink-soft);
  margin-bottom: -.15rem;
}

.stat-val {
  display: block;
  font: 400 1.6rem var(--ff-goofy);
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.stat--timer .stat-val { color: var(--orange); font-size: 2rem; }

.game-cols {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 2.5rem;
  align-items: start;
}

/* The ONE neat area — a clean sheet of paper */
.article-paper {
  background: var(--article-bg);
  color: #1a1510;
  padding: 2.2rem 2.4rem;
  border-radius: 2px;
  box-shadow:
    0 1px 0 #e8d9b3,
    0 14px 30px rgba(60,40,10,.22),
    0 2px 6px rgba(60,40,10,.12);
  font-family: var(--ff-read);
}

.article-paper h2 {
  font: 700 1.6rem/1.2 var(--ff-read);
  padding-bottom: .55rem;
  border-bottom: 1px solid #d8c9a5;
  margin-bottom: 1rem;
  color: #1a1510;
  letter-spacing: 0;
}

/* Side panel — derpy, not cardy */
.game-side { padding-top: .5rem; }

.side-heading {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--pink);
  margin-bottom: .6rem;
  display: inline-block;
  transform: rotate(-3deg);
}

.side-collapsible { margin: 0 0 1rem; }
.side-collapsible > summary {
  list-style: none;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .8rem;
}
.side-collapsible > summary::-webkit-details-marker { display: none; }
.side-collapsible > summary > span:first-child {
  font: 400 1.4rem var(--ff-goofy);
  color: var(--pink);
  display: inline-block;
  transform: rotate(-3deg);
}
.side-collapsible-caret {
  display: none;
  font-size: 1.1rem;
  color: var(--ink-soft);
  transition: transform .25s ease;
  padding: .25rem .4rem;
}
.side-collapsible[open] .side-collapsible-caret { transform: rotate(180deg); }
.side-collapsible > summary + .side-collapsible-body { margin-top: .4rem; }

.share-actions { margin-top: 1.2rem; }

/* ==============================================================
   ARTICLE BODY — clean serif Wikipedia-style paper
   ============================================================== */

.article-body {
  overflow-wrap: anywhere;
  font: 16px/1.65 var(--ff-read);
  color: #1e1a12;
}

.article-body p { margin: .7rem 0; }

.article-body h2 {
  font: 700 1.35rem/1.25 var(--ff-read);
  margin: 1.8rem 0 .5rem;
  padding-bottom: .35rem;
  border-bottom: 1px solid #d8c9a5;
  color: #1a1510;
  letter-spacing: 0;
}
.article-body h3 { font: 700 1.1rem/1.25 var(--ff-read); margin: 1.4rem 0 .4rem; color: #1a1510; }
.article-body h4, .article-body h5, .article-body h6 {
  font: 700 1rem/1.25 var(--ff-read); margin: 1rem 0 .3rem; color: #1a1510;
}

.article-body ul, .article-body ol { padding-left: 1.5rem; margin: .55rem 0; }
.article-body ul { list-style: disc; }
.article-body ol { list-style: decimal; }
.article-body li { margin: .22rem 0; }

.article-body dl { margin: .5rem 0; }
.article-body dt { font-weight: 700; color: #1a1510; margin-top: .4rem; }
.article-body dd { margin-left: 1.5rem; margin-bottom: .3rem; }

.article-body blockquote {
  border-left: 3px solid var(--orange);
  padding-left: 1rem;
  margin: 1rem 0;
  color: #5a4d36;
  font-style: italic;
}

.article-body code {
  font: .88em ui-monospace, "SF Mono", Menlo, monospace;
  background: rgba(0,0,0,.04);
  padding: .1rem .3rem;
  border: 1px solid #d8c9a5;
}

.article-body pre {
  font: .88em ui-monospace, "SF Mono", Menlo, monospace;
  background: rgba(0,0,0,.04);
  border: 1px solid #d8c9a5;
  padding: .7rem;
  overflow-x: auto;
  margin: .6rem 0;
}

.article-body hr { border: none; border-top: 1px solid #d8c9a5; margin: 1.5rem 0; }

.article-body img {
  max-width: 100%;
  height: auto;
  margin: .5rem 0;
  border: 1px solid #d8c9a5;
}

.article-body a[data-wiki-target] {
  color: #0b5aa4;
  text-decoration: underline;
  text-decoration-color: rgba(11,90,164,.4);
  text-underline-offset: 2px;
  cursor: pointer;
}
.article-body a[data-wiki-target]:hover {
  text-decoration-color: #0b5aa4;
  color: #0a4a87;
}
.article-body a:not([data-wiki-target]) {
  color: #8a7d6b;
  pointer-events: none;
  text-decoration: none;
}

.article-body table {
  width: auto; max-width: 100%;
  border-collapse: collapse;
  font-size: .9rem;
  margin: 1rem 0;
}
.article-body th, .article-body td {
  border: 1px solid #d8c9a5;
  padding: .3rem .5rem;
  vertical-align: top;
  text-align: left;
}
.article-body th { background: rgba(0,0,0,.04); font-weight: 700; color: #1a1510; }

.article-body .infobox {
  float: right; max-width: 280px;
  margin: 0 0 1rem 1.5rem;
  border: 1px solid #d8c9a5;
  background: rgba(0,0,0,.02);
  font-size: .85rem;
}

.article-body .thumb.tright { float: right; clear: right; margin: .5rem 0 .8rem 1.5rem; }
.article-body .thumb.tleft { float: left; clear: left; margin: .5rem 1.5rem .8rem 0; }
.article-body .thumbinner {
  border: 1px solid #d8c9a5;
  background: rgba(0,0,0,.02);
  padding: .3rem;
  font-size: .82rem;
}
.article-body .thumbcaption { padding: .3rem .2rem; color: #6a5f4f; font-size: .8rem; }

.article-body .gallery { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1rem 0; list-style: none; }
.article-body .gallerytext { font-size: .8rem; color: #6a5f4f; padding: .2rem; }

.article-body::after { content: ""; display: table; clear: both; }

/* ==============================================================
   EXPERIMENTAL ARTICLE RENDERER — block-level IR output
   ============================================================== */

.article-x {
  font: 16px/1.7 var(--ff-read);
  color: #1e1a12;
}

.article-x > * + * { margin-top: .85rem; }
.article-x > .article-x-heading { margin-top: 1.8rem; }
.article-x > .article-x-heading + * { margin-top: .55rem; }

.article-x-heading {
  font-family: var(--ff-read);
  color: #1a1510;
  letter-spacing: 0;
  padding-bottom: .35rem;
  border-bottom: 1px solid #d8c9a5;
}
.article-x-heading--2 { font: 700 1.45rem/1.25 var(--ff-read); }
.article-x-heading--3 { font: 700 1.12rem/1.25 var(--ff-read); border-bottom: none; padding-bottom: 0; }

.article-x-p {
  margin: 0;
  text-align: left;
  overflow-wrap: anywhere;
}

.article-x-list { margin: 0; padding-left: 1.5rem; }
.article-x-list li { margin: .2rem 0; }
.article-x-list--ul { list-style: disc; }
.article-x-list--ol { list-style: decimal; }

.article-x-quote {
  border-left: 3px solid var(--orange);
  padding: .2rem 0 .2rem 1rem;
  margin: 0;
  color: #5a4d36;
  font-style: italic;
}

.article-x-hr {
  border: none;
  border-top: 1px solid #d8c9a5;
  margin: 1.2rem 0;
}

/* Figures — strictly bounded, no floats, never exceed the column. */
.article-x-figure {
  margin: 1.1rem auto;
  padding: 0;
  display: block;
  text-align: center;
  max-width: min(100%, 540px);
}
.article-x-img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 380px;
  width: auto;
  height: auto;
  object-fit: contain;
  border: 1px solid #d8c9a5;
  background: rgba(255, 251, 240, .5);
}
.article-x-figcaption {
  margin-top: .45rem;
  font: italic .85rem/1.45 var(--ff-read);
  color: #6a5f4f;
  text-align: center;
  padding: 0 .4rem;
  overflow-wrap: anywhere;
}

.article-x-code {
  font: .88em ui-monospace, "SF Mono", Menlo, monospace;
  background: rgba(0,0,0,.04);
  padding: .08rem .3rem;
  border: 1px solid #d8c9a5;
}

.article-x-link {
  color: #0b5aa4;
  text-decoration: underline;
  text-decoration-color: rgba(11,90,164,.4);
  text-underline-offset: 2px;
  cursor: pointer;
}
.article-x-link:hover {
  text-decoration-color: #0b5aa4;
  color: #0a4a87;
}

.article-x-dead {
  color: #8a7d6b;
}

/* Infobox: inline "quick facts" card — no floats, no cards outside. */
.article-x-infobox {
  border: 1px solid #d8c9a5;
  background: rgba(255, 251, 240, .6);
  padding: .9rem 1.1rem;
  margin: 0;
}
.article-x-infobox-title {
  font: 700 1.1rem/1.3 var(--ff-read);
  color: #1a1510;
  margin-bottom: .55rem;
  padding-bottom: .35rem;
  border-bottom: 1px solid #d8c9a5;
}
.article-x-infobox-body { font-size: .95rem; }
.article-x-infobox-body > * + * { margin-top: .35rem; }
.article-x-infobox-section {
  font: 700 .95rem/1.3 var(--ff-read);
  color: #1a1510;
  margin-top: .8rem;
  padding-top: .45rem;
  border-top: 1px solid #e4d6b2;
  text-transform: uppercase;
  letter-spacing: .02em;
}
.article-x-infobox-body > .article-x-infobox-section:first-child { margin-top: 0; border-top: none; padding-top: 0; }
.article-x-infobox-pair {
  display: grid;
  grid-template-columns: minmax(7rem, max-content) minmax(0, 1fr);
  gap: .25rem .8rem;
}
.article-x-infobox-label {
  font-weight: 700;
  color: #1a1510;
}
.article-x-infobox-value {
  color: #3a2f1f;
  overflow-wrap: anywhere;
}
.article-x-infobox-note {
  margin: 0;
  color: #3a2f1f;
  overflow-wrap: anywhere;
}
.article-x-infobox-img {
  display: block;
  margin: .3rem auto;
  max-width: 100%;
  max-height: 260px;
  width: auto;
  height: auto;
  object-fit: contain;
  border: 1px solid #d8c9a5;
  background: rgba(255, 251, 240, .5);
}

/* Clean tables — never float, horizontal scroll if needed. */
.article-x-table-wrap {
  overflow-x: auto;
  border: 1px solid #d8c9a5;
  background: rgba(255, 251, 240, .4);
  max-width: 100%;
}
.article-x-table {
  border-collapse: collapse;
  font-size: .92rem;
  width: 100%;
  min-width: max-content;
  table-layout: auto;
}
.article-x-table-caption {
  caption-side: top;
  padding: .45rem .6rem;
  font: 700 .95rem/1.25 var(--ff-read);
  text-align: left;
  color: #1a1510;
  background: rgba(0,0,0,.03);
  border-bottom: 1px solid #d8c9a5;
}
.article-x-table th,
.article-x-table td {
  border: 1px solid #e4d6b2;
  padding: .4rem .6rem;
  vertical-align: top;
  text-align: left;
  color: #1e1a12;
}
.article-x-table th {
  background: rgba(0,0,0,.04);
  font-weight: 700;
  color: #1a1510;
}

@media (max-width: 640px) {
  .article-x-infobox-pair { grid-template-columns: 1fr; gap: .1rem; }
}

.renderer-toggle {
  display: inline-block;
  margin-top: 1rem;
  font: 400 1rem var(--ff-goofy);
  color: var(--lav);
  text-decoration: underline wavy var(--sun);
  text-underline-offset: 3px;
  transform: rotate(-1deg);
}
.renderer-toggle:hover { color: var(--pink); }

/* ==============================================================
   LEADERBOARD TABLE — derpy, borderless
   ============================================================== */

.board-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ff-read);
  font-size: 1.15rem;
}
.board-table th {
  text-align: left;
  font: 400 1.1rem var(--ff-goofy);
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
  font: 400 1.5rem var(--ff-goofy);
  width: 2.6rem;
  color: var(--ink-soft);
}
.board-table tbody tr:nth-child(1) td:first-child { color: var(--sun); }
.board-table tbody tr:nth-child(2) td:first-child { color: #b7a890; }
.board-table tbody tr:nth-child(3) td:first-child { color: var(--orange); }

/* ==============================================================
   ARCHIVE LIST
   ============================================================== */

.archive-list { list-style: none; display: grid; gap: 1rem; margin-top: 1rem; }
.archive-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: .8rem 0;
  border-bottom: 2px dotted rgba(42,28,16,.25);
  font: 1.2rem var(--ff-read);
}
.archive-list li:nth-child(odd) { transform: rotate(-.5deg); }
.archive-list li:nth-child(even) { transform: rotate(.5deg); }
.archive-list li a {
  font-family: var(--ff-goofy);
  font-size: 1.5rem;
  color: var(--orange);
  text-decoration: none;
}
.archive-list li a:hover { color: var(--pink); text-decoration: underline wavy; }
.archive-list li span { color: var(--ink-soft); }

/* ==============================================================
   RESPONSIVE — click-only refinements
   ============================================================== */

@media (max-width: 900px) {
  .game-cols { grid-template-columns: 1fr; }
  .game-topline { flex-direction: column; }
  .game-stats { width: 100%; }
  .board-item:nth-child(2),
  .board-item:nth-child(3) { padding-left: 0; }

  .article-body .infobox,
  .article-body .thumb.tright {
    float: none; max-width: 100%; margin: 1rem 0;
  }
}

@media (max-width: 720px) {
  /* Hero — snugger on phones */
  .hero { padding: 2rem 0 1.8rem; }
  .hero::before { font-size: 2rem; top: .4rem; right: 5%; }
  .hero::after { font-size: 1.8rem; bottom: .4rem; left: 3%; }
  .hero h1 { margin-bottom: 1.1rem; }
  .hero-desc { font-size: 1.2rem; }
  .hero-btns { gap: 1rem; margin-top: 1.4rem; }

  /* Homepage board — kill the staggered indent that breaks on narrow screens */
  .board { padding: 1.2rem 0 2.2rem; }
  .board-grid { gap: 1.6rem; }
  .board-item,
  .board-item:nth-child(1),
  .board-item:nth-child(2),
  .board-item:nth-child(3) {
    transform: none;
    padding-left: 0;
  }
  .route { gap: .5rem; font-size: clamp(1.4rem, 6vw, 2rem); }

  /* =============== GAME PAGE =============== */
  .game-topline {
    display: contents; /* unwrap so .game-stats can be sticky across full shell */
  }
  .game-bar {
    padding-bottom: .6rem;
    margin-bottom: .6rem;
  }
  .game-bar-left { max-width: 100%; }
  .game-title {
    font-size: 1.4rem;
    line-height: 1.15;
    display: flex;
    flex-wrap: wrap;
    gap: .35rem .5rem;
    align-items: baseline;
  }
  .game-title > :nth-child(1),
  .game-title > :nth-child(3) { transform: none; }
  .game-arrow { padding: 0 .15rem; }

  /* Sticky compact HUD — stays in view while reading */
  .game-stats {
    position: sticky;
    top: 0;
    z-index: 20;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: .4rem .9rem;
    align-items: center;
    width: calc(100% + 1.6rem);
    margin: 0 -.8rem 1rem;
    padding: .55rem .9rem;
    background: var(--paper);
    background-image: linear-gradient(var(--paper), var(--paper));
    border-top: 3px dashed var(--ink);
    border-bottom: 3px dashed var(--ink);
    box-shadow: 0 6px 14px -8px rgba(42,28,16,.35);
  }
  .stat {
    transform: none !important;
    min-width: 0;
    display: flex;
    flex-direction: column;
    line-height: 1;
    text-align: left;
  }
  .stat--timer { order: 1; }
  .stat--target { order: 2; min-width: 0; overflow: hidden; }
  .stat:not(.stat--timer):not(.stat--target) { order: 3; text-align: right; }

  .stat-label {
    font-size: .72rem;
    letter-spacing: .02em;
    text-transform: lowercase;
    margin-bottom: .05rem;
  }
  .stat-val {
    font-size: 1.1rem;
    line-height: 1.05;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .stat--timer .stat-val {
    font-size: 1.55rem;
    font-variant-numeric: tabular-nums;
  }
  .stat--target .stat-val {
    max-width: 100%;
    font-size: 1rem;
  }

  /* Article paper — more breathing room, less rigid padding */
  .game-cols { gap: 1.6rem; }
  .article-paper {
    padding: 1.2rem 1.1rem;
    border-radius: 2px;
  }
  .article-paper h2 { font-size: 1.35rem; }

  /* Article body — bump touch targets and readability */
  .article-body { font-size: 16.5px; line-height: 1.7; }
  .article-body p { margin: .75rem 0; }
  .article-body a[data-wiki-target] {
    padding: .12rem .05rem;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 3px;
  }
  .article-body table { font-size: .85rem; }
  .article-body pre { font-size: .82em; }

  /* Side panel collapses to a details drawer under the article */
  .game-side { padding-top: 0; }
  .side-collapsible {
    border: 3px dashed var(--ink);
    border-radius: 18px 26px 14px 22px / 20px 14px 26px 16px;
    padding: .7rem 1rem .2rem;
    background: rgba(255,251,240,.6);
  }
  .side-collapsible > summary {
    cursor: pointer;
    padding: .3rem 0;
  }
  .side-collapsible-caret { display: inline-block; }
  .side-collapsible:not([open]) > summary {
    padding-bottom: .4rem;
  }
  .side-collapsible[open] > summary {
    border-bottom: 2px dotted rgba(42,28,16,.2);
    margin-bottom: .5rem;
    padding-bottom: .5rem;
  }
  .side-collapsible-body { padding-bottom: .4rem; }

  .share-actions { margin-top: 1rem; }

  /* Leaderboard tables — tighter and scrollable if needed */
  .board-table { font-size: 1rem; }
  .board-table th, .board-table td { padding: .45rem .3rem; }
  .board-table td:first-child { font-size: 1.25rem; width: 2rem; }
  .board-table td:nth-child(2) {
    max-width: 38vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Archive list stacks cleanly */
  .archive-list li { gap: .3rem; padding: .7rem 0; }
  .archive-list li a { font-size: 1.3rem; }
  .archive-list li span { font-size: 1rem; width: 100%; }
}

@media (max-width: 420px) {
  .hero h1 { font-size: clamp(2.1rem, 11vw, 3rem); }
  .game-title { font-size: 1.25rem; }
  .stat-val { font-size: 1rem; }
  .stat--timer .stat-val { font-size: 1.4rem; }
  .stat--target .stat-val { font-size: .92rem; }
  .article-paper { padding: 1rem .9rem; }
  .board-table td:nth-child(4),
  .board-table th:nth-child(4) { display: none; }
}

@media (max-width: 900px) and (orientation: landscape) and (max-height: 500px) {
  .hero { padding: 1.2rem 0 1rem; }
  .game-stats {
    padding: .35rem .8rem;
  }
  .stat--timer .stat-val { font-size: 1.3rem; }
  .stat-label { display: none; }
}
`;

export const GAME_JS = String.raw`const gameRoot = document.querySelector(".game-shell");

if (gameRoot) {
  const articleContainer = document.getElementById("article-content");
  const articleTitle = document.getElementById("article-title");
  const timerEl = document.getElementById("timer");
  const clickCountEl = document.getElementById("click-count");
  const resultEl = document.getElementById("game-result");
  const copyButton = document.getElementById("copy-link-button");

  const challengeId = gameRoot.dataset.challengeId;
  const startTitle = gameRoot.dataset.startTitle;
  const targetTitle = gameRoot.dataset.targetTitle;
  const renderer = gameRoot.dataset.renderer || "experimental";
  const articleQuery = renderer === "legacy" ? "?legacy=1" : "";

  if (
    articleContainer &&
    articleTitle &&
    timerEl &&
    clickCountEl &&
    resultEl &&
    challengeId &&
    startTitle &&
    targetTitle
  ) {
    const ARTICLE_CACHE_LIMIT = 24;
    const PREFETCH_LIMIT = 8;
    const articleCache = new Map();
    const articleCacheOrder = [];
    const requestIdle =
      window.requestIdleCallback ||
      ((callback) => window.setTimeout(() => callback(), 120));

    let currentTitle = startTitle;
    let clicks = 0;
    let path = [startTitle];
    let elapsedMs = 0;
    let activeElapsedMs = 0;
    let activeSegmentStartedAt = 0;
    let started = false;
    let finished = false;
    let loading = false;

    const touchArticleCache = (title) => {
      const index = articleCacheOrder.indexOf(title);
      if (index >= 0) {
        articleCacheOrder.splice(index, 1);
      }

      articleCacheOrder.push(title);

      while (articleCacheOrder.length > ARTICLE_CACHE_LIMIT) {
        const oldestTitle = articleCacheOrder.shift();
        if (oldestTitle) {
          articleCache.delete(oldestTitle);
        }
      }
    };

    const primeArticleCache = (title, article) => {
      articleCache.set(title, Promise.resolve(article));
      touchArticleCache(title);
    };

    const getEventAnchor = (target) => {
      if (target instanceof Element) {
        return target.closest("a[data-wiki-target]");
      }

      if (target && target.parentElement) {
        return target.parentElement.closest("a[data-wiki-target]");
      }

      return null;
    };

    const getElapsedMs = () =>
      activeElapsedMs + (activeSegmentStartedAt ? performance.now() - activeSegmentStartedAt : 0);

    const setTimer = (ms) => {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
      timerEl.textContent = minutes + ":" + seconds + "." + centiseconds;
    };

    const tick = () => {
      if (!finished) {
        elapsedMs = Math.max(0, Math.round(getElapsedMs()));
        setTimer(elapsedMs);
      }

      requestAnimationFrame(tick);
    };

    const renderResult = (message, isError = false) => {
      resultEl.classList.remove("hidden");
      resultEl.classList.toggle("error-banner", isError);
      resultEl.classList.toggle("success-banner", !isError);
      resultEl.textContent = message;
    };

    const refreshLeaderboard = (entries) => {
      const table = document.querySelector(".board-table tbody");
      if (!table) return;

      if (!entries.length) {
        table.innerHTML = '<tr><td colspan="4">No runs yet.</td></tr>';
        return;
      }

      table.innerHTML = entries
        .map((entry, index) => {
          const totalSeconds = Math.floor(entry.bestTimeMs / 1000);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = String(totalSeconds % 60).padStart(2, "0");
          const centiseconds = String(Math.floor((entry.bestTimeMs % 1000) / 10)).padStart(2, "0");
          return "<tr><td>" + (index + 1) + "</td><td>" + entry.username + "</td><td>" + minutes + ":" + seconds + "." + centiseconds + "</td><td>" + entry.bestClicks + "</td></tr>";
        })
        .join("");
    };

    const getArticle = (title) => {
      const cachedArticle = articleCache.get(title);
      if (cachedArticle) {
        touchArticleCache(title);
        return cachedArticle;
      }

      const request = fetch("/api/wikipedia/" + encodeURIComponent(title) + articleQuery)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Could not load the next article.");
          }

          return await response.json();
        })
        .catch((error) => {
          articleCache.delete(title);
          const index = articleCacheOrder.indexOf(title);
          if (index >= 0) {
            articleCacheOrder.splice(index, 1);
          }
          throw error;
        });

      articleCache.set(title, request);
      touchArticleCache(title);
      return request;
    };

    const prefetchLikelyLinks = () => {
      const queuedTitles = new Set([currentTitle]);
      const titles = [];

      for (const anchor of articleContainer.querySelectorAll("a[data-wiki-target]")) {
        const nextTitle = anchor.dataset.wikiTarget;
        if (!nextTitle || queuedTitles.has(nextTitle)) {
          continue;
        }

        queuedTitles.add(nextTitle);
        titles.push(nextTitle);

        if (titles.length >= PREFETCH_LIMIT) {
          break;
        }
      }

      requestIdle(() => {
        for (const title of titles) {
          void getArticle(title);
        }
      });
    };

    const submitRun = async () => {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          challengeId,
          timeMs: elapsedMs,
          clicks,
          path
        })
      });

      if (!response.ok) {
        renderResult("Finished, but run submission failed.", true);
        return;
      }

      const payload = await response.json();
      refreshLeaderboard(payload.leaderboard || []);
      renderResult("Finished in " + timerEl.textContent + ". Rank #" + (payload.rank || "?") + ".");
    };

    const loadArticle = async (title) => {
      try {
        const article = await getArticle(title);
        currentTitle = article.title;
        articleTitle.textContent = article.displayTitle || article.title;
        articleContainer.innerHTML = article.html;

        if (currentTitle === targetTitle) {
          finished = true;
          elapsedMs = Math.max(0, Math.round(activeElapsedMs));
          setTimer(elapsedMs);
          await submitRun();
          return true;
        }

        activeSegmentStartedAt = performance.now();
        prefetchLikelyLinks();
        return true;
      } catch {
        renderResult("Could not load the next article.", true);
        return false;
      } finally {
        loading = false;
      }
    };

    primeArticleCache(startTitle, {
      title: startTitle,
      displayTitle: articleTitle.textContent || startTitle,
      html: articleContainer.innerHTML
    });
    prefetchLikelyLinks();

    document.addEventListener("click", async (event) => {
      const anchor = getEventAnchor(event.target);
      if (!anchor || finished || loading) return;

      event.preventDefault();

      const nextTitle = anchor.dataset.wikiTarget;
      if (!nextTitle) return;

      const wasStarted = started;
      if (started && activeSegmentStartedAt) {
        activeElapsedMs += performance.now() - activeSegmentStartedAt;
        activeSegmentStartedAt = 0;
      } else if (!started) {
        started = true;
      }

      clicks += 1;
      loading = true;
      clickCountEl.textContent = String(clicks);
      path.push(nextTitle);
      const loaded = await loadArticle(nextTitle);

      if (!loaded) {
        clicks -= 1;
        clickCountEl.textContent = String(clicks);
        path.pop();

        if (wasStarted) {
          activeSegmentStartedAt = performance.now();
        } else {
          started = false;
          elapsedMs = 0;
          setTimer(0);
        }
      }
    });

    copyButton?.addEventListener("click", async () => {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = "Copy challenge link";
      }, 1500);
    });

    tick();
  }
}
`;
