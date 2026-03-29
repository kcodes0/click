import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { Context, MiddlewareHandler } from "hono";
import { getUserById } from "../db/queries";
import { getJwtSecret } from "../lib/auth";
import type { AppVars, Bindings } from "../types";

const COOKIE_NAME = "wiki_session";

export async function issueSessionCookie(
  c: Context<{ Bindings: Bindings; Variables: AppVars }>,
  userId: string
): Promise<void> {
  const secure = new URL(c.req.url).protocol === "https:";
  const token = await sign(
    { sub: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 },
    getJwtSecret(c.env.JWT_SECRET),
    "HS256"
  );

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    secure,
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearSessionCookie(
  c: Context<{ Bindings: Bindings; Variables: AppVars }>
): void {
  const secure = new URL(c.req.url).protocol === "https:";
  setCookie(c, COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    secure,
    maxAge: 0
  });
}

export const authMiddleware: MiddlewareHandler<{
  Bindings: Bindings;
  Variables: AppVars;
}> = async (c, next) => {
  const token = getCookie(c, COOKIE_NAME);
  c.set("user", null);

  if (token) {
    try {
      const payload = await verify(
        token,
        getJwtSecret(c.env.JWT_SECRET),
        "HS256"
      );
      if (typeof payload.sub === "string") {
        const user = await getUserById(c.env.DB, payload.sub);
        if (user) {
          c.set("user", user);
        }
      }
    } catch {
      clearSessionCookie(c);
    }
  }

  await next();
};

export function requireAuth(
  c: Context<{ Bindings: Bindings; Variables: AppVars }>
): Response | null {
  if (!c.get("user")) {
    return c.redirect("/auth/login");
  }
  return null;
}
