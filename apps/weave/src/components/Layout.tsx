/** @jsxImportSource hono/jsx */
import type { User } from "@kcodes/auth";
import { Layout as BaseLayout } from "@kcodes/ui";
import type { Child } from "hono/jsx";
import { STYLE_CSS } from "../static/css";

type LayoutProps = {
  title: string;
  user: User | null;
  head?: Child;
  children: Child;
};

const BRAND = (
  <a class="logo" href="/">
    weave<span class="logo-bang">!</span>
  </a>
);

const NAV = (
  <>
    <a href="https://games.kcodes.me">All games</a>
    <a href="/play/daily">Daily</a>
  </>
);

export function Layout({ title, user, head, children }: LayoutProps) {
  return (
    <BaseLayout
      title={title}
      user={user}
      extraCss={STYLE_CSS}
      brand={BRAND}
      nav={NAV}
      head={head}
    >
      {children}
    </BaseLayout>
  );
}
