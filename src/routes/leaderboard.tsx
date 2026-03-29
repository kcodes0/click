/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import { Leaderboard } from "../components/Leaderboard";
import {
  getChallengeById,
  getCrownLeaderboard,
  getDailyChallengeByArchiveDate,
  getLeaderboard,
  listDailyChallenges
} from "../db/queries";
import { closeExpiredDailyCrowns } from "../lib/crown";
import { formatDateKey } from "../lib/time";
import type { AppVars, Bindings } from "../types";

const leaderboard = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

leaderboard.get("/daily", async (c) => {
  await closeExpiredDailyCrowns(c.env.DB);
  const days = await listDailyChallenges(c.env.DB);

  return c.html(
    <Layout title="Daily archive" user={c.get("user")}>
      <section class="section-page">
        <h1>Daily Challenge Archive</h1>
        {days.length ? (
          <ul class="archive-list">
            {days.map((day) => (
              <li>
                <a href={`/leaderboard/daily/${day.daily_date}`}>
                  {formatDateKey(day.daily_date || "")}
                </a>
                <span>
                  {day.start_article} &rarr; {day.end_article}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p class="muted">No archived dailies yet.</p>
        )}
      </section>
    </Layout>
  );
});

leaderboard.get("/daily/:date", async (c) => {
  const challenge = await getDailyChallengeByArchiveDate(c.env.DB, c.req.param("date"));
  if (!challenge) {
    return c.notFound();
  }

  const entries = await getLeaderboard(c.env.DB, challenge.id);
  return c.html(
    <Layout title="Daily leaderboard" user={c.get("user")}>
      <section class="section-page">
        <span class="tag">{formatDateKey(challenge.daily_date || "")}</span>
        <h1>
          {challenge.start_article} &rarr; {challenge.end_article}
        </h1>
        <Leaderboard kind="runs" entries={entries} />
      </section>
    </Layout>
  );
});

leaderboard.get("/:challengeId", async (c) => {
  const challenge = await getChallengeById(c.env.DB, c.req.param("challengeId"));
  if (!challenge) {
    return c.notFound();
  }

  const entries = await getLeaderboard(c.env.DB, challenge.id);
  return c.html(
    <Layout title="Challenge leaderboard" user={c.get("user")}>
      <section class="section-page">
        <span class="tag">
          {challenge.type === "daily" ? "Daily challenge" : "Freeplay challenge"}
        </span>
        <h1>
          {challenge.start_article} &rarr; {challenge.end_article}
        </h1>
        <Leaderboard kind="runs" entries={entries} />
      </section>
    </Layout>
  );
});

export const crown = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

crown.get("/", async (c) => {
  await closeExpiredDailyCrowns(c.env.DB);
  const entries = await getCrownLeaderboard(c.env.DB, Date.now());
  return c.html(
    <Layout title="Crown leaderboard" user={c.get("user")}>
      <section class="section-page">
        <h1>Crown Leaderboard</h1>
        <p class="section-sub">
          Total time spent holding first place on daily challenges.
        </p>
        <Leaderboard kind="crown" entries={entries} />
      </section>
    </Layout>
  );
});

export default leaderboard;
