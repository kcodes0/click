/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { IcebarnGrid } from "../components/IcebarnGrid";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import { getArchiveDates, getPuzzleLeaderboard, getPuzzlesByDate } from "../db/queries";
import type { IcebarnData } from "../lib/icebarn";
import { getPuzzleTypeDef } from "../lib/puzzle-types";
import { formatDateKey } from "../lib/time";
import type { AppVars, Bindings } from "../types";

const archive = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

archive.get("/", async (c) => {
  const user = c.get("user");
  const dates = await getArchiveDates(c.env.DB);

  return c.html(
    <Layout title="archive / confuzzled" user={user}>
      <div class="wrap page-content">
        <div class="archive-page">
          <h1 class="archive-title">Archive</h1>
          <p class="archive-sub">Past daily puzzles with solutions. Click a date to view.</p>
          <div class="archive-list">
            {dates.length ? (
              dates.map((d) => (
                <a href={`/archive/${d}`} class="archive-date-link">
                  {formatDateKey(d)}
                </a>
              ))
            ) : (
              <p>No archived puzzles yet.</p>
            )}
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="wrap"><p>every puzzle, preserved.</p></div>
      </footer>
    </Layout>
  );
});

archive.get("/:dateKey", async (c) => {
  const user = c.get("user");
  const dateKey = c.req.param("dateKey");
  const puzzles = await getPuzzlesByDate(c.env.DB, dateKey);

  if (!puzzles.length) return c.notFound();

  const icebarnPuzzles = puzzles.filter((p) => p.type.startsWith("icebarn"));
  if (!icebarnPuzzles.length) return c.notFound();

  const puzzlesWithData = await Promise.all(
    icebarnPuzzles.map(async (p) => {
      const def = getPuzzleTypeDef(p.type);
      const leaderboard = await getPuzzleLeaderboard(c.env.DB, p.id);
      const gridData = JSON.parse(p.grid) as IcebarnData;
      const solution = JSON.parse(p.solution) as number[];
      return { puzzle: p, def, leaderboard, gridData, solution };
    })
  );

  return c.html(
    <Layout title={`${formatDateKey(dateKey)} / archive / confuzzled`} user={user}>
      <div class="wrap page-content">
        <div class="archive-page">
          <h1 class="archive-title">{formatDateKey(dateKey)}</h1>
          <a href="/archive" class="btn btn--ghost btn--sm">Back to archive</a>

          {puzzlesWithData.map(({ puzzle, def, leaderboard, gridData, solution }) => (
            <div class="archive-puzzle">
              <h2 class="archive-puzzle-name">
                {def?.displayName || puzzle.type}
                <span class="archive-puzzle-size">{puzzle.width}x{puzzle.height}</span>
              </h2>

              <div class="archive-grid-wrap">
                <div class="archive-grid" data-solution={JSON.stringify(solution)}>
                  <IcebarnGrid gridData={gridData} />
                </div>
                <div class="archive-solution-toggle">
                  <button type="button" class="btn btn--ghost btn--sm archive-show-sol">
                    Show solution
                  </button>
                </div>
              </div>

              <aside class="pz-side">
                <h3 class="pz-side-heading">Fastest Solves</h3>
                <Leaderboard entries={leaderboard} />
              </aside>
            </div>
          ))}
        </div>
      </div>
      <footer class="footer">
        <div class="wrap"><p><a href="/archive">back to archive</a></p></div>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: `
        document.querySelectorAll('.archive-show-sol').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var wrap = btn.closest('.archive-grid-wrap');
            var grid = wrap.querySelector('.archive-grid');
            var sol = JSON.parse(grid.getAttribute('data-solution'));
            var cells = grid.querySelectorAll('.ib-cell');
            var solSet = {};
            sol.forEach(function(c, i) {
              solSet[c] = true;
            });
            cells.forEach(function(el) {
              var idx = parseInt(el.getAttribute('data-idx'));
              if (solSet[idx]) el.classList.add('ib-cell--path');
              if (idx === sol[0]) el.classList.add('ib-cell--head');
            });
            btn.textContent = 'Solution shown';
            btn.disabled = true;
          });
        });

        document.querySelectorAll('.archive-grid .ib-cell').forEach(function(el) {
          el.style.cursor = 'default';
          el.disabled = true;
        });
      `}} />
    </Layout>
  );
});

export default archive;
