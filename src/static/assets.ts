import STYLE_CSS from "./style.css";

export { STYLE_CSS };

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
