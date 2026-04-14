export const GAME_SIGNAL_JS = String.raw`(function () {
  "use strict";

  var shell = document.querySelector(".pz-shell");
  if (!shell) return;

  var puzzleId = shell.dataset.puzzleId;
  var gridData = JSON.parse(shell.dataset.grid);
  var W = parseInt(shell.dataset.gridWidth, 10);
  var H = parseInt(shell.dataset.gridHeight, 10);
  var N = W * H;
  var signals = gridData.signals;
  var baseCells = gridData.cells;

  var grid = document.querySelector(".pz-grid");
  var timerEl = document.getElementById("timer");
  var resultEl = document.getElementById("game-result");
  var resetBtn = document.getElementById("pz-reset");
  var cells = grid.querySelectorAll(".pz-cell");

  // State: 0 = empty, 1 = /, 2 = backslash
  var state = new Int8Array(N);
  var startTime = 0;
  var timerRAF = 0;
  var finished = false;

  // Pre-fill fixed mirrors
  for (var i = 0; i < N; i++) {
    if (baseCells[i] === "/") state[i] = 1;
    else if (baseCells[i] === "\\") state[i] = 2;
    else if (baseCells[i] === "#") state[i] = -1; // wall
  }

  // ----------------------------------------------------------------
  // Signal tracing
  // ----------------------------------------------------------------

  var FWD = { E: "N", N: "E", W: "S", S: "W" };
  var BWD = { E: "S", S: "E", W: "N", N: "W" };
  var DX = { N: 0, S: 0, E: 1, W: -1 };
  var DY = { N: -1, S: 1, E: 0, W: 0 };

  function edgeToStart(ep) {
    if (ep.edge === "top") return { x: ep.pos, y: 0, dir: "S" };
    if (ep.edge === "bottom") return { x: ep.pos, y: H - 1, dir: "N" };
    if (ep.edge === "left") return { x: 0, y: ep.pos, dir: "E" };
    return { x: W - 1, y: ep.pos, dir: "W" };
  }

  function exitEdge(x, y, dir) {
    if (dir === "N" && y === 0) return { edge: "top", pos: x };
    if (dir === "S" && y === H - 1) return { edge: "bottom", pos: x };
    if (dir === "W" && x === 0) return { edge: "left", pos: y };
    if (dir === "E" && x === W - 1) return { edge: "right", pos: y };
    return null;
  }

  function traceSignal(entry) {
    var s = edgeToStart(entry);
    var x = s.x, y = s.y, dir = s.dir;
    var path = [];
    var visited = {};

    for (var step = 0; step < N + 10; step++) {
      if (x < 0 || x >= W || y < 0 || y >= H) break;
      var idx = y * W + x;
      if (state[idx] === -1) return { path: path, exit: null }; // wall
      var key = idx + ":" + dir;
      if (visited[key]) return { path: path, exit: null }; // loop
      visited[key] = true;
      path.push(idx);

      var mirror = state[idx];
      if (mirror === 1) dir = FWD[dir]; // /
      else if (mirror === 2) dir = BWD[dir]; // backslash

      var ee = exitEdge(x, y, dir);
      if (ee) return { path: path, exit: ee };

      x += DX[dir];
      y += DY[dir];
    }
    return { path: path, exit: null };
  }

  // ----------------------------------------------------------------
  // Display
  // ----------------------------------------------------------------

  var SIGNAL_CLASSES = ["sig-path-a", "sig-path-b", "sig-path-c", "sig-path-d", "sig-path-e"];

  function updateDisplay() {
    // Clear all signal path classes
    for (var i = 0; i < N; i++) {
      var el = cells[i];
      if (state[i] === -1) continue;
      el.classList.remove("sig-cell--fwd", "sig-cell--bwd", "sig-cell--empty");
      for (var sc = 0; sc < SIGNAL_CLASSES.length; sc++) {
        el.classList.remove(SIGNAL_CLASSES[sc]);
      }

      if (baseCells[i] === "/" || baseCells[i] === "\\") continue; // fixed

      if (state[i] === 0) {
        el.classList.add("sig-cell--empty");
        el.textContent = "";
      } else if (state[i] === 1) {
        el.classList.add("sig-cell--fwd");
        el.textContent = "/";
      } else if (state[i] === 2) {
        el.classList.add("sig-cell--bwd");
        el.textContent = "\\";
      }
    }

    // Trace signals and highlight paths
    var cellUsage = {};
    for (var si = 0; si < signals.length; si++) {
      var sig = signals[si];
      var result = traceSignal(sig.from);
      var reached = result.exit &&
        result.exit.edge === sig.to.edge &&
        result.exit.pos === sig.to.pos;

      for (var pi = 0; pi < result.path.length; pi++) {
        var ci = result.path[pi];
        if (state[ci] === -1) continue;
        cells[ci].classList.add(SIGNAL_CLASSES[si] || "sig-path-a");
        cellUsage[ci] = (cellUsage[ci] || 0) + 1;
      }
    }

    // Mark conflicts (cells used by >1 signal)
    for (var ci in cellUsage) {
      if (cellUsage[ci] > 1) {
        cells[ci].classList.add("sig-cell--conflict");
      } else {
        cells[ci].classList.remove("sig-cell--conflict");
      }
    }
  }

  // ----------------------------------------------------------------
  // Solve check
  // ----------------------------------------------------------------

  function checkSolved() {
    // All empty cells must be filled
    for (var i = 0; i < N; i++) {
      if (baseCells[i] === "." && state[i] === 0) return false;
    }

    var cellUsage = {};
    for (var si = 0; si < signals.length; si++) {
      var sig = signals[si];
      var result = traceSignal(sig.from);
      if (!result.exit) return false;
      if (result.exit.edge !== sig.to.edge || result.exit.pos !== sig.to.pos) return false;
      for (var pi = 0; pi < result.path.length; pi++) {
        var ci = result.path[pi];
        cellUsage[ci] = (cellUsage[ci] || 0) + 1;
      }
    }

    for (var ci in cellUsage) {
      if (cellUsage[ci] > 1) return false;
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
  // Submit
  // ----------------------------------------------------------------

  function submitSolve() {
    var elapsed = Date.now() - startTime;
    finished = true;
    cancelAnimationFrame(timerRAF);
    timerEl.textContent = formatTime(elapsed);
    grid.classList.add("solved");

    var mirrors = {};
    for (var i = 0; i < N; i++) {
      if (baseCells[i] === ".") {
        mirrors[i] = state[i] === 1 ? "/" : "\\";
      }
    }

    for (var i = 0; i < cells.length; i++) cells[i].disabled = true;

    fetch("/api/solves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puzzleId: puzzleId, timeMs: elapsed, answer: mirrors })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        resultEl.classList.remove("hidden");
        if (data.ok) {
          resultEl.innerHTML = "<strong>Solved!</strong> " + formatTime(data.timeMs) +
            (data.rank ? " — Rank #" + data.rank : "");
        } else {
          resultEl.innerHTML = "<strong>Solved!</strong> " + formatTime(elapsed) + ".";
        }
      })
      .catch(function () {
        resultEl.classList.remove("hidden");
        resultEl.innerHTML = "<strong>Solved!</strong> " + formatTime(elapsed) + ".";
      });
  }

  // ----------------------------------------------------------------
  // Click handler
  // ----------------------------------------------------------------

  function handleCellClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (finished) return;
    var cell = this;
    var idx = parseInt(cell.dataset.idx, 10);
    if (state[idx] === -1) return; // wall
    if (baseCells[idx] === "/" || baseCells[idx] === "\\") return; // fixed

    ensureTimer();
    state[idx] = (state[idx] + 1) % 3;
    updateDisplay();
    if (checkSolved()) submitSolve();
  }

  for (var ci = 0; ci < cells.length; ci++) {
    if (!cells[ci].disabled) {
      cells[ci].addEventListener("click", handleCellClick);
    }
  }

  // ----------------------------------------------------------------
  // Reset
  // ----------------------------------------------------------------

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (finished) return;
      for (var i = 0; i < N; i++) {
        if (baseCells[i] === ".") state[i] = 0;
      }
      startTime = 0;
      cancelAnimationFrame(timerRAF);
      timerEl.textContent = "0:00.00";
      updateDisplay();
    });
  }

  updateDisplay();
})();
`;
