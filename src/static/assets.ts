export const STYLE_CSS = String.raw`/* click! */
:root {
  --bg: #08090c;
  --surface: #111318;
  --text: #cdc8be;
  --text-bright: #f5f0e8;
  --accent: #ff8a00;
  --teal: #00e5a0;
  --danger: #ff5757;
  --muted: #5e5a6e;
  --border: #1e2028;
  --border-bright: #2c2e3a;
  --font-body: 'Space Grotesk', system-ui, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-mono: 'Space Mono', ui-monospace, monospace;
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
}

h1, h2, h3 {
  font-family: var(--font-display);
  color: var(--text-bright);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.12s;
}

a:hover { color: #ffaa44; }

button, input { font-family: var(--font-body); }

/* ---- BUTTONS ---- */

.btn-primary {
  display: inline-block;
  border: none;
  background: var(--accent);
  color: var(--bg);
  padding: 0.85rem 2rem;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.12s, box-shadow 0.12s;
}

.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.4s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 138, 0, 0.25);
}

.btn-primary:hover::after { transform: translateX(100%); }
.btn-primary:active { transform: translateY(0); }

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2rem;
  border: 2px solid var(--border-bright);
  background: transparent;
  color: var(--text);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, transform 0.12s;
}

.btn-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
  text-decoration: none;
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-bright);
  color: var(--muted);
  padding: 0.5rem 1rem;
  font-size: 0.82rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.btn-ghost:hover {
  color: var(--text-bright);
  border-color: var(--muted);
}

/* ---- INPUTS ---- */

input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid var(--border-bright);
  background: var(--surface);
  color: var(--text-bright);
  font-size: 1rem;
  transition: border-color 0.15s;
}

input:focus {
  outline: none;
  border-color: var(--accent);
}

input::placeholder { color: var(--muted); }

/* ---- LAYOUT ---- */

.shell {
  width: min(1080px, calc(100% - 3rem));
  margin: 0 auto;
}

/* ---- HEADER ---- */

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(8, 9, 12, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.site-header::after {
  content: '';
  display: block;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--teal), var(--accent));
  background-size: 200% 100%;
  animation: shimmer 4s ease infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 0;
}

.brand {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-bright);
  text-decoration: none;
}

.brand:hover {
  text-decoration: none;
  color: var(--text-bright);
}

.brand-bang {
  color: var(--accent);
  display: inline-block;
  animation: wiggle 3s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes wiggle {
  0%, 85%, 100% { transform: rotate(0deg); }
  88% { transform: rotate(12deg); }
  91% { transform: rotate(-10deg); }
  94% { transform: rotate(8deg); }
  97% { transform: rotate(-4deg); }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.88rem;
  font-weight: 500;
}

.nav-links a {
  color: var(--muted);
  transition: color 0.12s;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent);
  transition: width 0.2s;
}

.nav-links a:hover {
  color: var(--text-bright);
  text-decoration: none;
}

.nav-links a:hover::after { width: 100%; }
.nav-links form { margin: 0; }

.nav-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 500;
  padding: 0;
  cursor: pointer;
  transition: color 0.12s;
}

.nav-btn:hover { color: var(--text-bright); }

/* ---- MAIN ---- */

.page {
  padding: 4rem 0 6rem;
  animation: fadeUp 0.4s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

/* ---- FOOTER ---- */

.site-footer {
  padding: 2.5rem 0 3rem;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--muted);
  font-size: 0.78rem;
  letter-spacing: 0.01em;
}

/* ---- TAGS ---- */

.tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  padding: 0.2rem 0.7rem;
  background: rgba(255, 138, 0, 0.1);
  color: var(--accent);
  border: 1px solid rgba(255, 138, 0, 0.2);
  transform: rotate(-1.5deg);
  margin-bottom: 1rem;
}

.tag--teal {
  color: var(--teal);
  background: rgba(0, 229, 160, 0.08);
  border-color: rgba(0, 229, 160, 0.2);
}

/* ========== HOMEPAGE ========== */

.home-intro {
  max-width: 700px;
  padding-bottom: 4rem;
}

.home-intro h1 {
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  font-weight: 900;
  margin-bottom: 1.2rem;
  line-height: 1.02;
}

.home-intro h1 em {
  font-style: italic;
  color: var(--accent);
  -webkit-text-fill-color: var(--accent);
}

.home-sub {
  color: var(--muted);
  font-size: 1.05rem;
  max-width: 500px;
  line-height: 1.7;
}

.home-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
  align-items: center;
}

/* ---- MISSION / TODAY ---- */

.mission {
  padding: 3rem 0;
  position: relative;
}

.mission::before,
.mission::after {
  content: '';
  position: absolute;
  left: -1.5rem;
  right: -1.5rem;
  height: 1px;
  background: repeating-linear-gradient(90deg, var(--border-bright) 0, var(--border-bright) 8px, transparent 8px, transparent 16px);
}

.mission::before { top: 0; }
.mission::after { bottom: 0; }

.mission-route {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
}

.mission-endpoint {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text-bright);
}

.mission-arrow {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 1.4rem;
  font-weight: 700;
  animation: nudge 2.5s ease-in-out infinite;
  letter-spacing: -0.15em;
}

@keyframes nudge {
  0%, 100% { transform: translateX(0); opacity: 1; }
  50% { transform: translateX(8px); opacity: 0.6; }
}

.home-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding-top: 3rem;
}

.info-block {
  padding-left: 1.2rem;
  border-left: 2px solid var(--border-bright);
}

.info-block h3 {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--teal);
  margin-bottom: 0.4rem;
}

.info-block p {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

/* ========== GAME PAGE ========== */

.game-shell { }

.game-topbar {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.game-topbar h1 {
  font-size: 1.6rem;
  margin-top: 0.4rem;
}

.status-panel {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.stat-box {
  text-align: center;
  min-width: 110px;
  padding: 0.65rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border-bright);
}

.stat-box .stat-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.55rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--muted);
  margin-bottom: 0.15rem;
}

.stat-box .stat-value {
  display: block;
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-bright);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.timer-box {
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(255, 138, 0, 0.08);
}

.timer-box .stat-value {
  color: var(--accent);
  font-size: 1.4rem;
}

.game-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 2.5rem;
}

.article-zone {
  border-left: 3px solid var(--accent);
  padding-left: 1.5rem;
}

.article-zone h2 {
  font-size: 1.4rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.2rem;
}

.sidebar { padding-top: 0.3rem; }

.sidebar h2 {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--muted);
  margin-bottom: 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--border);
}

/* ========== ARTICLE BODY (Wikipedia content) ========== */

.article-body {
  overflow-wrap: anywhere;
  font-size: 0.94rem;
  line-height: 1.75;
  color: var(--text);
}

.article-body p {
  margin: 0.6rem 0;
}

.article-body h2 {
  font-size: 1.25rem;
  margin: 2rem 0 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
}

.article-body h3 {
  font-size: 1.05rem;
  margin: 1.5rem 0 0.4rem;
}

.article-body h4, .article-body h5, .article-body h6 {
  font-size: 0.95rem;
  margin: 1.2rem 0 0.3rem;
  color: var(--text-bright);
}

.article-body ul,
.article-body ol {
  padding-left: 1.6rem;
  margin: 0.5rem 0;
}

.article-body ul { list-style: disc; }
.article-body ol { list-style: decimal; }

.article-body li {
  margin: 0.2rem 0;
  padding-left: 0.2rem;
}

.article-body li > ul,
.article-body li > ol {
  margin: 0.15rem 0;
}

.article-body dl {
  margin: 0.5rem 0;
}

.article-body dt {
  font-weight: 600;
  color: var(--text-bright);
  margin-top: 0.4rem;
}

.article-body dd {
  margin-left: 1.5rem;
  margin-bottom: 0.3rem;
}

.article-body blockquote {
  border-left: 2px solid var(--accent);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--muted);
  font-style: italic;
}

.article-body pre,
.article-body code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: var(--surface);
  border: 1px solid var(--border);
}

.article-body code {
  padding: 0.1rem 0.3rem;
}

.article-body pre {
  padding: 0.8rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.article-body hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.5rem 0;
}

.article-body img {
  max-width: 100%;
  height: auto;
  opacity: 0.85;
  border: 1px solid var(--border-bright);
  margin: 0.5rem 0;
}

.article-body a[data-wiki-target] {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: rgba(255, 138, 0, 0.2);
  text-underline-offset: 2px;
  text-decoration-thickness: 1.5px;
  transition: text-decoration-color 0.12s, color 0.12s;
  cursor: pointer;
}

.article-body a[data-wiki-target]:hover {
  text-decoration-color: var(--accent);
  color: #ffaa44;
}

.article-body a:not([data-wiki-target]) {
  color: var(--muted);
  pointer-events: none;
  text-decoration: none;
}

/* Tables */

.article-body table {
  width: auto;
  max-width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin: 1rem 0;
  display: table;
  overflow-x: auto;
}

.article-body .mw-parser-output > table,
.article-body > table {
  display: block;
  overflow-x: auto;
}

.article-body th,
.article-body td {
  border: 1px solid var(--border-bright);
  padding: 0.35rem 0.6rem;
  vertical-align: top;
  text-align: left;
}

.article-body th {
  background: var(--surface);
  color: var(--text-bright);
  font-weight: 600;
}

.article-body caption {
  font-weight: 600;
  padding: 0.3rem 0;
  text-align: left;
  color: var(--text-bright);
  font-size: 0.88rem;
}

/* Infobox */
.article-body .infobox {
  float: right;
  max-width: 300px;
  margin: 0 0 1rem 1.5rem;
  border: 1px solid var(--border-bright);
  background: var(--surface);
  font-size: 0.82rem;
}

.article-body .infobox th,
.article-body .infobox td {
  border-color: var(--border);
}

.article-body .infobox th {
  text-align: center;
  background: rgba(255, 138, 0, 0.06);
}

/* Wikitable */
.article-body .wikitable {
  border: 1px solid var(--border-bright);
}

.article-body .wikitable th {
  background: rgba(255, 138, 0, 0.06);
}

/* Thumbs and figure captions */
.article-body .thumb,
.article-body .tmulti {
  margin: 0.8rem 0;
  max-width: 100%;
}

.article-body .thumb.tright {
  float: right;
  clear: right;
  margin: 0.5rem 0 0.8rem 1.5rem;
}

.article-body .thumb.tleft {
  float: left;
  clear: left;
  margin: 0.5rem 1.5rem 0.8rem 0;
}

.article-body .thumbinner {
  border: 1px solid var(--border-bright);
  background: var(--surface);
  padding: 0.3rem;
  font-size: 0.8rem;
}

.article-body .thumbcaption {
  padding: 0.3rem 0.2rem;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.4;
}

.article-body .thumbimage {
  border: none;
  margin: 0;
}

/* Gallery */
.article-body .gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  list-style: none;
  padding: 0;
}

.article-body .gallerybox {
  flex: 0 0 auto;
}

.article-body .gallerytext {
  font-size: 0.78rem;
  color: var(--muted);
  padding: 0.2rem;
}

/* Override inline background colors from Wikipedia */
.article-body [style*="background"]:not(img):not([data-wiki-target]) {
  background-color: var(--surface) !important;
}

.article-body [style*="color"]:not(a):not(img) {
  color: var(--text) !important;
}

/* Collapsible / mw-collapsible */
.article-body .mw-collapsible-content { display: block; }

/* Clear floats */
.article-body::after {
  content: '';
  display: table;
  clear: both;
}

/* ========== AUTH ========== */

.auth-zone {
  max-width: 380px;
  margin: 0 auto;
}

.auth-zone h1 {
  font-size: 2.2rem;
  margin-bottom: 0.3rem;
}

.auth-hint {
  color: var(--muted);
  font-size: 0.88rem;
  margin-bottom: 2rem;
}

.stack-form {
  display: grid;
  gap: 1.2rem;
}

.stack-form label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stack-form button { margin-top: 0.5rem; }

/* ========== SECTION PAGES ========== */

.section-page { max-width: 700px; }

.section-page h1 {
  font-size: 2rem;
  margin-bottom: 0.4rem;
}

.section-sub {
  color: var(--muted);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

/* ---- BOARD TABLE ---- */

.board-table {
  width: 100%;
  border-collapse: collapse;
}

.board-table th {
  text-align: left;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--muted);
  padding: 0.5rem 0.5rem;
  border-bottom: 2px solid var(--border-bright);
}

.board-table td {
  padding: 0.55rem 0.5rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
  transition: background 0.1s;
}

.board-table tbody tr:hover td {
  background: rgba(255, 138, 0, 0.04);
}

.board-table td:first-child {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 1.05rem;
  width: 2.5rem;
  color: var(--muted);
}

.board-table tbody tr:nth-child(1) td:first-child {
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

.board-table tbody tr:nth-child(2) td:first-child { color: #c0c0c0; }
.board-table tbody tr:nth-child(3) td:first-child { color: #cd7f32; }

/* ---- ARCHIVE ---- */

.archive-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0;
}

.archive-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.92rem;
  transition: padding-left 0.15s;
}

.archive-list li:hover { padding-left: 0.5rem; }

.archive-list li span {
  color: var(--muted);
  font-size: 0.85rem;
}

/* ---- BANNERS ---- */

.error-banner,
.success-banner {
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  border-left: 3px solid;
  margin-bottom: 1.5rem;
}

.error-banner {
  background: rgba(255, 87, 87, 0.06);
  border-color: var(--danger);
  color: var(--danger);
}

.success-banner {
  background: rgba(0, 229, 160, 0.06);
  border-color: var(--teal);
  color: var(--teal);
}

.result-banner { font-weight: 600; }
.share-actions { margin-top: 1.2rem; }

.hidden { display: none; }
.muted { color: var(--muted); }

/* ========== RESPONSIVE ========== */

@media (max-width: 900px) {
  .game-layout { grid-template-columns: 1fr; }
  .game-topbar { flex-direction: column; }
  .status-panel { width: 100%; }

  .sidebar {
    border-top: 1px solid var(--border);
    padding-top: 1.5rem;
  }

  .home-info {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .article-body .infobox,
  .article-body .thumb.tright {
    float: none;
    max-width: 100%;
    margin: 1rem 0;
  }
}

@media (max-width: 640px) {
  .nav-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }

  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
  }

  .status-panel { flex-direction: column; }

  .mission-route {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .home-intro h1 { font-size: 1.8rem; }
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

  let currentTitle = startTitle;
  let clicks = 0;
  let path = [startTitle];
  let startedAt = 0;
  let elapsedMs = 0;
  let finished = false;

  const getEventAnchor = (target) => {
    if (target instanceof Element) {
      return target.closest("a[data-wiki-target]");
    }

    if (target && target.parentElement) {
      return target.parentElement.closest("a[data-wiki-target]");
    }

    return null;
  };

  const setTimer = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    timerEl.textContent = minutes + ":" + seconds + "." + centiseconds;
  };

  const tick = () => {
    if (startedAt && !finished) {
      elapsedMs = Date.now() - startedAt;
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
    const response = await fetch("/api/wikipedia/" + encodeURIComponent(title));
    if (!response.ok) {
      renderResult("Could not load the next article.", true);
      return;
    }

    const article = await response.json();
    currentTitle = article.title;
    articleTitle.textContent = article.displayTitle || article.title;
    articleContainer.innerHTML = article.html;

    if (currentTitle === targetTitle) {
      finished = true;
      await submitRun();
    }
  };

  document.addEventListener("click", async (event) => {
    const anchor = getEventAnchor(event.target);
    if (!anchor || finished) return;

    event.preventDefault();

    const nextTitle = anchor.dataset.wikiTarget;
    if (!nextTitle) return;

    if (!startedAt) {
      startedAt = Date.now();
    }

    clicks += 1;
    clickCountEl.textContent = String(clicks);
    path.push(nextTitle);
    await loadArticle(nextTitle);
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
`;
