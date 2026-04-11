import type { User } from "./types";

export async function getUserById(
  db: D1Database,
  id: string
): Promise<User | null> {
  const result = await db
    .prepare(
      "SELECT id, username, email, created_at FROM users WHERE id = ? LIMIT 1"
    )
    .bind(id)
    .first<User>();
  return result ?? null;
}

export async function getUserByUsernameForAuth(
  db: D1Database,
  username: string
): Promise<(User & { password_hash: string }) | null> {
  const result = await db
    .prepare(
      "SELECT id, username, email, created_at, password_hash FROM users WHERE username = ? LIMIT 1"
    )
    .bind(username)
    .first<User & { password_hash: string }>();
  return result ?? null;
}

export async function createUser(
  db: D1Database,
  user: {
    id: string;
    username: string;
    passwordHash: string;
    email: string | null;
    createdAt: number;
  }
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO users (id, username, password_hash, email, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(user.id, user.username, user.passwordHash, user.email, user.createdAt)
    .run();
}
