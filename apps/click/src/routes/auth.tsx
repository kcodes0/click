/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import {
  clearSessionCookie,
  createUser,
  getUserByUsernameForAuth,
  hashPassword,
  isAllowedUsername,
  issueSessionCookie,
  verifyPassword
} from "@kcodes/auth";
import { checkRateLimit, clientIp } from "../lib/rate-limit";
import { nowMs } from "../lib/time";
import { verifyTurnstile } from "../lib/turnstile";
import type { AppVars, Bindings } from "../types";

const auth = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

type AuthPageProps = {
  title: string;
  action: "/auth/register" | "/auth/login";
  submitLabel: string;
  error?: string | null;
  turnstileSiteKey?: string | null;
};

function AuthPage({ title, action, submitLabel, error, turnstileSiteKey }: AuthPageProps) {
  const isRegister = action === "/auth/register";
  const showTurnstile = isRegister && Boolean(turnstileSiteKey);
  const turnstileHead = showTurnstile ? (
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" defer></script>
  ) : undefined;

  return (
    <Layout title={`${title} / click!`} user={null} head={turnstileHead}>
      <div class="wrap page-content">
        <div class="auth-box">
          <h1>{title}</h1>
          <p class="sub">Username and password only. Email is optional.</p>
          {error && <p class="error-banner">{error}</p>}
          <form method="post" action={action} class="form-stack">
            <label>
              <span>Username</span>
              <input type="text" name="username" minLength={3} maxLength={24} required />
            </label>
            {isRegister && (
              <label>
                <span>Email</span>
                <input type="email" name="email" />
              </label>
            )}
            <label>
              <span>Password</span>
              <input type="password" name="password" minLength={8} required />
            </label>
            {showTurnstile && turnstileSiteKey && (
              <div class="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" />
            )}
            <button type="submit" class="btn">{submitLabel}</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

auth.get("/register", (c) =>
  c.html(
    <AuthPage
      title="Register"
      action="/auth/register"
      submitLabel="Create account"
      turnstileSiteKey={c.env.TURNSTILE_SITE_KEY || null}
    />
  )
);
auth.get("/login", (c) => c.html(<AuthPage title="Log in" action="/auth/login" submitLabel="Log in" />));

auth.post("/register", async (c) => {
  const ip = clientIp(c);
  const siteKey = c.env.TURNSTILE_SITE_KEY || null;

  const renderError = (message: string, status: 400 | 409 | 429) =>
    c.html(
      <AuthPage
        title="Register"
        action="/auth/register"
        submitLabel="Create account"
        error={message}
        turnstileSiteKey={siteKey}
      />,
      status
    );

  if (!(await checkRateLimit(c.env.RL_REGISTER, `register:${ip}`))) {
    return renderError(
      "Too many sign-up attempts. Please wait a minute and try again.",
      429
    );
  }

  const form = await c.req.formData();
  const username = String(form.get("username") || "").trim();
  const emailValue = String(form.get("email") || "").trim();
  const email = emailValue ? emailValue : null;
  const password = String(form.get("password") || "");
  const turnstileToken = String(form.get("cf-turnstile-response") || "");

  const turnstile = await verifyTurnstile(c.env.TURNSTILE_SECRET_KEY, turnstileToken, ip);
  if (!turnstile.ok) {
    return renderError("Please complete the anti-bot challenge and try again.", 400);
  }

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    return renderError(
      "Username must be 3-24 chars using letters, numbers, or underscores.",
      400
    );
  }
  if (!isAllowedUsername(username)) {
    return renderError("That username is not allowed.", 400);
  }
  if (password.length < 8) {
    return renderError("Password must be at least 8 characters.", 400);
  }

  const existing = await getUserByUsernameForAuth(c.env.DB, username);
  if (existing) {
    return renderError("Username already taken.", 409);
  }

  const userId = crypto.randomUUID();
  await createUser(c.env.DB, {
    id: userId,
    username,
    passwordHash: await hashPassword(password),
    email,
    createdAt: nowMs()
  });
  await issueSessionCookie(c, userId);
  return c.redirect("/");
});

auth.post("/login", async (c) => {
  const ip = clientIp(c);
  if (!(await checkRateLimit(c.env.RL_LOGIN, `login:${ip}`))) {
    return c.html(
      <AuthPage
        title="Log in"
        action="/auth/login"
        submitLabel="Log in"
        error="Too many login attempts. Please wait a minute and try again."
      />,
      429
    );
  }

  const form = await c.req.formData();
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "");

  const user = await getUserByUsernameForAuth(c.env.DB, username);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return c.html(<AuthPage title="Log in" action="/auth/login" submitLabel="Log in" error="Invalid username or password." />, 401);
  }

  await issueSessionCookie(c, user.id);
  return c.redirect("/");
});

auth.post("/logout", (c) => {
  clearSessionCookie(c);
  return c.redirect("/");
});

export default auth;
