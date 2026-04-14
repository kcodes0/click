/** @jsxImportSource hono/jsx */
import {
  authMiddleware,
  clearSessionCookie,
  createUser,
  getUserByUsernameForAuth,
  hashPassword,
  isAllowedUsername,
  issueSessionCookie,
  verifyPassword
} from "@kcodes/auth";
import { Hono } from "hono";
import { Layout } from "../components/Layout";
import type { AppVars, Bindings } from "../types";

const auth = new Hono<{ Bindings: Bindings; Variables: AppVars }>();

type AuthPageProps = {
  title: string;
  action: "/auth/register" | "/auth/login";
  submitLabel: string;
  error?: string | null;
};

function AuthPage({ title, action, submitLabel, error }: AuthPageProps) {
  const isRegister = action === "/auth/register";
  return (
    <Layout title={`${title} / games`} user={null}>
      <div class="wrap page-content">
        <div class="auth-box">
          <h1>{title}</h1>
          <p class="sub">One account works across every kcodes game.</p>
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
            <button type="submit" class="btn">{submitLabel}</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

auth.get("/register", (c) =>
  c.html(<AuthPage title="Register" action="/auth/register" submitLabel="Create account" />)
);

auth.get("/login", (c) =>
  c.html(<AuthPage title="Log in" action="/auth/login" submitLabel="Log in" />)
);

auth.post("/register", async (c) => {
  const renderError = (message: string, status: 400 | 409) =>
    c.html(
      <AuthPage
        title="Register"
        action="/auth/register"
        submitLabel="Create account"
        error={message}
      />,
      status
    );

  const form = await c.req.formData();
  const username = String(form.get("username") || "").trim();
  const emailValue = String(form.get("email") || "").trim();
  const email = emailValue ? emailValue : null;
  const password = String(form.get("password") || "");

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
    createdAt: Date.now()
  });
  await issueSessionCookie(c, userId);
  return c.redirect("/");
});

auth.post("/login", async (c) => {
  const form = await c.req.formData();
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "");

  const user = await getUserByUsernameForAuth(c.env.DB, username);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return c.html(
      <AuthPage
        title="Log in"
        action="/auth/login"
        submitLabel="Log in"
        error="Invalid username or password."
      />,
      401
    );
  }

  await issueSessionCookie(c, user.id);
  return c.redirect("/");
});

auth.post("/logout", (c) => {
  clearSessionCookie(c);
  return c.redirect("/");
});

export { authMiddleware };
export default auth;
