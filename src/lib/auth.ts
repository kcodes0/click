import { compare, hash } from "bcryptjs";

const ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return compare(password, passwordHash);
}

export function getJwtSecret(raw?: string): string {
  if (!raw) {
    throw new Error("JWT_SECRET is not set. Configure it via `wrangler secret put JWT_SECRET`.");
  }
  return raw;
}
