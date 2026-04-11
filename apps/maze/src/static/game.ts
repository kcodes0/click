// Client-side game loop for the paper maze. Served inline from
// /static/game.js on the maze worker. Reads the layout and endpoints
// off the .maze-shell dataset (the server stamps them there), lets the
// player click adjacent cells to draw a path, runs a timer, and submits
// the run to /api/runs when the path reaches the end.
//
// IMPORTANT: this file is served as plain JavaScript. We ship it as a
// .ts source file for editing + type-checking convenience, but the
// runtime version has no imports, no Hono, no ambient DOM types — just
// browser APIs. That's why everything lives inside one IIFE and why we
// do not reach for imports from @kcodes/*.

export const GAME_JS = String.raw`(() => {
  const shell = document.querySelector(".maze-shell");
  if (!shell) return;

  const mazeId = shell.dataset.mazeId;
  const layoutRaw = shell.dataset.layout;
  if (!mazeId || !layoutRaw) return;

  const startX = Number(shell.dataset.startX);
  const startY = Number(shell.dataset.startY);
  const endX = Number(shell.dataset.endX);
  const endY = Number(shell.dataset.endY);

  let layout;
  try {
    layout = JSON.parse(layoutRaw);
  } catch {
    return;
  }

  const N = 1, E = 2, S = 4, W = 8;

  const svg = shell.querySelector(".maze-svg");
  const cellNodes = shell.querySelectorAll(".maze-cell");
  const pathLine = shell.querySelector(".maze-path");
  const timerEl = document.getElementById("timer");
  const stepEl = document.getElementById("step-count");
  const resultEl = document.getElementById("game-result");
  const resetButton = document.getElementById("maze-reset");
  const helpButton = document.getElementById("maze-help");
  const rulesPanel = document.getElementById("maze-rules");

  if (!svg || !cellNodes.length || !pathLine || !timerEl || !stepEl || !resultEl) {
    return;
  }

  // Look up the rendered cell rect for a given (x, y) so we can flip
  // .in-path / .head classes on it.
  const cellIndex = new Map();
  cellNodes.forEach((node) => {
    const x = Number(node.dataset.x);
    const y = Number(node.dataset.y);
    cellIndex.set(x + "," + y, node);
  });

  // Cell-center pixel coordinate derived from the SVG viewBox. The
  // server sets cellSize=36 and renders one cell per grid position
  // starting at origin, so we reconstruct the same math here.
  const cellSize = 36;
  const centerX = (x) => x * cellSize + cellSize / 2;
  const centerY = (y) => y * cellSize + cellSize / 2;

  const canMove = (fromX, fromY, toX, toY) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    if (Math.abs(dx) + Math.abs(dy) !== 1) return false;
    const cell = layout.walls[fromY * layout.width + fromX];
    if (cell === undefined) return false;
    if (dx === 1) return (cell & E) === 0;
    if (dx === -1) return (cell & W) === 0;
    if (dy === 1) return (cell & S) === 0;
    return (cell & N) === 0;
  };

  const path = [{ x: startX, y: startY }];
  let elapsedMs = 0;
  let activeSegmentStartedAt = 0;
  let started = false;
  let finished = false;

  const getElapsedMs = () =>
    elapsedMs + (activeSegmentStartedAt ? performance.now() - activeSegmentStartedAt : 0);

  const formatTime = (ms) => {
    const total = Math.floor(ms / 1000);
    const minutes = Math.floor(total / 60);
    const seconds = String(total % 60).padStart(2, "0");
    const centi = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return minutes + ":" + seconds + "." + centi;
  };

  const setTimer = (ms) => {
    timerEl.textContent = formatTime(ms);
  };

  const tick = () => {
    if (!finished && started) {
      setTimer(Math.round(getElapsedMs()));
    }
    requestAnimationFrame(tick);
  };

  const refreshPath = () => {
    // Repaint cell highlights.
    cellNodes.forEach((node) =>
      node.classList.remove("in-path", "head", "legal")
    );

    for (let i = 0; i < path.length; i++) {
      const { x, y } = path[i];
      const node = cellIndex.get(x + "," + y);
      if (!node) continue;
      node.classList.add(i === path.length - 1 ? "head" : "in-path");
    }

    // Tag the cells that are legal next moves from the current head so CSS
    // can give them a subtle highlight — players can see exactly where they
    // can go next without having to click around and hope.
    if (!finished) {
      const head = path[path.length - 1];
      const neighbors = [
        [head.x, head.y - 1],
        [head.x + 1, head.y],
        [head.x, head.y + 1],
        [head.x - 1, head.y]
      ];
      for (const [nx, ny] of neighbors) {
        if (!canMove(head.x, head.y, nx, ny)) continue;
        const node = cellIndex.get(nx + "," + ny);
        if (!node) continue;
        // Don't downgrade an in-path tile back to "legal" — keeping its
        // trail color reads better than flipping it yellow.
        if (
          !node.classList.contains("in-path") &&
          !node.classList.contains("head")
        ) {
          node.classList.add("legal");
        }
      }
    }

    // Repaint the polyline.
    const points = path
      .map((p) => centerX(p.x) + "," + centerY(p.y))
      .join(" ");
    pathLine.setAttribute("points", points);

    stepEl.textContent = String(Math.max(0, path.length - 1));
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

  const resetPath = () => {
    path.length = 0;
    path.push({ x: startX, y: startY });
    elapsedMs = 0;
    activeSegmentStartedAt = 0;
    started = false;
    finished = false;
    setTimer(0);
    clearResult();
    refreshPath();
  };

  const refreshLeaderboard = (entries) => {
    const tbody = shell.querySelector(".board-table tbody");
    if (!tbody) return;
    if (!entries || !entries.length) {
      tbody.innerHTML = '<tr><td colspan="4">No runs yet.</td></tr>';
      return;
    }
    tbody.innerHTML = entries
      .map((entry, index) => {
        return (
          "<tr><td>" +
          (index + 1) +
          "</td><td>" +
          entry.username +
          "</td><td>" +
          formatTime(entry.bestTimeMs) +
          "</td><td>" +
          entry.bestPathLength +
          "</td></tr>"
        );
      })
      .join("");
  };

  const submitRun = async (timeMs, pathLength) => {
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mazeId,
          timeMs,
          path: path.map((p) => [p.x, p.y])
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        renderResult(body && body.error ? body.error : "Run submission failed.", true);
        return;
      }

      const payload = await response.json();
      refreshLeaderboard(payload.leaderboard || []);
      const rankText = payload.rank ? " Rank #" + payload.rank + "." : "";
      renderResult(
        "Finished in " + formatTime(timeMs) + " (" + pathLength + " steps)." + rankText,
        false
      );
    } catch {
      renderResult("Run submission failed.", true);
    }
  };

  const finishRun = async () => {
    finished = true;
    const total = Math.round(getElapsedMs());
    elapsedMs = total;
    activeSegmentStartedAt = 0;
    setTimer(total);
    const steps = Math.max(0, path.length - 1);
    await submitRun(total, steps);
  };

  const handleCellClick = (target) => {
    if (finished) return;

    const rect = target.closest ? target.closest(".maze-cell") : null;
    if (!rect) return;
    const cellX = Number(rect.dataset.x);
    const cellY = Number(rect.dataset.y);
    if (Number.isNaN(cellX) || Number.isNaN(cellY)) return;

    // Click on a cell already in the path — truncate back to that cell.
    // Lets players "erase" missteps without a full reset.
    for (let i = 0; i < path.length; i++) {
      if (path[i].x === cellX && path[i].y === cellY) {
        path.length = i + 1;
        refreshPath();
        return;
      }
    }

    const head = path[path.length - 1];
    if (!canMove(head.x, head.y, cellX, cellY)) {
      return;
    }

    if (!started) {
      started = true;
      activeSegmentStartedAt = performance.now();
    }

    path.push({ x: cellX, y: cellY });
    refreshPath();

    if (cellX === endX && cellY === endY) {
      void finishRun();
    }
  };

  svg.addEventListener("click", (event) => {
    handleCellClick(event.target);
  });

  resetButton?.addEventListener("click", resetPath);

  if (helpButton && rulesPanel) {
    helpButton.addEventListener("click", () => {
      const nowHidden = rulesPanel.classList.toggle("hidden");
      helpButton.setAttribute("aria-expanded", nowHidden ? "false" : "true");
    });
  }

  refreshPath();
  setTimer(0);
  tick();
})();
`;
