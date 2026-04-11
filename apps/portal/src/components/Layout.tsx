/** @jsxImportSource hono/jsx */
import type { User } from "@kcodes/auth";
import { Layout as BaseLayout } from "@kcodes/ui";
import type { Child } from "hono/jsx";
import { PORTAL_CSS } from "../static/css";

type LayoutProps = {
  title: string;
  user: User | null;
  head?: Child;
  children: Child;
};

const BRAND = (
  <a class="logo" href="/">
    games<span class="logo-bang">!</span>
  </a>
);

// The portal nav is intentionally bare — the page itself is the index of
// games. We just expose a single "Home" link so users can get back from any
// secondary route the portal grows later.
const NAV = (
  <>
    <a href="/">Home</a>
  </>
);

export function Layout({ title, user, head, children }: LayoutProps) {
  return (
    <BaseLayout
      title={title}
      user={user}
      extraCss={PORTAL_CSS}
      brand={BRAND}
      nav={NAV}
      head={head}
    >
      {children}
    </BaseLayout>
  );
}
