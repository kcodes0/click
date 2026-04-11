/** @jsxImportSource hono/jsx */
import type { User } from "@kcodes/auth";
import { Layout as BaseLayout } from "@kcodes/ui";
import type { Child } from "hono/jsx";
import { STYLE_CSS } from "../static/assets";

type LayoutProps = {
  title: string;
  user: User | null;
  head?: Child;
  children: Child;
};

const BRAND = (
  <a class="logo" href="/">
    click<span class="logo-bang">!</span>
  </a>
);

const NAV = (
  <>
    <a href="/play/daily">Daily</a>
    <a href="/crown">Crown</a>
    <a href="/leaderboard/daily">Archive</a>
  </>
);

export function Layout({ title, user, head, children }: LayoutProps) {
  return (
    <BaseLayout
      title={title}
      user={user}
      css={STYLE_CSS}
      brand={BRAND}
      nav={NAV}
      head={head}
    >
      {children}
    </BaseLayout>
  );
}
