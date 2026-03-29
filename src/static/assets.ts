export const STYLE_CSS = String.raw`:root {
  color-scheme: light;
  --bg: #f4f1ea;
  --surface: #fffdfa;
  --surface-strong: #f0eadf;
  --border: #d2c6b2;
  --text: #1f1b16;
  --muted: #61584b;
  --accent: #1d5c45;
  --accent-soft: #e1efe9;
  --danger: #9c2f2f;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: linear-gradient(180deg, #f6f1e8 0%, #eee7da 100%);
  color: var(--text);
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.5;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button,
input {
  font: inherit;
}

button {
  border: 1px solid var(--border);
  background: var(--text);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  cursor: pointer;
}

input {
  width: 100%;
  padding: 0.8rem 0.9rem;
  border-radius: 0.85rem;
  border: 1px solid var(--border);
  background: white;
}

.ghost-button {
  background: transparent;
  color: var(--text);
}

.shell {
  width: min(1120px, calc(100vw - 2rem));
  margin: 0 auto;
}

.site-header {
  border-bottom: 1px solid rgba(31, 27, 22, 0.1);
  backdrop-filter: blur(8px);
}

.nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.brand {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links form {
  margin: 0;
}

.page {
  padding: 2rem 0 4rem;
}

.hero,
.auth-card,
.list-card,
.sidebar-card,
.article-panel,
.stack-block,
.game-shell {
  background: rgba(255, 253, 250, 0.9);
  border: 1px solid rgba(210, 198, 178, 0.8);
  border-radius: 1.4rem;
  box-shadow: 0 18px 40px rgba(56, 43, 20, 0.06);
}

.hero,
.stack-block,
.auth-card {
  padding: 2rem;
}

.hero p,
.muted {
  color: var(--muted);
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
}

.secondary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 999px;
}

.challenge-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.challenge-mini-card {
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.eyebrow {
  margin: 0 0 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  color: var(--muted);
}

.stack-form {
  display: grid;
  gap: 1rem;
}

.stack-form label {
  display: grid;
  gap: 0.4rem;
}

.error-banner,
.success-banner {
  padding: 0.9rem 1rem;
  border-radius: 1rem;
}

.error-banner {
  background: #f8e3e3;
  color: var(--danger);
}

.success-banner {
  background: var(--accent-soft);
  color: var(--accent);
}

.hidden {
  display: none;
}

.game-shell {
  padding: 1.5rem;
}

.game-topbar {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.status-panel {
  display: grid;
  gap: 0.75rem;
  min-width: 220px;
}

.timer,
.pill {
  background: var(--surface-strong);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 0.8rem 1rem;
}

.timer {
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
}

.pill span {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.pill strong {
  font-size: 1rem;
}

.game-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 1rem;
}

.article-panel,
.sidebar-card,
.list-card {
  padding: 1.2rem;
}

.article-header {
  border-bottom: 1px solid rgba(210, 198, 178, 0.9);
  margin-bottom: 1rem;
}

.article-body {
  overflow-wrap: anywhere;
}

.article-body img {
  max-width: 100%;
  height: auto;
}

.article-body table {
  width: 100%;
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
}

.article-body th,
.article-body td {
  border: 1px solid var(--border);
  padding: 0.4rem;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
}

.board-table th,
.board-table td {
  text-align: left;
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid rgba(210, 198, 178, 0.7);
}

.share-actions {
  margin-top: 1rem;
}

.archive-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.archive-list li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .game-layout {
    grid-template-columns: 1fr;
  }

  .game-topbar {
    flex-direction: column;
  }

  .status-panel {
    width: 100%;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .nav-row,
  .nav-links {
    flex-direction: column;
    align-items: flex-start;
  }

  .status-panel {
    grid-template-columns: 1fr;
  }
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
