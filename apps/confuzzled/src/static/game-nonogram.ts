export const GAME_NONOGRAM_JS = String.raw`(function () {
  var shell = document.querySelector(".pz-shell");
  if (!shell) return;
  var puzzleId = shell.getAttribute("data-puzzle-id");
  var gridData = JSON.parse(shell.getAttribute("data-grid"));
  var W = gridData.w, H = gridData.h;
  var N = W * H;

  // 0 = empty, 1 = filled, 2 = marked-empty
  var state = new Int8Array(N);
  var startTime = performance.now();
  var solved = false;
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

  var cells = document.querySelectorAll(".nono-cell");
  cells.forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (solved) return;
      var idx = parseInt(el.getAttribute("data-idx"));
      state[idx] = (state[idx] + 1) % 3;
      render(idx);
      checkSolved();
    });
    el.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      if (solved) return;
      var idx = parseInt(el.getAttribute("data-idx"));
      state[idx] = state[idx] === 2 ? 0 : 2;
      render(idx);
    });
  });

  function render(idx) {
    var el = cells[idx];
    if (!el) return;
    el.className = "nono-cell" +
      (state[idx] === 1 ? " nono-cell--filled" : "") +
      (state[idx] === 2 ? " nono-cell--x" : "");
  }

  function checkSolved() {
    var answer = [];
    for (var i = 0; i < N; i++) answer.push(state[i] === 1 ? 1 : 0);
    var elapsed = Math.round(performance.now() - startTime);

    fetch("/api/solves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puzzleId: puzzleId, timeMs: elapsed, answer: answer })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.ok) {
        solved = true;
        cancelAnimationFrame(raf);
        timerEl.textContent = fmt(elapsed);
        resultEl.textContent = "Solved! " + fmt(elapsed) + (d.rank ? " — #" + d.rank : "");
        resultEl.className = "result-banner";
        document.querySelector(".nono-table").classList.add("solved");
        if (d.leaderboard) refreshBoard(d.leaderboard);
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

  var resetBtn = document.getElementById("pz-reset");
  if (resetBtn) resetBtn.addEventListener("click", function () {
    if (solved) return;
    for (var i = 0; i < N; i++) { state[i] = 0; render(i); }
    if (resultEl) { resultEl.className = "result-banner hidden"; resultEl.textContent = ""; }
  });
})()`;
