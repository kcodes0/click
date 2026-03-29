/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import { createUser, getUserByUsernameForAuth } from "../db/queries";
import { hashPassword, verifyPassword } from "../lib/auth";
import { isAllowedUsername } from "../lib/profanity";
import { nowMs } from "../lib/time";
import { clearSessionCookie, issueSessionCookie } from "../middleware/auth";
import type { AppVars, Bindings } from "../types";

const auth = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

type AuthPageProps = {
  title: string;
  action: "/auth/register" | "/auth/login";
  submitLabel: string;
  error?: string | null;
};

function AuthPage({ title, action, submitLabel, error }: AuthPageProps) {
  return (
    <Layout title={`${title} / click!`} user={null}>
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
            {action === "/auth/register" && (
              <label>
                <span>Email</span>
                <input type="email" name="email" />
              </label>
            )}
            <label>
              <span>Password</span>
              <input type="password" name="password" minLength={8} required />
            </label>
            <button type="submit" class="btn">{submitLabel}</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

auth.get("/register", (c) => c.html(<AuthPage title="Register" action="/auth/register" submitLabel="Create account" />));
auth.get("/login", (c) => c.html(<AuthPage title="Log in" action="/auth/login" submitLabel="Log in" />));

auth.post("/register", async (c) => {
  const form = await c.req.formData();
  const username = String(form.get("username") || "").trim();
  const emailValue = String(form.get("email") || "").trim();
  const email = emailValue ? emailValue : null;
  const password = String(form.get("password") || "");

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    return c.html(<AuthPage title="Register" action="/auth/register" submitLabel="Create account" error="Username must be 3-24 chars using letters, numbers, or underscores." />, 400);
  }
  if (!isAllowedUsername(username)) {
    return c.html(<AuthPage title="Register" action="/auth/register" submitLabel="Create account" error="That username is not allowed." />, 400);
  }
  if (password.length < 8) {
    return c.html(<AuthPage title="Register" action="/auth/register" submitLabel="Create account" error="Password must be at least 8 characters." />, 400);
  }

  const existing = await getUserByUsernameForAuth(c.env.DB, username);
  if (existing) {
    return c.html(<AuthPage title="Register" action="/auth/register" submitLabel="Create account" error="Username already taken." />, 409);
  }

  const userId = crypto.randomUUID();
  await createUser(c.env.DB, { id: userId, username, passwordHash: await hashPassword(password), email, createdAt: nowMs() });
  await issueSessionCookie(c, userId);
  return c.redirect("/");
});

auth.post("/login", async (c) => {
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
