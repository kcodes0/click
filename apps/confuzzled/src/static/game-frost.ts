export const GAME_FROST_JS = String.raw`(function () {
  "use strict";

  var shell = document.querySelector(".pz-shell");
  if (!shell) return;

  var puzzleId = shell.dataset.puzzleId;
  var gridData = JSON.parse(shell.dataset.grid);
  var W = parseInt(shell.dataset.gridWidth, 10);
  var H = parseInt(shell.dataset.gridHeight, 10);
  var N = W * H;
  var frostCells = gridData.cells;
  var arrows = gridData.arrows;

  var grid = document.querySelector(".pz-grid");
  var timerEl = document.getElementById("timer");
  var resultEl = document.getElementById("game-result");
  var resetBtn = document.getElementById("pz-reset");
  var cells = grid.querySelectorAll(".pz-cell");

  // State: 0 = unknown, 1 = ice, 2 = not-ice
  var state = new Int8Array(N);
  var startTime = 0;
  var timerRAF = 0;
  var finished = false;

  var arrowSet = {};
  for (var ai = 0; ai < arrows.length; ai++) {
    arrowSet[arrows[ai].idx] = true;
  }

  // ----------------------------------------------------------------
  // Neighbors (8-directional including self)
  // ----------------------------------------------------------------

  var D8 = [[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]];

  function neighbors8(idx) {
    var x = idx % W, y = (idx / W) | 0;
    var result = [];
    for (var d = 0; d < 9; d++) {
      var nx = x + D8[d][0], ny = y + D8[d][1];
      if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
        result.push(ny * W + nx);
      }
    }
    return result;
  }

  // ----------------------------------------------------------------
  // Display
  // ----------------------------------------------------------------

  function updateDisplay() {
    for (var i = 0; i < N; i++) {
      var el = cells[i];
      el.classList.toggle("frost-cell--ice", state[i] === 1);
      el.classList.toggle("frost-cell--noice", state[i] === 2);
      el.classList.toggle("frost-cell--unknown", state[i] === 0);
    }

    // Check number constraint violations
    for (var i = 0; i < N; i++) {
      var num = parseInt(frostCells[i]);
      if (isNaN(num)) continue;
      var nbrs = neighbors8(i);
      var iceCount = 0;
      var unknownCount = 0;
      for (var j = 0; j < nbrs.length; j++) {
        if (state[nbrs[j]] === 1) iceCount++;
        else if (state[nbrs[j]] === 0) unknownCount++;
      }
      var over = iceCount > num;
      var impossible = iceCount + unknownCount < num;
      cells[i].classList.toggle("frost-cell--error", over || impossible);
    }
  }

  // ----------------------------------------------------------------
  // Solve check
  // ----------------------------------------------------------------

  function checkSolved() {
    for (var i = 0; i < N; i++) {
      if (frostCells[i] === "#") continue;
      if (state[i] === 0) return false; // still unknown
    }

    // All arrows must be ice
    for (var ai = 0; ai < arrows.length; ai++) {
      if (state[arrows[ai].idx] !== 1) return false;
    }

    // Check number constraints
    for (var i = 0; i < N; i++) {
      var num = parseInt(frostCells[i]);
      if (isNaN(num)) continue;
      var nbrs = neighbors8(i);
      var iceCount = 0;
      for (var j = 0; j < nbrs.length; j++) {
        if (state[nbrs[j]] === 1) iceCount++;
      }
      if (iceCount !== num) return false;
    }

    // Coverage: every ice cell must touch a number
    for (var i = 0; i < N; i++) {
      if (state[i] !== 1) continue;
      var nbrs = neighbors8(i);
      var touchesNum = false;
      for (var j = 0; j < nbrs.length; j++) {
        if (!isNaN(parseInt(frostCells[nbrs[j]]))) {
          touchesNum = true;
          break;
        }
      }
      if (!touchesNum) return false;
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

    var icePositions = [];
    for (var i = 0; i < N; i++) {
      if (state[i] === 1) icePositions.push(i);
    }

    for (var i = 0; i < cells.length; i++) cells[i].disabled = true;

    fetch("/api/solves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puzzleId: puzzleId, timeMs: elapsed, answer: icePositions })
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
    var idx = parseInt(this.dataset.idx, 10);
    if (frostCells[idx] === "#") return;

    ensureTimer();
    state[idx] = (state[idx] + 1) % 3;
    updateDisplay();
    if (checkSolved()) submitSolve();
  }

  for (var ci = 0; ci < cells.length; ci++) {
    cells[ci].addEventListener("click", handleCellClick);
  }

  // ----------------------------------------------------------------
  // Reset
  // ----------------------------------------------------------------

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (finished) return;
      for (var i = 0; i < N; i++) state[i] = 0;
      startTime = 0;
      cancelAnimationFrame(timerRAF);
      timerEl.textContent = "0:00.00";
      updateDisplay();
    });
  }

  updateDisplay();
})();
`;
