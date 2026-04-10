import type { Context } from "hono";
import type { RateLimit } from "../types";

export function clientIp(c: Context): string {
  const connecting = c.req.header("cf-connecting-ip");
  if (connecting) return connecting;

  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return "unknown";
}

export async function checkRateLimit(
  limiter: RateLimit,
  key: string
): Promise<boolean> {
  const { success } = await limiter.limit({ key });
  return success;
}
