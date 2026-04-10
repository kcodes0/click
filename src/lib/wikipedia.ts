import { parseHTML } from "linkedom";

const WIKIPEDIA_PAGE_BASE = "https://en.wikipedia.org/wiki/";
const WIKIPEDIA_RANDOM_SUMMARY =
  "https://en.wikipedia.org/api/rest_v1/page/random/summary";
const WIKI_HEADERS = {
  "api-user-agent": "click/0.1 (local development)",
  "user-agent": "click/0.1 (local development)",
  "accept-language": "en-US,en;q=0.9"
};
const FALLBACK_PAIRS = [
  ["Solar System", "Cheetah"],
  ["Apollo 11", "Jazz"],
  ["Volcano", "Penguin"],
  ["Internet", "Mount Everest"]
] as const;

type RandomSummary = {
  title: string;
  extract?: string;
  type?: string;
};

export type SanitizedArticle = {
  title: string;
  displayTitle: string;
  html: string;
};

export const ARTICLE_CACHE_CONTROL =
  "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400";

type ArticleCacheOptions = {
  cache?: Cache;
  cacheUrlBase?: string;
  waitUntil?: (promise: Promise<unknown>) => void;
};

function normalizeTitle(title: string): string {
  return decodeURIComponent(title).replace(/_/g, " ").trim();
}

function encodeTitle(title: string): string {
  return encodeURIComponent(title.replace(/ /g, "_"));
}

function getDisplayTitle(doc: Document, fallback: string): string {
  const firstHeading = doc.querySelector("h1");
  const title = firstHeading?.textContent?.trim() || doc.querySelector("title")?.textContent?.trim();
  return title || fallback;
}

function shouldRemoveNode(element: Element): boolean {
  const className = element.getAttribute("class") || "";
  const rel = element.getAttribute("rel") || "";
  const href = element.getAttribute("href") || "";
  const id = element.getAttribute("id") || "";

  return (
    className.includes("mw-editsection") ||
    className.includes("reference") ||
    className.includes("reflist") ||
    className.includes("navbox") ||
    className.includes("vertical-navbox") ||
    className.includes("shortdescription") ||
    className.includes("hatnote") ||
    className.includes("metadata") ||
    className.includes("ambox") ||
    className.includes("sidebar") ||
    className.includes("portal") ||
    className.includes("authority-control") ||
    className.includes("mw-jump-link") ||
    rel.includes("nofollow") ||
    href.startsWith("#cite") ||
    id === "References"
  );
}

function extractWikiTarget(href: string): string | null {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//")
  ) {
    const url = new URL(href.startsWith("//") ? `https:${href}` : href);
    if (!url.hostname.endsWith("wikipedia.org")) {
      return null;
    }

    if (url.pathname.startsWith("/wiki/")) {
      return decodeURIComponent(url.pathname.slice("/wiki/".length)).replace(/_/g, " ");
    }

    return null;
  }

  if (href.startsWith("/wiki/")) {
    return decodeURIComponent(href.slice("/wiki/".length)).replace(/_/g, " ");
  }

  if (href.startsWith("./")) {
    const path = href.slice(2);
    const cleanPath = path.split("#")[0].split("?")[0];
    return cleanPath ? decodeURIComponent(cleanPath).replace(/_/g, " ") : null;
  }

  return null;
}

function sanitizeAnchors(doc: Document): void {
  for (const anchor of doc.querySelectorAll("a")) {
    const href = anchor.getAttribute("href") || "";
    const className = anchor.getAttribute("class") || "";
    const target = anchor.getAttribute("target") || "";

    if (
      className.includes("new") ||
      target === "_blank" ||
      href.startsWith("#") ||
      href.startsWith("/w/") ||
      href.includes("action=edit") ||
      href.includes("redlink=1")
    ) {
      anchor.replaceWith(...Array.from(anchor.childNodes));
      continue;
    }

    const targetTitle = extractWikiTarget(href);
    if (!targetTitle || href.includes("#")) {
      anchor.replaceWith(...Array.from(anchor.childNodes));
      continue;
    }

    if (targetTitle.includes(":")) {
      anchor.replaceWith(...Array.from(anchor.childNodes));
      continue;
    }

    anchor.setAttribute("data-wiki-target", targetTitle);
    anchor.setAttribute("href", `/wiki/${encodeTitle(targetTitle)}`);
    anchor.removeAttribute("title");
  }
}

function sanitizeDocument(doc: Document): string {
  for (const element of [
    ...doc.querySelectorAll(
      "script, style, link, meta, noscript, figure[typeof='mw:Error'], sup.reference, ol.references"
    )
  ]) {
    element.remove();
  }

  for (const element of [...doc.querySelectorAll("*")]) {
    if (shouldRemoveNode(element)) {
      element.remove();
    }
  }

  sanitizeAnchors(doc);

  const body =
    doc.querySelector("body") ||
    doc.querySelector("main") ||
    doc.documentElement;

  return body.innerHTML;
}

