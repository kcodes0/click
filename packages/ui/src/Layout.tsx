/** @jsxImportSource hono/jsx */
import type { User } from "@kcodes/auth";
import type { Child } from "hono/jsx";
import { BASE_CSS } from "./css";

type LayoutProps = {
  title: string;
  user: User | null;
  // Game-specific CSS appended after BASE_CSS. Each game's hero, game-shell,
  // article, and other game-only rules go here. The Layout always inlines
  // BASE_CSS first, so consumers only ship the deltas.
  extraCss?: string;
  // Brand slot rendered top-left in the header (the logo). Each game
  // supplies its own.
  brand: Child;
  // Game-specific nav links rendered between the brand and the auth
  // controls. Auth controls (login / register / username / log out) are
  // rendered automatically by Layout because they're shared across games.
  nav?: Child;
  // Extra <head> children (per-page scripts, preconnects, etc.).
  head?: Child;
  children: Child;
};

const SVG_DEFS = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs><filter id="wobble" x="-8%" y="-15%" width="116%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.2"/></filter><filter id="wobble-strong" x="-10%" y="-18%" width="120%" height="136%"><feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="5"/></filter></defs></svg>`;

export function Layout({ title, user, extraCss, brand, nav, head, children }: LayoutProps) {
  const css = extraCss ? `${BASE_CSS}\n${extraCss}` : BASE_CSS;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#fdf3dc" />
        <meta name="color-scheme" content="light" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <title>{title}</title>
        <link rel="preload" as="font" type="font/woff2" href="/static/fonts/papernotes-regular.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/static/fonts/papernotes-bold.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/ttf" href="/static/fonts/poppin-regular.ttf" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {head}
      </head>
      <body>
        <div aria-hidden="true" class="svg-defs" dangerouslySetInnerHTML={{ __html: SVG_DEFS }} />
        <header class="header">
          <div class="wrap header-inner">
            {brand}
            <input type="checkbox" id="nav-toggle" class="nav-toggle-input" aria-hidden="true" />
            <label for="nav-toggle" class="nav-toggle" aria-label="Toggle menu" role="button">
              <span class="nav-toggle-lines" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span class="nav-toggle-word">menu</span>
            </label>
            <nav class="nav" id="primary-nav">
              {nav}
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
