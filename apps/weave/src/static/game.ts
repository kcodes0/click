// Letter Weave client game loop.
//
// Reads the board off the .weave-shell dataset, lets the player build a
// current word by clicking adjacent tiles, submits individual words to
// the running list (with local validation), tracks a 3-minute timer, and
// POSTs the full run to /api/runs when the player finishes or time
// expires. Dictionary validation lives on the server — we only gate on
// length, adjacency, and no-reuse locally for a snappy feel.

export const GAME_JS = String.raw`(() => {
  const shell = document.querySelector(".weave-shell");
  if (!shell) return;

  const weaveId = shell.dataset.weaveId;
  const board = shell.dataset.board;
  if (!weaveId || !board || board.length !== 25) return;

  const width = 5;
  const height = 5;
  const MIN_WORD_LENGTH = 4;
  const RUN_DURATION_MS = 3 * 60 * 1000;

  const tileNodes = shell.querySelectorAll(".weave-tile");
  const currentEl = document.getElementById("weave-current");
  const currentHintEl = shell.querySelector(".weave-current-hint");
  const timerEl = document.getElementById("timer");
  const scoreEl = document.getElementById("score");
  const wordCountEl = document.getElementById("word-count");
  const resultEl = document.getElementById("game-result");
  const wordsList = document.getElementById("weave-words");
  const submitButton = document.getElementById("weave-submit");
  const clearButton = document.getElementById("weave-clear");
  const finishButton = document.getElementById("weave-finish");
  const helpButton = document.getElementById("weave-help");
  const rulesPanel = document.getElementById("weave-rules");

  if (
    !tileNodes.length ||
    !currentEl ||
    !timerEl ||
    !scoreEl ||
    !wordCountEl ||
    !resultEl ||
    !wordsList ||
    !submitButton ||
    !clearButton ||
    !finishButton
  ) {
    return;
  }

  const tileByIndex = new Map();
  tileNodes.forEach((node) => {
    const idx = Number(node.dataset.index);
    tileByIndex.set(idx, node);
  });

  // --- scoring ---
  const scoreWord = (word) => {
    const len = word.length;
    if (len < MIN_WORD_LENGTH) return 0;
    if (len === 4) return 1;
    if (len === 5) return 2;
    if (len === 6) return 3;
    if (len === 7) return 5;
    return 11;
  };

  // --- adjacency check ---
  const isAdjacent = (a, b) => {
    const ax = a % width, ay = Math.floor(a / width);
    const bx = b % width, by = Math.floor(b / width);
    const dx = Math.abs(ax - bx);
    const dy = Math.abs(ay - by);
    return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
  };

  // --- run state ---
  const currentPath = []; // array of cell indexes
  const foundWords = []; // array of { word, score }
  const foundSet = new Set(); // uppercased words
  let totalScore = 0;
  let runStartedAt = 0;
  let finished = false;

  // --- dictionary (client-side) ---
  // Fetched once from /static/dictionary.txt and cached in-memory as a
  // Set. The worker sets cache-control: immutable so return visits skip
  // the network entirely. Every candidate word is checked against this
  // Set before being added to the found list — the server re-validates
  // at final submission, but we don't want players seeing non-words
  // like "RDFC +1" flash into the list during play.
  let dictionary = null;
  let dictionaryLoadFailed = false;
  const dictionaryReady = fetch("/static/dictionary.txt")
    .then((r) => {
      if (!r.ok) throw new Error("dict http " + r.status);
      return r.text();
    })
    .then((text) => {
      const set = new Set();
      for (const line of text.split(/\s+/)) {
        if (line.length >= 4) set.add(line);
      }
      dictionary = set;
      if (currentHintEl && !finished) {
        currentHintEl.textContent = "release to submit";
      }
    })
    .catch(() => {
      // Network hiccup — fall back to "optimistic accept, server
      // decides". Players will still see the server strike-through at
      // the end. Surface the state so they know dictionary check is
      // offline.
      dictionaryLoadFailed = true;
      if (currentHintEl && !finished) {
        currentHintEl.textContent = "offline check";
      }
    });

  if (currentHintEl) {
    currentHintEl.textContent = "loading dictionary…";
  }

  // --- timer ---
  const formatTime = (ms) => {
    const clamped = Math.max(0, ms);
    const totalSeconds = Math.floor(clamped / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const centi = String(Math.floor((clamped % 1000) / 10)).padStart(2, "0");
    return minutes + ":" + seconds + "." + centi;
  };

  const setTimer = (ms) => {
    timerEl.textContent = formatTime(ms);
  };

  const remainingMs = () => {
    if (!runStartedAt) return RUN_DURATION_MS;
    return RUN_DURATION_MS - (performance.now() - runStartedAt);
  };

  const tick = () => {
    if (!finished && runStartedAt) {
      const left = remainingMs();
      if (left <= 0) {
        setTimer(0);
        void finishRun("time");
        return;
      }
      setTimer(left);
    }
    requestAnimationFrame(tick);
  };

  // --- UI painters ---
  const paintCurrentWord = () => {
    if (currentPath.length === 0) {
      currentEl.textContent = "tap letters to spell a word";
      currentEl.classList.add("weave-current-word--empty");
      return;
    }
    const word = currentPath.map((i) => board[i]).join("");
    currentEl.textContent = word;
    currentEl.classList.remove("weave-current-word--empty");
  };

  const paintTiles = () => {
    tileNodes.forEach((node) => {
      node.classList.remove("used", "head", "disabled");
    });
    for (let i = 0; i < currentPath.length; i++) {
      const node = tileByIndex.get(currentPath[i]);
      if (!node) continue;
      node.classList.add("used");
      if (i === currentPath.length - 1) node.classList.add("head");
    }
    if (finished) {
      tileNodes.forEach((node) => node.classList.add("disabled"));
    }
  };

  const paintFoundWords = () => {
    if (foundWords.length === 0) {
      wordsList.innerHTML = '<li class="weave-words-empty">none yet</li>';
    } else {
      // Newest first so late additions are easy to spot.
      wordsList.innerHTML = foundWords
        .slice()
        .reverse()
        .map((fw) => "<li data-score=\"" + fw.score + "\">" + fw.word + "</li>")
        .join("");
    }
    wordCountEl.textContent = String(foundWords.length);
    scoreEl.textContent = String(totalScore);
  };

  const renderResult = (message, isError) => {
    resultEl.classList.remove("hidden");
    resultEl.classList.toggle("error-banner", Boolean(isError));
    resultEl.classList.toggle("success-banner", !isError);
    resultEl.textContent = message;
  };

  const clearResult = () => {
    resultEl.classList.add("hidden");
    resultEl.classList.remove("error-banner", "success-banner");
    resultEl.textContent = "";
  };

  // Flash the current word strip briefly to acknowledge success / error.
  const flashCurrent = (kind) => {
    currentEl.style.transition = "color .15s ease";
    const original = currentEl.style.color;
    currentEl.style.color = kind === "ok" ? "var(--teal)" : "var(--red)";
    setTimeout(() => {
      currentEl.style.color = original;
    }, 200);
  };

  const clearCurrent = () => {
    currentPath.length = 0;
    paintCurrentWord();
    paintTiles();
  };

  // --- submit a single word into the running list ---
  const submitCurrent = () => {
    if (finished) return;
    const word = currentPath.map((i) => board[i]).join("").toUpperCase();

    if (word.length < MIN_WORD_LENGTH) {
      flashCurrent("bad");
      return;
    }

    if (foundSet.has(word)) {
      flashCurrent("bad");
      clearCurrent();
      return;
    }

    // Client-side dictionary check. If the dictionary failed to load we
    // accept optimistically and let the server strike through at end of
    // run; otherwise we reject non-words right here so the found list
    // can't fill up with gibberish.
    if (dictionary && !dictionary.has(word)) {
      flashCurrent("bad");
      // Keep the traced path visible so the player can rework it, like
      // a Boggle UI that shouts "not a word" but leaves your trace up.
      return;
    }
    if (!dictionary && !dictionaryLoadFailed) {
      // Dictionary still downloading. Swallow the submit quietly rather
      // than optimistic-accept — the fetch takes ~1s so this window is
      // tiny in practice.
      flashCurrent("bad");
      return;
    }

    const score = scoreWord(word);
    foundWords.push({ word, score });
    foundSet.add(word);
    totalScore += score;
    flashCurrent("ok");
    clearCurrent();
    paintFoundWords();
  };

  // Add one tile to the current path if the move is legal. Shared by both
  // click-to-step and drag-to-trace input paths so they stay consistent.
  // Returns true if the tile was actually appended (for the drag code to
  // know whether to mark dragMoved).
  const addTileToPath = (node) => {
    if (finished) return false;
    const idx = Number(node.dataset.index);
    if (Number.isNaN(idx)) return false;

    // Tapping a tile that's already on the trail truncates back to it so
    // players can undo a wrong turn without a full clear. When a drag is
    // active this also lets the player backtrack by dragging back over
    // their own path.
    const existing = currentPath.indexOf(idx);
    if (existing !== -1) {
      if (existing === currentPath.length - 1) return false;
      currentPath.length = existing + 1;
      paintCurrentWord();
      paintTiles();
      return false;
    }

    // First letter — always allowed; start the run clock if this is the
    // very first interaction this session.
    if (currentPath.length === 0) {
      if (!runStartedAt) runStartedAt = performance.now();
      currentPath.push(idx);
      paintCurrentWord();
      paintTiles();
      return true;
    }

    // Subsequent letter must touch the previous tile.
    const last = currentPath[currentPath.length - 1];
    if (!isAdjacent(last, idx)) {
      return false;
    }

    currentPath.push(idx);
    paintCurrentWord();
    paintTiles();
    return true;
  };

  // --- submit the full run to the server ---
  const submitRun = async (timeMs) => {
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          weaveId,
          timeMs,
          words: foundWords.map((fw) => fw.word)
        })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        renderResult(body && body.error ? body.error : "Run submission failed.", true);
        return;
      }
      const payload = await response.json();
      if (typeof payload.score === "number") {
        totalScore = payload.score;
        scoreEl.textContent = String(totalScore);
      }
      if (Array.isArray(payload.acceptedWords)) {
        const accepted = new Set(payload.acceptedWords.map((w) => String(w).toUpperCase()));
        for (const fw of foundWords) {
          if (!accepted.has(fw.word)) fw.rejected = true;
        }
        // Re-render: mark rejected words with a strikethrough via inline style.
        wordsList.innerHTML = foundWords
          .slice()
          .reverse()
          .map((fw) => {
            const style = fw.rejected ? ' style="opacity:.45;text-decoration:line-through"' : "";
            return "<li" + style + " data-score=\"" + (fw.rejected ? 0 : fw.score) + "\">" + fw.word + "</li>";
          })
          .join("");
        wordCountEl.textContent = String(payload.wordCount || 0);
      }
      if (payload.refreshLeaderboard) {
        refreshLeaderboard(payload.refreshLeaderboard);
      }
      const rankText = payload.rank ? " Rank #" + payload.rank + "." : "";
      renderResult(
        "Finished — " + (payload.score || 0) + " pts across " + (payload.wordCount || 0) + " words." + rankText,
        false
      );
    } catch {
      renderResult("Run submission failed.", true);
    }
  };

  const refreshLeaderboard = (entries) => {
    const tbody = shell.querySelector(".board-table tbody");
    if (!tbody || !Array.isArray(entries)) return;
    if (entries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No runs yet.</td></tr>';
      return;
    }
    tbody.innerHTML = entries
      .map((entry, index) => {
        return (
          "<tr><td>" + (index + 1) +
          "</td><td>" + entry.username +
          "</td><td>" + entry.bestScore +
          "</td><td>" + entry.wordCount +
          "</td><td>" + formatTime(entry.timeMs) +
          "</td></tr>"
        );
      })
      .join("");
  };

  const finishRun = async (reason) => {
    if (finished) return;
    finished = true;
    const timeMs = runStartedAt ? Math.round(performance.now() - runStartedAt) : 0;
    setTimer(Math.max(0, RUN_DURATION_MS - timeMs));
    clearCurrent();
    paintTiles();
    if (foundWords.length === 0) {
      renderResult(
        reason === "time" ? "Time's up. No words submitted." : "No words submitted.",
        true
      );
      return;
    }
    await submitRun(timeMs);
  };

  // --- input: pointer events cover both mouse and touch ---
  //
  // Two modes coexist:
  //   click-to-step  — each pointerdown adds the tapped tile to the word.
  //                    Players build words one letter at a time and press
  //                    Enter / Submit when done. Good for precision.
  //   drag-to-trace  — pointerdown starts a drag; while held, moving the
  //                    pointer across adjacent tiles extends the word;
  //                    releasing auto-submits if the word is 4+ letters.
  //                    Good for classic Boggle muscle memory.
  //
  // The two share addTileToPath() for all adjacency / no-reuse logic, so
  // they can't disagree. dragMoved tracks whether the pointer actually
  // visited a new tile between down and up — single taps stay in
  // click-to-step mode and never auto-submit.
  let pointerActive = false;
  let dragMoved = false;

  // Find the .weave-tile under a point, if any. Used during drag to
  // translate document-level pointermove events into tile hits. We go
  // through document.elementFromPoint because tile-level pointerenter
  // doesn't fire reliably for touch pointers in every browser.
  const tileAtPoint = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el || !el.closest) return null;
    return el.closest(".weave-tile");
  };

  const onPointerDown = (node, event) => {
    if (finished) return;
    // preventDefault stops text selection and mobile long-press menus
    // during a drag. Also keeps the button from stealing focus, so the
    // document-level Enter handler still routes to submitCurrent().
    event.preventDefault();
    pointerActive = true;
    dragMoved = false;
    addTileToPath(node);
    // Blur any stray focus so keyboard Enter goes to our handler rather
    // than re-triggering whichever button was last focused.
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  };

  const onPointerMove = (event) => {
    if (!pointerActive) return;
    const node = tileAtPoint(event.clientX, event.clientY);
    if (!node) return;
    const idx = Number(node.dataset.index);
    if (Number.isNaN(idx)) return;
    // Skip if the pointer is still over the same tile as the last step —
    // no-op prevents redundant paints while the finger hovers.
    if (
      currentPath.length > 0 &&
      currentPath[currentPath.length - 1] === idx
    ) {
      return;
    }
    const added = addTileToPath(node);
    if (added) dragMoved = true;
  };

  const onPointerEnd = () => {
    if (!pointerActive) return;
    pointerActive = false;
    if (!dragMoved) {
      // Single tap — leave the tile on the path so the player can keep
      // tapping more tiles or press Enter to submit.
      return;
    }
    // Actual drag — auto-submit. submitCurrent() already rejects words
    // shorter than 4 letters (flashes bad + clears the partial path).
    submitCurrent();
  };

  tileNodes.forEach((node) => {
    node.addEventListener("pointerdown", (event) => onPointerDown(node, event));
  });

  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerEnd);
  document.addEventListener("pointercancel", onPointerEnd);

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    submitCurrent();
  });
  clearButton.addEventListener("click", (event) => {
    event.preventDefault();
    clearCurrent();
  });
  finishButton.addEventListener("click", (event) => {
    event.preventDefault();
    void finishRun("manual");
  });

  document.addEventListener("keydown", (event) => {
    if (finished) return;
    const target = event.target;
    // Ignore while an input has focus (there are none on this page today
    // but be defensive if that changes).
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
    if (event.key === "Enter") {
      event.preventDefault();
      submitCurrent();
    } else if (event.key === "Escape") {
      clearCurrent();
    } else if (event.key === "Backspace" && currentPath.length > 0) {
      event.preventDefault();
      currentPath.pop();
      paintCurrentWord();
      paintTiles();
    }
  });

  if (helpButton && rulesPanel) {
    helpButton.addEventListener("click", () => {
      const nowHidden = rulesPanel.classList.toggle("hidden");
      helpButton.setAttribute("aria-expanded", nowHidden ? "false" : "true");
    });
  }

  paintCurrentWord();
  paintTiles();
  paintFoundWords();
  setTimer(RUN_DURATION_MS);
  tick();
})();
`;
