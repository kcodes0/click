import type { Context, MiddlewareHandler } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { getJwtSecret } from "./password";
import { getUserById } from "./queries";
import type { AuthBindings, AuthVars } from "./types";

// Cookie name kept stable so existing sessions on click.kcodes.me survive
// the monorepo refactor and the new shared-cookie-domain rollout.
const COOKIE_NAME = "wiki_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

// Generic Env shape: any app whose Bindings include AuthBindings and whose
// Variables include AuthVars. Apps are free to add more fields on either
// side without losing type safety here.
type AuthEnv = {
  Bindings: AuthBindings;
  Variables: AuthVars;
};

function cookieOptions<E extends AuthEnv>(c: Context<E>, maxAge: number) {
  const secure = new URL(c.req.url).protocol === "https:";
  const domain = c.env.COOKIE_DOMAIN;
  return {
    httpOnly: true,
    sameSite: "Lax" as const,
    path: "/",
    secure,
    maxAge,
    ...(domain ? { domain } : {})
  };
}

export async function issueSessionCookie<E extends AuthEnv>(
  c: Context<E>,
  userId: string
): Promise<void> {
  const token = await sign(
    { sub: userId, exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE_SECONDS },
    getJwtSecret(c.env.JWT_SECRET),
    "HS256"
  );

  setCookie(c, COOKIE_NAME, token, cookieOptions(c, COOKIE_MAX_AGE_SECONDS));
}

export function clearSessionCookie<E extends AuthEnv>(c: Context<E>): void {
  setCookie(c, COOKIE_NAME, "", cookieOptions(c, 0));
}

export const authMiddleware: MiddlewareHandler<AuthEnv> = async (c, next) => {
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

export function requireAuth<E extends AuthEnv>(c: Context<E>): Response | null {
  if (!c.get("user")) {
    return c.redirect("/auth/login");
  }
  return null;
}
