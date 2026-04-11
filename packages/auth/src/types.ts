export type User = {
  id: string;
  username: string;
  email: string | null;
  created_at: number;
};

// The minimum env shape every app that mounts @kcodes/auth must provide.
// App-specific Bindings types should intersect with this so the auth
// middleware can read what it needs without coupling to one game.
export type AuthBindings = {
  DB: D1Database;
  JWT_SECRET?: string;
  // Optional cookie Domain attribute. Leave unset in dev so cookies are
  // host-only on localhost; set to ".kcodes.me" in production so the same
  // session works across all kcodes.me subdomains.
  COOKIE_DOMAIN?: string;
};

export type AuthVars = {
  user: User | null;
};
