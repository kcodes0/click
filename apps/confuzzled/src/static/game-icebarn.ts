export const GAME_ICEBARN_JS = String.raw`(function () {
  var shell = document.querySelector(".pz-shell");
  if (!shell) return;
  var puzzleId = shell.getAttribute("data-puzzle-id");
  var gridData = JSON.parse(shell.getAttribute("data-grid"));
  var W = gridData.w, H = gridData.h;
  var N = W * H;

  var iceSet = {};
  gridData.ice.forEach(function (c) { iceSet[c] = true; });
  var arrowMap = {};
  gridData.arrows.forEach(function (a) { arrowMap[a.cell] = a.dir; });

  var DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];

  function markerToCell(m) {
    if (m.side === "top") return m.pos;
    if (m.side === "bottom") return (H - 1) * W + m.pos;
    if (m.side === "left") return m.pos * W;
    return m.pos * W + (W - 1);
  }
  function markerEntryDir(m) {
    if (m.side === "top") return 2;
    if (m.side === "bottom") return 0;
    if (m.side === "left") return 1;
    return 3;
  }
  function cellInDir(c, d) {
    var x = (c % W) + DX[d], y = Math.floor(c / W) + DY[d];
    if (x < 0 || x >= W || y < 0 || y >= H) return -1;
    return y * W + x;
  }
  function dirBetween(a, b) {
    var d = b - a;
    if (d === 1) return 1;
    if (d === -1) return 3;
    if (d === W) return 2;
    return 0;
  }

  var inCell = markerToCell(gridData.inMarker);
  var outCell = markerToCell(gridData.outMarker);
  var inDir = markerEntryDir(gridData.inMarker);

  var path = [];
  var pathSet = {};
  var visitedNonIce = {};
  var solved = false;

  var startTime = performance.now();
  var timerEl = document.getElementById("timer");
  var resultEl = document.getElementById("game-result");

  function fmt(ms) {
    var t = Math.floor(ms / 1000), m = Math.floor(t / 60), s = t % 60;
    var cs = Math.floor((ms % 1000) / 10);
    return m + ":" + String(s).padStart(2, "0") + "." + String(cs).padStart(2, "0");
  }

  var raf;
  function tick() {
    if (solved) return;
    timerEl.textContent = fmt(performance.now() - startTime);
    raf = requestAnimationFrame(tick);
  }
  tick();

  function isAdjacent(a, b) {
    var dx = Math.abs((a % W) - (b % W));
    var dy = Math.abs(Math.floor(a / W) - Math.floor(b / W));
    return dx + dy === 1;
  }

  function canExtendTo(cell) {
    if (path.length === 0) return cell === inCell;
    var head = path[path.length - 1];
    if (!isAdjacent(head, cell)) return false;
    var dir = dirBetween(head, cell);

    // check arrow at head forces different direction
    if (head !== inCell || path.length > 1) {
      if (arrowMap[head] !== undefined && path.length > 1) {
        // arrow should match the direction we entered the head cell, which is already validated
        // but for exit: if head has arrow, we must leave in arrow direction
        if (arrowMap[head] !== undefined && arrowMap[head] !== dir) return false;
      }
    }
    // if head is on ice, must continue same direction
    if (iceSet[head] && path.length >= 2) {
      var prevDir = dirBetween(path[path.length - 2], head);
      if (dir !== prevDir) return false;
    }
    // can't revisit non-ice
    if (!iceSet[cell] && visitedNonIce[cell]) return false;
    return true;
  }

  function extendPath(cell) {
    path.push(cell);
    pathSet[cell] = (pathSet[cell] || 0) + 1;
    if (!iceSet[cell]) visitedNonIce[cell] = true;
  }

  function truncateTo(idx) {
    while (path.length > idx) {
      var removed = path.pop();
      pathSet[removed]--;
      if (pathSet[removed] <= 0) delete pathSet[removed];
      if (!iceSet[removed]) delete visitedNonIce[removed];
    }
  }

  function renderAll() {
    var cells = document.querySelectorAll(".ib-cell");
    var headIdx = path.length - 1;
    cells.forEach(function (el) {
      var idx = parseInt(el.getAttribute("data-idx"));
      var onPath = pathSet[idx] > 0;
      var isHead = path.length > 0 && path[headIdx] === idx;
      el.classList.toggle("ib-cell--path", onPath);
      el.classList.toggle("ib-cell--head", isHead);
    });
  }

  function trySubmit() {
    if (path.length < 2) return;
    if (path[path.length - 1] !== outCell) return;

    var elapsed = Math.round(performance.now() - startTime);
    fetch("/api/solves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puzzleId: puzzleId, timeMs: elapsed, answer: path })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.ok) {
        solved = true;
        cancelAnimationFrame(raf);
        timerEl.textContent = fmt(elapsed);
        resultEl.textContent = "Solved! " + fmt(elapsed) + (d.rank ? " — #" + d.rank : "");
        resultEl.className = "result-banner";
        document.querySelector(".ib-grid").classList.add("solved");
        if (d.leaderboard) refreshBoard(d.leaderboard);
      } else if (d.error) {
        resultEl.textContent = d.error;
        resultEl.className = "result-banner result-banner--error";
      }
    }).catch(function () {});
  }

  function refreshBoard(entries) {
    var tbody = document.querySelector(".board-table tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    entries.forEach(function (e, i) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + (i+1) + "</td><td>" + e.username + "</td><td>" + fmt(e.timeMs) + "</td>";
      tbody.appendChild(tr);
    });
  }

  // click handler
  var cells = document.querySelectorAll(".ib-cell");
  cells.forEach(function (el) {
    el.addEventListener("click", function () {
      if (solved) return;
      var idx = parseInt(el.getAttribute("data-idx"));

      if (path.length === 0) {
        if (idx === inCell) {
          extendPath(idx);
          renderAll();
        }
        return;
      }

      var head = path[path.length - 1];

      // click head to undo
      if (idx === head && path.length > 1) {
        truncateTo(path.length - 1);
        renderAll();
        if (resultEl) { resultEl.className = "result-banner hidden"; resultEl.textContent = ""; }
        return;
      }

      // click earlier path cell to truncate
      var pathIdx = path.lastIndexOf(idx);
      if (pathIdx >= 0 && pathIdx < path.length - 1) {
        truncateTo(pathIdx + 1);
        renderAll();
        return;
      }

      // try to extend
      if (canExtendTo(idx)) {
        extendPath(idx);
        renderAll();
        if (idx === outCell) trySubmit();
      }
    });
  });

  // start with IN cell
  extendPath(inCell);
  renderAll();

  var resetBtn = document.getElementById("pz-reset");
  if (resetBtn) resetBtn.addEventListener("click", function () {
    if (solved) return;
    truncateTo(0);
    extendPath(inCell);
    renderAll();
    if (resultEl) { resultEl.className = "result-banner hidden"; resultEl.textContent = ""; }
  });
})()`;
