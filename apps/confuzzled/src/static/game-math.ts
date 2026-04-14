export const GAME_MATH_JS = String.raw`(function () {
  var shell = document.querySelector(".pz-shell");
  if (!shell) return;

  var puzzleId = shell.getAttribute("data-puzzle-id");
  var timerEl = document.getElementById("timer");
  var resultEl = document.getElementById("game-result");
  var answerInput = document.getElementById("math-answer");
  var submitBtn = document.getElementById("math-submit");
  var resetBtn = document.getElementById("pz-reset");
  var attemptsEl = document.getElementById("attempts-count");

  var startTime = performance.now();
  var solved = false;
  var attempts = 0;
  var timerRaf = 0;

  function formatTime(ms) {
    var total = Math.floor(ms / 1000);
    var m = Math.floor(total / 60);
    var s = total % 60;
    var cs = Math.floor((ms % 1000) / 10);
    return m + ":" + String(s).padStart(2, "0") + "." + String(cs).padStart(2, "0");
  }

  function tick() {
    if (solved) return;
    var elapsed = performance.now() - startTime;
    if (timerEl) timerEl.textContent = formatTime(elapsed);
    timerRaf = requestAnimationFrame(tick);
  }
  tick();

  function showResult(msg, isError) {
    if (!resultEl) return;
    resultEl.textContent = msg;
    resultEl.className = "result-banner" + (isError ? " result-banner--error" : "");
  }

  function handleSubmit() {
    if (solved || !answerInput) return;
    var answer = answerInput.value.trim();
    if (!answer) {
      showResult("Enter an answer first.", true);
      return;
    }

    var elapsed = Math.round(performance.now() - startTime);
    submitBtn.disabled = true;
    submitBtn.textContent = "Checking...";

    fetch("/api/solves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puzzleId: puzzleId, timeMs: elapsed, answer: answer })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.ok) {
          solved = true;
          cancelAnimationFrame(timerRaf);
          if (timerEl) timerEl.textContent = formatTime(elapsed);
          showResult("Correct! Time: " + formatTime(elapsed) + (data.rank ? " — Rank #" + data.rank : ""), false);
          answerInput.disabled = true;
          submitBtn.textContent = "Solved";

          if (data.leaderboard) renderLeaderboard(data.leaderboard);
        } else {
          attempts++;
          if (attemptsEl) attemptsEl.textContent = attempts;
          showResult(data.error || "Incorrect. Try again.", true);
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
          answerInput.select();
        }
      })
      .catch(function () {
        showResult("Network error. Try again.", true);
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      });
  }

  function renderLeaderboard(entries) {
    var tbody = document.querySelector(".board-table tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    entries.forEach(function (e, i) {
      var tr = document.createElement("tr");
      var tdRank = document.createElement("td");
      var tdName = document.createElement("td");
      var tdTime = document.createElement("td");
      tdRank.textContent = i + 1;
      tdName.textContent = e.username;
      tdTime.textContent = formatTime(e.timeMs);
      tr.appendChild(tdRank);
      tr.appendChild(tdName);
      tr.appendChild(tdTime);
      tbody.appendChild(tr);
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmit);
  }

  if (answerInput) {
    answerInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleSubmit();
    });
    answerInput.focus();
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (solved) return;
      if (answerInput) {
        answerInput.value = "";
        answerInput.focus();
      }
      if (resultEl) {
        resultEl.className = "result-banner hidden";
        resultEl.textContent = "";
      }
    });
  }

  // KaTeX auto-render after load
  function tryRender() {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(document.querySelector(".math-statement"), {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false }
        ],
        throwOnError: false
      });
    }
  }

  if (document.readyState === "complete") {
    tryRender();
  } else {
    window.addEventListener("load", tryRender);
  }
  // Also try after a short delay in case KaTeX loaded before this script
  setTimeout(tryRender, 100);
})()`;
