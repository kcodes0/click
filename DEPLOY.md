# Deploying the kcodes games monorepo

This is the rollout from the original single-worker `wiki-race` setup to the
new monorepo with three Cloudflare Workers sharing one D1 database and one
session cookie.

## What ships

| Worker         | Code path        | Custom domain        | Status      |
| -------------- | ---------------- | -------------------- | ----------- |
| `wiki-race`    | `apps/click/`    | `click.kcodes.me`    | already live, in-place update |
| `kcodes-portal`| `apps/portal/`   | `games.kcodes.me`    | new |
| `kcodes-maze`  | `apps/maze/`     | `maze.kcodes.me`     | new (placeholder home) |

All three bind to the same D1 database (`wiki-race`, ID `c60569b1-2694-4486-a089-fdf8ef301f7b`).
The portal and maze workers reuse the existing `users` table and add their own
tables alongside it. **No data migration is required.**

## Cloudflare touchpoints

These are the only things that need to happen in the Cloudflare dashboard or
via `wrangler` outside of the deploy commands:

1. **Mirror `JWT_SECRET` to the new workers**
   ```sh
   # Run from the click app to read the existing value, or paste it from
   # wherever you stored it the first time. Use the same value on all three.
   cd apps/portal && wrangler secret put JWT_SECRET
   cd apps/maze   && wrangler secret put JWT_SECRET
   ```

2. **Add custom domains to the new workers** (Cloudflare dashboard → Workers → kcodes-portal / kcodes-maze → Settings → Triggers → Custom Domains → Add)
   - `kcodes-portal` → `games.kcodes.me`
   - `kcodes-maze` → `maze.kcodes.me`

   `click.kcodes.me` is already wired to the existing `wiki-race` worker, no change there.

3. **(Optional) Mirror Turnstile keys to the portal**
   The portal also has its own register/login flow. If you want bot protection on it, run:
   ```sh
   cd apps/portal && wrangler secret put TURNSTILE_SECRET_KEY
   ```
   …and add `TURNSTILE_SITE_KEY` either as a secret or to `apps/portal/wrangler.toml` `[vars]`. The portal currently doesn't render the widget; that's a follow-up if you want it.

That's it. Everything else (`COOKIE_DOMAIN`, D1 binding, font bundling, rate limit bindings) is in `wrangler.toml` and ships with `wrangler deploy`.

## Deploy commands

From the repo root:

```sh
# Click — in-place update of the existing worker. Should be a no-op
# functionally; the cookie now ships with Domain=.kcodes.me.
bun run deploy:click

# Portal — new worker.
cd apps/portal && bun run deploy

# Maze — new worker. Placeholder home page only for now.
cd apps/maze   && bun run deploy

# Apply maze migrations to the shared D1 (creates `mazes` and `maze_runs`
# alongside the existing tables).
cd apps/maze   && bun run db:migrate:remote
```

## Cookie sharing rollout

The auth middleware (`packages/auth/src/middleware.ts`) sets the cookie's
`Domain` attribute from `c.env.COOKIE_DOMAIN`. Each `wrangler.toml` declares:

```toml
[vars]
COOKIE_DOMAIN = ".kcodes.me"
```

The middleware skips the `Domain` attribute on `localhost` / `127.0.0.1`, so
dev keeps working with host-only cookies and you don't need a `.dev.vars`
override.

After the click deploy ships, existing users with old host-only cookies on
`click.kcodes.me` keep working — their next login or logout writes the new
cross-subdomain cookie. No forced logouts.

## Smoke test after deploy

```sh
curl -I https://click.kcodes.me/                # 200, cookie still works
curl -I https://games.kcodes.me/                # 200, shows game cards
curl -I https://maze.kcodes.me/                 # 200, "coming soon" placeholder
curl -I https://games.kcodes.me/static/fonts/papernotes-regular.woff2  # 200
```

Then in a browser: log in on `games.kcodes.me/auth/login`, navigate to
`click.kcodes.me`, header should already show your username (cookie shared via
`.kcodes.me`).

## Adding a fourth game later

1. `mkdir apps/<name> && cd apps/<name>` and copy the maze scaffold as a template.
2. Add an entry to the `GAMES` array in `apps/portal/src/index.tsx`.
3. New worker name in its own `wrangler.toml`, new custom domain in the dashboard, mirror `JWT_SECRET`. Done.
