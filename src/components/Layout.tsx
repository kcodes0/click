/** @jsxImportSource hono/jsx */
import type { Child } from "hono/jsx";
import { STYLE_CSS } from "../static/assets";
import type { User } from "../types";

type LayoutProps = {
  title: string;
  user: User | null;
  children: Child;
};

export function Layout({ title, user, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap" rel="stylesheet" />
        <style>{STYLE_CSS}</style>
      </head>
      <body>
        <header class="header">
          <div class="wrap header-inner">
            <a class="logo" href="/">click<span class="logo-bang">!</span></a>
            <nav class="nav">
              <a href="/play/daily">Daily</a>
              <a href="/crown">Crown</a>
              <a href="/leaderboard/daily">Archive</a>
              {user ? (
                <form method="post" action="/auth/logout">
                  <button class="nav-btn" type="submit">
                    {user.username} / Log out
                  </button>
                </form>
              ) : (
                <>
                  <a href="/auth/login">Log in</a>
                  <a href="/auth/register">Register</a>
                </>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
