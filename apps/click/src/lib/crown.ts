import {
  closeCrownLog,
  closeExpiredCrowns,
  getOpenCrownLog,
  getTopRun,
  openCrownLog
} from "../db/queries";
import type { Challenge } from "../types";
import { getChallengeWindowEnd, getDailyDateKey, nowMs } from "./time";

export async function closeExpiredDailyCrowns(db: D1Database): Promise<void> {
  const currentKey = getDailyDateKey();
  await closeExpiredCrowns(db, currentKey, (dateKey) => getChallengeWindowEnd(dateKey));
}

export async function maybeUpdateCrownForRun(
  db: D1Database,
  challenge: Challenge,
  runId: string,
  userId: string,
  completedAt = nowMs()
): Promise<boolean> {
  if (challenge.type !== "daily") {
    return false;
  }

  const topRun = await getTopRun(db, challenge.id);
  if (!topRun || topRun.id !== runId) {
    return false;
  }

  const openLog = await getOpenCrownLog(db, challenge.id);
  if (openLog?.user_id === userId) {
    return false;
  }

  if (openLog) {
    await closeCrownLog(db, openLog.id, completedAt);
  }

  await openCrownLog(db, {
    id: crypto.randomUUID(),
    challengeId: challenge.id,
    userId,
    startedAt: completedAt
  });

  return true;
}
