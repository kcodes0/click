export const STYLE_CSS = String.raw`/* click! */
:root {
  --bg: #12100e;
  --surface: #1c1915;
  --paper: #f0e6d0;
  --paper-shadow: rgba(0,0,0,0.35);
  --sticky: #ffe27a;
  --sticky-alt: #ffcc80;
  --text: #d8ccb4;
  --text-bright: #fff8ec;
  --accent: #ff8a00;
  --teal: #00e5a0;
  --danger: #ff5757;
  --muted: #7a6f5f;
  --border: #2a2520;
  --border-bright: #3a332b;
  --font-body: 'Space Grotesk', system-ui, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-mono: 'Space Mono', ui-monospace, monospace;
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
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

/* warm grain texture */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
}

/* cork-like subtle pattern */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, rgba(60,50,35,0.15) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 0;
}

body > * { position: relative; z-index: 1; }

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

a:hover { color: #ffbb44; }

button, input { font-family: var(--font-body); }

/* ======== BUTTONS ======== */

.btn-primary {
  display: inline-block;
  border: none;
  background: var(--accent);
  color: var(--bg);
  padding: 0.9rem 2.2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.12s, box-shadow 0.12s;
  text-decoration: none;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.3);
}

.btn-primary:hover {
  transform: translate(-1px, -2px);
  box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
  color: var(--bg);
  text-decoration: none;
}

.btn-primary:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 rgba(0,0,0,0.3);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  padding: 0.9rem 2.2rem;
  border: 2px solid var(--border-bright);
  background: transparent;
  color: var(--text);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, transform 0.12s;
  text-decoration: none;
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

/* ======== INPUTS ======== */

input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid var(--border-bright);
  background: var(--surface);
  color: var(--text-bright);
  font-size: 1rem;
  transition: border-color 0.15s;
}

input:focus { outline: none; border-color: var(--accent); }
input::placeholder { color: var(--muted); }

/* ======== LAYOUT ======== */

.shell {
  width: min(1080px, calc(100% - 3rem));
  margin: 0 auto;
}

/* ======== HEADER ======== */

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(18, 16, 14, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.site-header::after {
  content: '';
  display: block;
  height: 3px;
  background: linear-gradient(90deg, var(--accent) 0%, var(--teal) 40%, var(--accent) 80%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 5s ease infinite;
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
  padding: 0.8rem 0;
}

.brand {
  font-family: var(--font-mono);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-bright);
  text-decoration: none;
}

.brand:hover { text-decoration: none; color: var(--text-bright); }

.brand-bang {
  color: var(--accent);
  display: inline-block;
  animation: wiggle 4s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes wiggle {
  0%, 80%, 100% { transform: rotate(0deg); }
  84% { transform: rotate(14deg); }
  88% { transform: rotate(-12deg); }
  92% { transform: rotate(8deg); }
  96% { transform: rotate(-3deg); }
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

.nav-links a:hover { color: var(--text-bright); text-decoration: none; }
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

/* ======== MAIN ======== */

.page {
  padding: 4rem 0 6rem;
  animation: fadeUp 0.4s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
}

/* ======== FOOTER ======== */

.site-footer {
  padding: 2rem 0 2.5rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.78rem;
  font-style: italic;
  letter-spacing: 0.01em;
}

/* ======== TAGS ======== */

.tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  padding: 0.2rem 0.7rem;
  background: rgba(255, 138, 0, 0.12);
  color: var(--accent);
  border: 1px solid rgba(255, 138, 0, 0.25);
  transform: rotate(-1.5deg);
  margin-bottom: 1rem;
}

.tag--teal {
  color: var(--teal);
  background: rgba(0, 229, 160, 0.08);
  border-color: rgba(0, 229, 160, 0.2);
}

/* ============================================================
   PINNED NOTE COMPONENT
   ============================================================ */

.note {
  background: var(--paper);
  color: #2a2318;
  padding: 1.5rem 1.4rem 1.3rem;
  position: relative;
  box-shadow: 3px 4px 15px var(--paper-shadow), 0 1px 3px rgba(0,0,0,0.2);
  max-width: 340px;
  width: 100%;
}

/* tape strip across top */
.note::before {
  content: '';
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%) rotate(0.5deg);
  width: 72px;
  height: 18px;
  background: rgba(215, 200, 165, 0.55);
  border: 1px solid rgba(190, 175, 140, 0.2);
  z-index: 2;
}

.note--tilt-r { transform: rotate(1.2deg); }
.note--tilt-l { transform: rotate(-1.8deg); }

.note-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #8a7d6b;
  margin-bottom: 0.6rem;
}

.note-route {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.note-route strong {
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: #1a1510;
}

.note-arrow {
  font-family: var(--font-mono);
  color: var(--accent);
  font-weight: 700;
  font-size: 1.2rem;
}

/* ============================================================
   STICKY NOTE COMPONENT
   ============================================================ */

.sticky {
  background: var(--sticky);
  color: #3a3520;
  padding: 1.1rem 1rem 0.9rem;
  max-width: 220px;
  width: 100%;
  box-shadow: 2px 3px 10px rgba(0,0,0,0.25);
  font-size: 0.85rem;
  line-height: 1.45;
  position: relative;
}

/* folded corner effect */
.sticky::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, var(--sticky) 50%, rgba(0,0,0,0.08) 50%);
}

.sticky strong {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #5a4f30;
  margin-bottom: 0.3rem;
}

.sticky--1 { transform: rotate(-2.5deg); }
.sticky--2 { transform: rotate(1.8deg); background: var(--sticky-alt); }
.sticky--2::after { background: linear-gradient(135deg, var(--sticky-alt) 50%, rgba(0,0,0,0.08) 50%); }

/* ============================================================
   HOMEPAGE
   ============================================================ */

.hero-wrap {
  position: relative;
  margin: -4rem -1.5rem 0;
  padding: 4rem 1.5rem 3rem;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  background: url('/static/hero.jpg') center center / cover no-repeat;
}

.hero-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(18,16,14,0.88) 0%,
    rgba(18,16,14,0.7) 40%,
    rgba(18,16,14,0.45) 100%
  );
  z-index: 1;
}

.hero {
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  font-weight: 900;
  margin-bottom: 1.2rem;
  line-height: 1.02;
  text-shadow: 0 2px 30px rgba(0,0,0,0.6);
}

.hero h1 em {
  font-style: italic;
  color: var(--accent);
}

.hero-sub {
  color: var(--text-bright);
  font-size: 1.05rem;
  max-width: 480px;
  line-height: 1.7;
  text-shadow: 0 1px 10px rgba(0,0,0,0.5);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
  align-items: center;
}

.pinboard {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 3rem 0 2rem;
  position: relative;
}

/* dotted "string" connecting the notes */
.pinboard::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 2px;
  border-top: 2px dashed rgba(255, 138, 0, 0.2);
  z-index: 0;
  transform: rotate(-0.5deg);
}

.pinboard > * { z-index: 1; }

/* ============================================================
   GAME PAGE
   ============================================================ */

.game-shell { }

.game-topbar {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px dashed var(--border-bright);
}

.game-topbar h1 {
  font-size: 1.5rem;
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

/* article zone = paper document on dark desk */
.article-zone {
  background: var(--paper);
  color: #2a2318;
  padding: 2rem 2rem 2.5rem;
  box-shadow: 4px 5px 20px var(--paper-shadow), 0 1px 4px rgba(0,0,0,0.15);
  position: relative;
}

/* tape strip on article */
.article-zone::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 30px;
  width: 80px;
  height: 18px;
  background: rgba(215, 200, 165, 0.5);
  border: 1px solid rgba(190, 175, 140, 0.2);
  transform: rotate(3deg);
  z-index: 2;
}

.article-zone h2 {
  font-size: 1.4rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid #c8b898;
  margin-bottom: 1rem;
  color: #1a1510;
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

/* ============================================================
   ARTICLE BODY (Wikipedia content - light paper background)
   ============================================================ */

.article-body {
  overflow-wrap: anywhere;
  font-size: 0.94rem;
  line-height: 1.75;
  color: #2a2318;
}

.article-body p { margin: 0.6rem 0; }

.article-body h2 {
  font-size: 1.2rem;
  margin: 2rem 0 0.5rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid #c8b898;
  color: #1a1510;
}

.article-body h3 {
  font-size: 1.05rem;
  margin: 1.5rem 0 0.4rem;
  color: #1a1510;
}

.article-body h4, .article-body h5, .article-body h6 {
  font-size: 0.95rem;
  margin: 1.2rem 0 0.3rem;
  color: #2a2318;
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
.article-body li > ol { margin: 0.15rem 0; }

.article-body dl { margin: 0.5rem 0; }

.article-body dt {
  font-weight: 600;
  color: #1a1510;
  margin-top: 0.4rem;
}

.article-body dd {
  margin-left: 1.5rem;
  margin-bottom: 0.3rem;
}

.article-body blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  margin: 1rem 0;
  color: #5a5040;
  font-style: italic;
}

.article-body pre,
.article-body code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: rgba(0,0,0,0.04);
  border: 1px solid #c8b898;
}

.article-body code { padding: 0.1rem 0.3rem; }

.article-body pre {
  padding: 0.8rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.article-body hr {
  border: none;
  border-top: 1px solid #c8b898;
  margin: 1.5rem 0;
}

.article-body img {
  max-width: 100%;
  height: auto;
  margin: 0.5rem 0;
  border: 1px solid #c8b898;
}

.article-body a[data-wiki-target] {
  color: #c06800;
  text-decoration: underline;
  text-decoration-color: rgba(192, 104, 0, 0.3);
  text-underline-offset: 2px;
  text-decoration-thickness: 1.5px;
  transition: text-decoration-color 0.12s, color 0.12s;
  cursor: pointer;
}

.article-body a[data-wiki-target]:hover {
  text-decoration-color: #c06800;
  color: #e07800;
}

.article-body a:not([data-wiki-target]) {
  color: #8a7d6b;
  pointer-events: none;
  text-decoration: none;
}

/* Tables on paper */
.article-body table {
  width: auto;
  max-width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin: 1rem 0;
  display: table;
}

.article-body .mw-parser-output > table,
.article-body > table {
  display: block;
  overflow-x: auto;
}

.article-body th,
.article-body td {
  border: 1px solid #c8b898;
  padding: 0.35rem 0.6rem;
  vertical-align: top;
  text-align: left;
}

.article-body th {
  background: rgba(0,0,0,0.04);
  color: #1a1510;
  font-weight: 600;
}

.article-body caption {
  font-weight: 600;
  padding: 0.3rem 0;
  text-align: left;
  color: #1a1510;
  font-size: 0.88rem;
}

.article-body .infobox {
  float: right;
  max-width: 280px;
  margin: 0 0 1rem 1.5rem;
  border: 1px solid #c8b898;
  background: rgba(0,0,0,0.02);
  font-size: 0.82rem;
}

.article-body .wikitable { border: 1px solid #c8b898; }

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
  border: 1px solid #c8b898;
  background: rgba(0,0,0,0.02);
  padding: 0.3rem;
  font-size: 0.8rem;
}

.article-body .thumbcaption {
  padding: 0.3rem 0.2rem;
  color: #6a5f4f;
  font-size: 0.78rem;
  line-height: 1.4;
}

.article-body .thumbimage { border: none; margin: 0; }

.article-body .gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  list-style: none;
  padding: 0;
}

.article-body .gallerytext {
  font-size: 0.78rem;
  color: #6a5f4f;
  padding: 0.2rem;
}

.article-body .mw-collapsible-content { display: block; }

.article-body::after {
  content: '';
  display: table;
  clear: both;
}

/* ============================================================
   AUTH
   ============================================================ */

.auth-zone {
  max-width: 380px;
  margin: 0 auto;
  background: var(--paper);
  color: #2a2318;
  padding: 2rem 1.8rem;
  box-shadow: 3px 4px 15px var(--paper-shadow);
  position: relative;
  transform: rotate(-0.5deg);
}

/* tape strip */
.auth-zone::before {
  content: '';
  position: absolute;
  top: -7px;
  left: 40%;
  width: 70px;
  height: 18px;
  background: rgba(215, 200, 165, 0.55);
  border: 1px solid rgba(190, 175, 140, 0.2);
  transform: rotate(2deg);
  z-index: 2;
}

.auth-zone h1 {
  font-size: 2rem;
  margin-bottom: 0.3rem;
  color: #1a1510;
}

.auth-hint {
  color: #7a6f5f;
  font-size: 0.88rem;
  margin-bottom: 1.5rem;
}

.auth-zone .stack-form label {
  color: #5a5040;
}

.auth-zone input {
  background: #fff;
  border-color: #c8b898;
  color: #2a2318;
}

.auth-zone input:focus { border-color: var(--accent); }

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

/* ============================================================
   SECTION PAGES
   ============================================================ */

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

/* ======== BOARD TABLE ======== */

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

/* ======== ARCHIVE ======== */

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

/* ======== BANNERS ======== */

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

/* ============================================================
   RESPONSIVE
   ============================================================ */

@media (max-width: 900px) {
  .game-layout { grid-template-columns: 1fr; }
  .game-topbar { flex-direction: column; }
  .status-panel { width: 100%; flex-wrap: wrap; }

  .sidebar {
    border-top: 1px solid var(--border);
    padding-top: 1.5rem;
  }

  .pinboard { justify-content: center; }

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

  .nav-links { gap: 1rem; flex-wrap: wrap; }
  .status-panel { flex-direction: column; }

  .pinboard {
    flex-direction: column;
    align-items: center;
  }

  .hero h1 { font-size: 2rem; }

  .article-zone { padding: 1.2rem; }
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