export async function fetchSanitizedArticle(title: string): Promise<SanitizedArticle> {
  const normalizedTitle = normalizeTitle(title);
  const response = await fetch(`${WIKIPEDIA_PAGE_BASE}${encodeTitle(normalizedTitle)}`, {
    headers: {
      ...WIKI_HEADERS,
      accept: "text/html"
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Wikipedia article fetch failed: ${response.status} ${errorBody.slice(0, 200)}`
    );
  }

  const html = await response.text();
  const { document } = parseHTML(html);
  const contentRoot =
    document.querySelector("#mw-content-text .mw-parser-output") ||
    document.querySelector(".mw-parser-output");

  if (!contentRoot) {
    throw new Error("Wikipedia article page missing content root");
  }

  const titleText =
    document.querySelector("#firstHeading")?.textContent?.trim() ||
    getDisplayTitle(document, normalizedTitle);
  const { document: articleDocument } = parseHTML(contentRoot.outerHTML);

  return {
    title: titleText || normalizedTitle,
    displayTitle: titleText || normalizedTitle,
    html: sanitizeDocument(articleDocument)
  };
}

export async function getCachedSanitizedArticle(
  title: string,
  options: ArticleCacheOptions = {}
): Promise<SanitizedArticle> {
  const normalizedTitle = normalizeTitle(title);
  const cache =
    options.cache && options.cacheUrlBase
      ? {
          store: options.cache,
          key: new Request(
            new URL(`/api/wikipedia/${encodeTitle(normalizedTitle)}`, options.cacheUrlBase)
              .toString(),
            { method: "GET" }
          )
        }
      : null;

  if (cache) {
    const cachedResponse = await cache.store.match(cache.key);
    if (cachedResponse) {
      return (await cachedResponse.json()) as SanitizedArticle;
    }
  }

  const article = await fetchSanitizedArticle(normalizedTitle);

  if (cache) {
    const cacheWrite = cache.store.put(
      cache.key,
      new Response(JSON.stringify(article), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": ARTICLE_CACHE_CONTROL
        }
      })
    );

    if (options.waitUntil) {
      options.waitUntil(cacheWrite);
    } else {
      await cacheWrite;
    }
  }

  return article;
}

async function fetchRandomSummary(): Promise<RandomSummary> {
  const response = await fetch(WIKIPEDIA_RANDOM_SUMMARY, {
    redirect: "manual",
    headers: {
      ...WIKI_HEADERS,
      accept: "application/json"
    }
  });

  const redirectLocation = response.headers.get("location");
  if (response.status >= 300 && response.status < 400 && redirectLocation) {
    const redirected = await fetch(redirectLocation, {
      headers: {
        ...WIKI_HEADERS,
        accept: "application/json"
      }
    });

    if (!redirected.ok) {
      throw new Error(`Wikipedia random redirect fetch failed: ${redirected.status}`);
    }

    return (await redirected.json()) as RandomSummary;
  }

  if (!response.ok) {
    throw new Error(`Wikipedia random fetch failed: ${response.status}`);
  }

  return (await response.json()) as RandomSummary;
}

function isUsableRandomArticle(summary: RandomSummary): boolean {
  if (!summary.title) {
    return false;
  }

  if (summary.type && summary.type !== "standard") {
    return false;
  }

  if (summary.title.includes("(disambiguation)")) {
    return false;
  }

  return (summary.extract || "").trim().length >= 120;
}

export async function getRandomArticlePair(): Promise<{
  startArticle: string;
  endArticle: string;
}> {
  try {
    let startArticle = "";
    let endArticle = "";
    let attempts = 0;

    while (!startArticle && attempts < 12) {
      attempts += 1;
      const summary = await fetchRandomSummary();
      if (isUsableRandomArticle(summary)) {
        startArticle = summary.title.trim();
      }
    }

    while (!endArticle && attempts < 24) {
      attempts += 1;
      const summary = await fetchRandomSummary();
      if (isUsableRandomArticle(summary) && summary.title.trim() !== startArticle) {
        endArticle = summary.title.trim();
      }
    }

    if (startArticle && endArticle) {
      return { startArticle, endArticle };
    }
  } catch {
    // Fall back to a known-good pair when Wikipedia random seeding is unavailable.
  }

  const pair = FALLBACK_PAIRS[Math.floor(Math.random() * FALLBACK_PAIRS.length)];
  return { startArticle: pair[0], endArticle: pair[1] };
}
