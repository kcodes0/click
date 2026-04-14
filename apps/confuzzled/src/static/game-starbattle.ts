export const GAME_STARBATTLE_JS = String.raw`(function () {
  var shell = document.querySelector(".pz-shell");
  if (!shell) return;
  var puzzleId = shell.getAttribute("data-puzzle-id");
  var gridData = JSON.parse(shell.getAttribute("data-grid"));
  var W = gridData.w, H = gridData.h, numStars = gridData.numStars;
  var N = W * H;

  // 0 = empty, 1 = star
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

  var cells = document.querySelectorAll(".sb-cell");
  cells.forEach(function (el) {
    el.addEventListener("click", function () {
      if (solved) return;
      var idx = parseInt(el.getAttribute("data-idx"));
      state[idx] = state[idx] === 1 ? 0 : 1;
      render(idx);
      checkSolved();
    });
  });

  function render(idx) {
    var el = cells[idx];
    if (!el) return;
    var base = el.className.replace(/ sb-cell--star/g, "");
    el.className = base + (state[idx] === 1 ? " sb-cell--star" : "");
    el.textContent = state[idx] === 1 ? "\u2605" : "";
  }

  function checkSolved() {
    var answer = [];
    for (var i = 0; i < N; i++) if (state[i] === 1) answer.push(i);
    if (answer.length !== numStars * H) return;

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
        document.querySelector(".sb-grid").classList.add("solved");
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
