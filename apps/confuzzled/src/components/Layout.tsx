/** @jsxImportSource hono/jsx */
import type { User } from "@kcodes/auth";
import { Layout as BaseLayout } from "@kcodes/ui";
import type { Child } from "hono/jsx";
import { PUZZLE_CSS } from "../static/css";

type LayoutProps = {
  title: string;
  user: User | null;
  head?: Child;
  children: Child;
};

const BRAND = (
  <a class="logo" href="/">
    confuzzled<span class="logo-bang">!</span>
  </a>
);

const NAV = (
  <>
    <a href="/">Home</a>
    <a href="https://games.kcodes.me">All games</a>
  </>
);

const KATEX_HEAD = (
  <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
      crossorigin="anonymous"
    />
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"
      crossorigin="anonymous"
    ></script>
    <script
      defer
      src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
      crossorigin="anonymous"
    ></script>
  </>
);

export function Layout({ title, user, head, children }: LayoutProps) {
  return (
    <BaseLayout
      title={title}
      user={user}
      extraCss={PUZZLE_CSS}
      brand={BRAND}
      nav={NAV}
      head={
        <>
          {KATEX_HEAD}
          {head}
        </>
      }
    >
      {children}
    </BaseLayout>
  );
}
