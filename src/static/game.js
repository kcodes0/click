const gameRoot = document.querySelector(".game-shell");

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

      const request = fetch("/api/wikipedia/" + encodeURIComponent(title))
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
