import {
  createChallenge,
  getDailyChallengeByDate
} from "../db/queries";
import { getChallengeWindowEnd, getDailyDateKey, nowMs } from "./time";
import { getRandomArticlePair } from "./wikipedia";

export async function ensureDailyChallenge(db: D1Database): Promise<{
  id: string;
  start_article: string;
  end_article: string;
  type: "daily";
  daily_date: string;
  created_by: string | null;
  created_at: number;
}> {
  const dailyDate = getDailyDateKey();
  const existing = await getDailyChallengeByDate(db, dailyDate);

  if (existing) {
    return existing as {
      id: string;
      start_article: string;
      end_article: string;
      type: "daily";
      daily_date: string;
      created_by: string | null;
      created_at: number;
    };
  }

  const { startArticle, endArticle } = await getRandomArticlePair();
  const challenge = {
    id: crypto.randomUUID(),
    startArticle,
    endArticle,
    type: "daily" as const,
    dailyDate,
    createdBy: null,
    createdAt: nowMs()
  };

  try {
    await createChallenge(db, challenge);
  } catch {
    const raced = await getDailyChallengeByDate(db, dailyDate);
    if (raced) {
      return raced as {
        id: string;
        start_article: string;
        end_article: string;
        type: "daily";
        daily_date: string;
        created_by: string | null;
        created_at: number;
      };
    }
    throw new Error("Failed to create or load daily challenge");
  }

  return {
    id: challenge.id,
    start_article: challenge.startArticle,
    end_article: challenge.endArticle,
    type: "daily",
    daily_date: challenge.dailyDate,
    created_by: challenge.createdBy,
    created_at: challenge.createdAt
  };
}

export function getDailyChallengeExpiry(dateKey: string): number {
  return getChallengeWindowEnd(dateKey);
}
