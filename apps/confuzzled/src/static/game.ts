export const GAME_JS = String.raw`(function () {
  "use strict";

  var shell = document.querySelector(".pz-shell");
  if (!shell) return;

  var puzzleId = shell.dataset.puzzleId;
  var gridStr = shell.dataset.grid;
  var W = parseInt(shell.dataset.gridWidth, 10);
  var H = parseInt(shell.dataset.gridHeight, 10);
  var N = W * H;

  var grid = document.querySelector(".pz-grid");
  var timerEl = document.getElementById("timer");
  var resultEl = document.getElementById("game-result");
  var resetBtn = document.getElementById("pz-reset");
  var helpBtn = document.getElementById("pz-help");
  var rulesEl = document.getElementById("pz-rules");

  // 0 = empty, 1 = bulb, 2 = x-mark
  var state = new Int8Array(N);
  var startTime = 0;
  var timerRAF = 0;
  var finished = false;

  // ----------------------------------------------------------------
  // Grid helpers
  // ----------------------------------------------------------------

  function isWall(i) {
    var ch = gridStr[i];
    return ch === "#" || (ch >= "0" && ch <= "4");
  }

  function wallNum(i) {
    var ch = gridStr[i];
    if (ch >= "0" && ch <= "4") return ch.charCodeAt(0) - 48;
    return -1;
  }

  var DIRS = [[1,0],[-1,0],[0,1],[0,-1]];

  function visibleFrom(ci) {
    var x0 = ci % W, y0 = (ci / W) | 0;
    var result = [];
    for (var d = 0; d < 4; d++) {
      var dx = DIRS[d][0], dy = DIRS[d][1];
      var cx = x0 + dx, cy = y0 + dy;
      while (cx >= 0 && cx < W && cy >= 0 && cy < H) {
        var ni = cy * W + cx;
        if (isWall(ni)) break;
        result.push(ni);
        cx += dx;
        cy += dy;
      }
    }
    return result;
  }

  // Pre-compute visibility for each cell (avoids recomputing every frame)
  var visCache = new Array(N);
  for (var i = 0; i < N; i++) {
    visCache[i] = isWall(i) ? [] : visibleFrom(i);
  }

  // ----------------------------------------------------------------
  // Display update
  // ----------------------------------------------------------------

  var cells = grid.querySelectorAll(".pz-cell");

  function updateDisplay() {
    // Compute lit cells
    var lit = new Uint8Array(N);
    var bulbs = [];
    for (var i = 0; i < N; i++) {
      if (state[i] !== 1) continue;
      bulbs.push(i);
      lit[i] = 1;
      var vis = visCache[i];
      for (var j = 0; j < vis.length; j++) lit[vis[j]] = 1;
    }

    // Detect conflicts (bulbs seeing each other)
    var conflict = new Uint8Array(N);
    for (var b = 0; b < bulbs.length; b++) {
      var bi = bulbs[b];
      var vis = visCache[bi];
      for (var j = 0; j < vis.length; j++) {
        if (state[vis[j]] === 1) {
          conflict[bi] = 1;
          conflict[vis[j]] = 1;
        }
      }
    }

    // Check numbered wall constraints
    var wallErr = new Uint8Array(N);
    for (var i = 0; i < N; i++) {
      var wn = wallNum(i);
      if (wn < 0) continue;
      var x = i % W, y = (i / W) | 0;
      var adjBulbs = 0;
      for (var d = 0; d < 4; d++) {
        var nx = x + DIRS[d][0], ny = y + DIRS[d][1];
        if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
          if (state[ny * W + nx] === 1) adjBulbs++;
        }
      }
      if (adjBulbs > wn) wallErr[i] = 1;
    }

    // Apply to DOM
    for (var i = 0; i < N; i++) {
      var el = cells[i];
      if (isWall(i)) {
        el.classList.toggle("pz-cell--wall-error", wallErr[i] === 1);
        continue;
      }
      el.classList.toggle("pz-cell--bulb", state[i] === 1);
      el.classList.toggle("pz-cell--x", state[i] === 2);
      el.classList.toggle("pz-cell--lit", lit[i] === 1 && state[i] !== 1);
      el.classList.toggle("pz-cell--conflict", conflict[i] === 1);
    }
  }

  // ----------------------------------------------------------------
  // Solution check
  // ----------------------------------------------------------------

  function checkSolved() {
    for (var i = 0; i < N; i++) {
      if (isWall(i)) {
        var wn = wallNum(i);
        if (wn < 0) continue;
        var x = i % W, y = (i / W) | 0;
        var adjBulbs = 0;
        for (var d = 0; d < 4; d++) {
          var nx = x + DIRS[d][0], ny = y + DIRS[d][1];
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            if (state[ny * W + nx] === 1) adjBulbs++;
          }
        }
        if (adjBulbs !== wn) return false;
        continue;
      }
      // White cell must be lit
      if (state[i] === 1) continue;
      var vis = visCache[i];
      var isLit = false;
      for (var j = 0; j < vis.length; j++) {
        if (state[vis[j]] === 1) { isLit = true; break; }
      }
      if (!isLit) return false;
    }
    // No conflicts
    for (var i = 0; i < N; i++) {
      if (state[i] !== 1) continue;
      var vis = visCache[i];
      for (var j = 0; j < vis.length; j++) {
        if (state[vis[j]] === 1) return false;
      }
    }
    return true;
  }

  // ----------------------------------------------------------------
  // Timer
  // ----------------------------------------------------------------

  function formatTime(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    s = s % 60;
    var cs = Math.floor((ms % 1000) / 10);
    return m + ":" + (s < 10 ? "0" : "") + s + "." + (cs < 10 ? "0" : "") + cs;
  }

  function tickTimer() {
    if (finished || !startTime) return;
    timerEl.textContent = formatTime(Date.now() - startTime);
    timerRAF = requestAnimationFrame(tickTimer);
  }

  function ensureTimer() {
    if (startTime || finished) return;
    startTime = Date.now();
    tickTimer();
  }

  // ----------------------------------------------------------------
  // Submit solve
  // ----------------------------------------------------------------

  function submitSolve() {
    var elapsed = Date.now() - startTime;
    finished = true;
    cancelAnimationFrame(timerRAF);
    timerEl.textContent = formatTime(elapsed);

    grid.classList.add("solved");

    var bulbs = [];
    for (var i = 0; i < N; i++) {
      if (state[i] === 1) bulbs.push(i);
    }

    // Disable further interaction
    for (var i = 0; i < cells.length; i++) {
      cells[i].disabled = true;
    }

    fetch("/api/solves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        puzzleId: puzzleId,
        timeMs: elapsed,
        bulbs: bulbs
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.ok) {
          resultEl.classList.remove("hidden");
          resultEl.innerHTML =
            "<strong>Solved!</strong> " +
            formatTime(data.timeMs) +
            (data.rank ? " — Rank #" + data.rank : "") +
            ". Nice work.";
          refreshLeaderboard(data.leaderboard);
        } else if (data.error) {
          resultEl.classList.remove("hidden");
          resultEl.innerHTML =
            "<strong>Solved!</strong> " + formatTime(elapsed) +
            ". <em>(Sign in to save your time.)</em>";
        }
      })
      .catch(function () {
        resultEl.classList.remove("hidden");
        resultEl.innerHTML =
          "<strong>Solved!</strong> " + formatTime(elapsed) + ".";
      });
  }

  function refreshLeaderboard(entries) {
    if (!entries || !entries.length) return;
    var table = document.querySelector(".board-table tbody");
    if (!table) return;
    var html = "";
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      html +=
        "<tr><td>" + (i + 1) + "</td><td>" +
        escapeHtml(e.username) + "</td><td>" +
        formatTime(e.timeMs) + "</td></tr>";
    }
    table.innerHTML = html;
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // ----------------------------------------------------------------
  // Click handler — attached directly to each white cell
  // ----------------------------------------------------------------

  function handleCellClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (finished) return;
    var cell = this;
    var idx = parseInt(cell.dataset.idx, 10);
    if (isWall(idx)) return;

    ensureTimer();

    state[idx] = (state[idx] + 1) % 3;

    updateDisplay();

    if (checkSolved()) {
      submitSolve();
    }
  }

  for (var ci = 0; ci < cells.length; ci++) {
    if (!cells[ci].disabled) {
      cells[ci].addEventListener("click", handleCellClick);
    }
  }

  // ----------------------------------------------------------------
  // Keyboard support
  // ----------------------------------------------------------------

  document.addEventListener("keydown", function (e) {
    if (finished) return;

    if (e.key === "r" || e.key === "R") {
      resetPuzzle();
      return;
    }

    var focused = document.activeElement;
    if (!focused || !focused.classList.contains("pz-cell")) return;

    var idx = parseInt(focused.dataset.idx, 10);
    var x = idx % W, y = (idx / W) | 0;
    var nx = x, ny = y;

    if (e.key === "ArrowRight") nx = Math.min(x + 1, W - 1);
    else if (e.key === "ArrowLeft") nx = Math.max(x - 1, 0);
    else if (e.key === "ArrowDown") ny = Math.min(y + 1, H - 1);
    else if (e.key === "ArrowUp") ny = Math.max(y - 1, 0);
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!isWall(idx)) {
        ensureTimer();
        state[idx] = (state[idx] + 1) % 3;
        updateDisplay();
        if (checkSolved()) submitSolve();
      }
      return;
    } else return;

    e.preventDefault();
    var ni = ny * W + nx;
    if (ni !== idx) cells[ni].focus();
  });

  // ----------------------------------------------------------------
  // Reset
  // ----------------------------------------------------------------

  function resetPuzzle() {
    if (finished) return;
    for (var i = 0; i < N; i++) state[i] = 0;
    startTime = 0;
    cancelAnimationFrame(timerRAF);
    timerEl.textContent = "0:00.00";
    updateDisplay();
  }

  if (resetBtn) resetBtn.addEventListener("click", resetPuzzle);

  // ----------------------------------------------------------------
  // Help toggle
  // ----------------------------------------------------------------

  var rulesBody = document.getElementById("pz-rules-body");
  if (helpBtn && rulesBody) {
    helpBtn.addEventListener("click", function () {
      var isHidden = rulesBody.classList.toggle("hidden");
      helpBtn.setAttribute("aria-expanded", isHidden ? "false" : "true");
      helpBtn.textContent = isHidden ? "show" : "hide";
    });
  }

  // Initial display
  updateDisplay();
})();
`;
