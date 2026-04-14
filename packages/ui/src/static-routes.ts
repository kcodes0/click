// Mounts the shared font routes onto a Hono app. Each game's wrangler bundles
// these binaries via its own [[rules]] type = "Data" glob, so the routes
// stamp out identical font responses regardless of which worker hosts them.

import type { Hono } from "hono";
import PAPERNOTES_REGULAR from "./fonts/papernotes-regular.woff2";
import PAPERNOTES_BOLD from "./fonts/papernotes-bold.woff2";
import POPPIN_REGULAR from "./fonts/poppin-regular.ttf";

const FONT_CACHE = "public, max-age=31536000, immutable";

export function mountUiAssets(app: Hono<any>): void {
  app.get("/static/fonts/papernotes-regular.woff2", (c) =>
    c.body(PAPERNOTES_REGULAR, 200, {
      "content-type": "font/woff2",
      "cache-control": FONT_CACHE
    })
  );
  app.get("/static/fonts/papernotes-bold.woff2", (c) =>
    c.body(PAPERNOTES_BOLD, 200, {
      "content-type": "font/woff2",
      "cache-control": FONT_CACHE
    })
  );
  app.get("/static/fonts/poppin-regular.ttf", (c) =>
    c.body(POPPIN_REGULAR, 200, {
      "content-type": "font/ttf",
      "cache-control": FONT_CACHE
    })
  );
}
