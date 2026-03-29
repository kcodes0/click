export const STYLE_CSS = String.raw`/* click! — from scratch */

:root {
  --bg: #111110;
  --surface: #1a1918;
  --cork: #251e16;
  --paper: #f0e6d0;
  --yellow: #ffe27a;
  --peach: #ffcc80;
  --text: #d4cabb;
  --bright: #fff8ec;
  --accent: #ff8a00;
  --teal: #00e5a0;
  --red: #ff5757;
  --muted: #6e6458;
  --border: #2a2520;
  --ff-body: 'Space Grotesk', system-ui, sans-serif;
  --ff-head: 'Playfair Display', Georgia, serif;
  --ff-mono: 'Space Mono', ui-monospace, monospace;
}

::selection { background: var(--accent); color: var(--bg); }
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font: 15px/1.65 var(--ff-body);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

h1, h2, h3 {
  font-family: var(--ff-head);
  color: var(--bright);
  line-height: 1.12;
  letter-spacing: -.03em;
}

a { color: var(--accent); text-decoration: none; }
a:hover { color: #ffbb44; }

/* ---- UTILITIES ---- */

.wrap {
  width: min(1060px, calc(100% - 2.5rem));
  margin: 0 auto;
}

.label {
  display: inline-block;
  font: 700 .62rem/.9 var(--ff-mono);
  text-transform: uppercase;
  letter-spacing: .16em;
  color: var(--accent);
  margin-bottom: .6rem;
}

.label--sm { font-size: .58rem; margin-bottom: .4rem; }
.label--dark { color: #6a5d3a; }

.sub { color: var(--muted); margin-bottom: 1.5rem; }

.hidden { display: none; }

/* ---- BUTTONS ---- */

.btn {
  display: inline-block;
  background: var(--accent);
  color: var(--bg);
  border: none;
  padding: .8rem 2rem;
  font: 700 .95rem/1 var(--ff-body);
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: transform .1s, box-shadow .1s;
  text-decoration: none;
}
.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #000;
  color: var(--bg);
  text-decoration: none;
}
.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #000;
}
.btn--ghost {
  background: transparent;
  color: var(--bright);
  border: 2px solid var(--border);
  box-shadow: none;
}
.btn--ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: none;
  transform: none;
}
.btn--sm { padding: .5rem 1rem; font-size: .82rem; box-shadow: 2px 2px 0 #000; }

/* ---- INPUTS ---- */

input {
  width: 100%;
  padding: .75rem .9rem;
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--bright);
  font: 1rem var(--ff-body);
}
input:focus { outline: none; border-color: var(--accent); }

/* ==============================================================
   HEADER
   ============================================================== */

.header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(17,17,16,.92);
  backdrop-filter: blur(14px);
  border-bottom: 3px solid var(--accent);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .75rem 0;
}

.logo {
  font: 700 1.3rem var(--ff-mono);
  color: var(--bright);
  letter-spacing: -.03em;
}
.logo:hover { color: var(--bright); text-decoration: none; }
.logo-bang { color: var(--accent); }

.nav {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  font-size: .88rem;
}
.nav a { color: var(--muted); font-weight: 500; }
.nav a:hover { color: var(--bright); text-decoration: none; }
.nav form { margin: 0; }

.nav-btn {
  background: none; border: none;
  color: var(--muted);
  font: 500 .88rem var(--ff-body);
  cursor: pointer;
}
.nav-btn:hover { color: var(--bright); }

/* ==============================================================
   HERO — text left, image right
   ============================================================== */

.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 540px;
}

.hero-text {
  padding: 4.5rem 3.5rem 4rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: max(1.25rem, calc((100vw - 1060px) / 2));
}

.hero-text h1 {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 900;
  margin-bottom: 1.2rem;
}
.hero-text h1 em {
  font-style: italic;
  color: var(--accent);
}

.hero-desc {
  color: var(--muted);
  font-size: 1rem;
  max-width: 400px;
  line-height: 1.7;
}

.hero-btns {
  display: flex;
  gap: .8rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.hero-img {
  background: url(/static/hero.jpg) center/cover no-repeat;
  position: relative;
}

/* slanted edge between text and image */
.hero-img::before {
  content: '';
  position: absolute;
  top: 0; bottom: 0; left: -35px;
  width: 70px;
  background: var(--bg);
  transform: skewX(-4deg);
  z-index: 1;
}

/* ==============================================================
   BOARD SECTION — warm brown strip with cork texture
   ============================================================== */

.board {
  background: var(--cork);
  position: relative;
  padding: 3.5rem 0;
}

/* cork dot texture */
.board::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    radial-gradient(rgba(90,70,45,.22) 1px, transparent 1px),
    radial-gradient(rgba(70,55,35,.13) 1.5px, transparent 1.5px);
  background-size: 16px 16px, 41px 41px;
  background-position: 0 0, 9px 9px;
  pointer-events: none;
}

.board-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 1.8rem;
  align-items: start;
  position: relative;
  z-index: 1;
}

/* ---- CARD ---- */

.card {
  background: var(--paper);
  color: #2a2318;
  padding: 1.5rem 1.4rem;
  box-shadow: 4px 5px 18px rgba(0,0,0,.45);
  position: relative;
}

.card--route { transform: rotate(.8deg); }
.card--tilt-l { transform: rotate(-2.5deg); }
.card--tilt-r { transform: rotate(2deg); }

.card--yellow { background: var(--yellow); }
.card--peach { background: var(--peach); }

.card p {
  font-size: .88rem;
  line-height: 1.5;
  color: #3a3520;
}

.route {
  display: flex;
  align-items: center;
  gap: .7rem;
  flex-wrap: wrap;
}
.route strong {
  font: 700 1.3rem var(--ff-head);
  color: #1a1510;
}
.route-arrow {
  font: 700 1.2rem var(--ff-mono);
  color: var(--accent);
}

/* ==============================================================
   FOOTER
   ============================================================== */

.footer {
  padding: 3rem 0 2.5rem;
  text-align: center;
  color: var(--muted);
  font: italic .78rem var(--ff-mono);
}

/* ==============================================================
   PAGE CONTENT (non-home pages)
   ============================================================== */

.page-content {
  padding: 3rem 0 5rem;
}

.page-content h1 {
  font-size: 2rem;
  margin-bottom: .5rem;
}

/* ---- GAME PAGE ---- */

.game-shell { }

.game-bar {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px dashed var(--border);
}

.game-title {
  font-size: 1.4rem;
  margin-top: .3rem;
}

.game-arrow {
  color: var(--accent);
  font-family: var(--ff-mono);
}

.game-stats {
  display: flex;
  gap: .5rem;
  flex-shrink: 0;
}

.stat {
  text-align: center;
  min-width: 100px;
  padding: .6rem .9rem;
  background: var(--surface);
  border: 1px solid var(--border);
}

.stat-label {
  display: block;
  font: 700 .52rem var(--ff-mono);
  text-transform: uppercase;
  letter-spacing: .18em;
  color: var(--muted);
  margin-bottom: .1rem;
}

.stat-val {
  display: block;
  font: 700 1.1rem var(--ff-mono);
  color: var(--bright);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.stat--timer { border-color: var(--accent); }
.stat--timer .stat-val { color: var(--accent); font-size: 1.35rem; }

.game-cols {
  display: grid;
  grid-template-columns: 1fr 270px;
  gap: 2.5rem;
}

/* article = paper document */
.article-paper {
  background: var(--paper);
  color: #2a2318;
  padding: 2rem;
  box-shadow: 4px 5px 20px rgba(0,0,0,.4);
}

.article-paper h2 {
  font-size: 1.3rem;
  padding-bottom: .6rem;
  border-bottom: 1px solid #c8b898;
  margin-bottom: 1rem;
  color: #1a1510;
}

.game-side { }

.side-heading {
  font: 700 .7rem var(--ff-mono);
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--muted);
  margin-bottom: .8rem;
  padding-bottom: .5rem;
  border-bottom: 1px solid var(--border);
}

.share-actions { margin-top: 1rem; }

/* ---- AUTH ---- */

.auth-box {
  max-width: 380px;
  margin: 0 auto;
}
.auth-box h1 { margin-bottom: .3rem; }

.form-stack {
  display: grid;
  gap: 1.1rem;
}
.form-stack label {
  display: grid;
  gap: .3rem;
  font: 600 .82rem var(--ff-body);
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: .05em;
}
.form-stack button { margin-top: .5rem; }

/* ==============================================================
   ARTICLE BODY — rendered Wikipedia content on paper background
   ============================================================== */

.article-body {
  overflow-wrap: anywhere;
  font: .94rem/1.75 var(--ff-body);
  color: #2a2318;
}

.article-body p { margin: .6rem 0; }

.article-body h2 {
  font-size: 1.2rem;
  margin: 1.8rem 0 .5rem;
  padding-bottom: .35rem;
  border-bottom: 1px solid #c8b898;
  color: #1a1510;
}
.article-body h3 { font-size: 1rem; margin: 1.4rem 0 .4rem; color: #1a1510; }
.article-body h4, .article-body h5, .article-body h6 {
  font-size: .95rem; margin: 1rem 0 .3rem; color: #2a2318;
}

.article-body ul, .article-body ol { padding-left: 1.5rem; margin: .5rem 0; }
.article-body ul { list-style: disc; }
.article-body ol { list-style: decimal; }
.article-body li { margin: .2rem 0; }

.article-body dl { margin: .5rem 0; }
.article-body dt { font-weight: 600; color: #1a1510; margin-top: .4rem; }
.article-body dd { margin-left: 1.5rem; margin-bottom: .3rem; }

.article-body blockquote {
  border-left: 3px solid var(--accent);
  padding-left: 1rem;
  margin: 1rem 0;
  color: #5a5040;
  font-style: italic;
}

.article-body code {
  font: .85em var(--ff-mono);
  background: rgba(0,0,0,.04);
  padding: .1rem .3rem;
  border: 1px solid #c8b898;
}

.article-body pre {
  font: .85em var(--ff-mono);
  background: rgba(0,0,0,.04);
  border: 1px solid #c8b898;
  padding: .7rem;
  overflow-x: auto;
  margin: .5rem 0;
}

.article-body hr { border: none; border-top: 1px solid #c8b898; margin: 1.5rem 0; }

.article-body img {
  max-width: 100%;
  height: auto;
  margin: .5rem 0;
  border: 1px solid #c8b898;
}

.article-body a[data-wiki-target] {
  color: #c06800;
  text-decoration: underline;
  text-decoration-color: rgba(192,104,0,.3);
  text-underline-offset: 2px;
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

.article-body table {
  width: auto; max-width: 100%;
  border-collapse: collapse;
  font-size: .85rem;
  margin: 1rem 0;
}
.article-body th, .article-body td {
  border: 1px solid #c8b898;
  padding: .3rem .5rem;
  vertical-align: top;
  text-align: left;
}
.article-body th { background: rgba(0,0,0,.04); font-weight: 600; color: #1a1510; }

.article-body .infobox {
  float: right; max-width: 280px;
  margin: 0 0 1rem 1.5rem;
  border: 1px solid #c8b898;
  background: rgba(0,0,0,.02);
  font-size: .82rem;
}

.article-body .thumb.tright { float: right; clear: right; margin: .5rem 0 .8rem 1.5rem; }
.article-body .thumb.tleft { float: left; clear: left; margin: .5rem 1.5rem .8rem 0; }
.article-body .thumbinner {
  border: 1px solid #c8b898;
  background: rgba(0,0,0,.02);
  padding: .3rem;
  font-size: .8rem;
}
.article-body .thumbcaption { padding: .3rem .2rem; color: #6a5f4f; font-size: .78rem; }

.article-body .gallery { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1rem 0; list-style: none; }
.article-body .gallerytext { font-size: .78rem; color: #6a5f4f; padding: .2rem; }

.article-body::after { content: ''; display: table; clear: both; }

/* ---- BOARD TABLE ---- */

.board-table { width: 100%; border-collapse: collapse; }
.board-table th {
  text-align: left;
  font: 700 .6rem var(--ff-mono);
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--muted);
  padding: .5rem;
  border-bottom: 2px solid var(--border);
}
.board-table td {
  padding: .55rem .5rem;
  border-bottom: 1px solid var(--border);
  font-size: .9rem;
}
.board-table tbody tr:hover td { background: rgba(255,138,0,.04); }

.board-table td:first-child {
  font: 800 1.05rem var(--ff-mono);
  width: 2.5rem;
  color: var(--muted);
}
.board-table tbody tr:nth-child(1) td:first-child { color: #ffd700; text-shadow: 0 0 8px rgba(255,215,0,.3); }
.board-table tbody tr:nth-child(2) td:first-child { color: #c0c0c0; }
.board-table tbody tr:nth-child(3) td:first-child { color: #cd7f32; }

/* ---- ARCHIVE LIST ---- */

.archive-list { list-style: none; }
.archive-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: .7rem 0;
  border-bottom: 1px solid var(--border);
  font-size: .92rem;
}
.archive-list li span { color: var(--muted); font-size: .85rem; }

/* ---- BANNERS ---- */

.error-banner, .success-banner {
  padding: .8rem 1rem;
  font-size: .9rem;
  border-left: 3px solid;
  margin-bottom: 1.2rem;
}
.error-banner { background: rgba(255,87,87,.06); border-color: var(--red); color: var(--red); }
.success-banner { background: rgba(0,229,160,.06); border-color: var(--teal); color: var(--teal); }
.result-banner { font-weight: 600; }

/* ==============================================================
   RESPONSIVE
   ============================================================== */

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .hero-img {
    min-height: 280px;
    order: -1;
  }
  .hero-img::before { display: none; }
  .hero-text {
    margin-left: 0;
    padding: 2.5rem 1.25rem;
  }
  .board-grid {
    grid-template-columns: 1fr 1fr;
  }
  .board-grid .card--route { grid-column: 1 / -1; }
  .game-cols { grid-template-columns: 1fr; }
  .game-bar { flex-direction: column; }
  .game-stats { width: 100%; flex-wrap: wrap; }

  .article-body .infobox,
  .article-body .thumb.tright {
    float: none; max-width: 100%; margin: 1rem 0;
  }
}

@media (max-width: 640px) {
  .header-inner { flex-direction: column; align-items: flex-start; gap: .5rem; }
  .nav { gap: .8rem; flex-wrap: wrap; }
  .hero-text h1 { font-size: 1.9rem; }
  .hero-img { min-height: 200px; }
  .board-grid { grid-template-columns: 1fr; }
  .game-stats { flex-direction: column; }
  .article-paper { padding: 1.2rem; }
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
