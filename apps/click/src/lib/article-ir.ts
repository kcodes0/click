// Experimental article renderer.
//
// Instead of passing Wikipedia's raw (sanitized) HTML through to the browser,
// this module walks the sanitized Document into a small block-level IR and
// re-emits it as minimal HTML with namespaced `article-x-*` classes. The goal
// is to eliminate floating infoboxes, stray Wikipedia utility classes, and
// tables that push paragraphs around.
//
// The input is expected to be a Document that has already been through
// wikipedia.ts's chrome-stripping + anchor rewriting pipeline, so `<a>`
// elements carry `data-wiki-target="..."` on valid wiki links.

type InlineRun =
  | { kind: "text"; value: string }
  | { kind: "link"; target: string; children: InlineRun[] }
  | { kind: "em"; children: InlineRun[] }
  | { kind: "strong"; children: InlineRun[] }
  | { kind: "code"; value: string }
  | { kind: "dead"; value: string };

type InfoboxItem =
  | { kind: "section"; title: string }
  | { kind: "pair"; label: string; value: InlineRun[] }
  | { kind: "note"; runs: InlineRun[] }
  | {
      kind: "image";
      src: string;
      srcset: string | null;
      alt: string;
      width: number | null;
      height: number | null;
    };

type Block =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "paragraph"; runs: InlineRun[] }
  | { kind: "list"; ordered: boolean; items: InlineRun[][] }
  | { kind: "quote"; runs: InlineRun[] }
  | { kind: "hr" }
  | {
      kind: "table";
      caption: string | null;
      headers: InlineRun[][] | null;
      rows: InlineRun[][][];
    }
  | { kind: "infobox"; title: string | null; items: InfoboxItem[] }
  | {
      kind: "figure";
      src: string;
      srcset: string | null;
      alt: string;
      width: number | null;
      height: number | null;
      caption: InlineRun[] | null;
    };

const NODE_TEXT = 3;
const NODE_ELEMENT = 1;

const INLINE_SKIP_TAGS = new Set([
  "script",
  "style",
  "noscript",
  "sup.reference"
]);

function tagName(node: any): string {
  return typeof node?.tagName === "string" ? node.tagName.toLowerCase() : "";
}

function elementChildren(node: any): any[] {
  const out: any[] = [];
  const children = node?.childNodes;
  if (!children) return out;
  for (const child of children) {
    if (child?.nodeType === NODE_ELEMENT) out.push(child);
  }
  return out;
}

function textContent(node: any): string {
  return typeof node?.textContent === "string" ? node.textContent : "";
}

// Like textContent, but inserts a space between child element boundaries
// so `<th>Cheetah<div>Temporal range: ...</div></th>` does not collapse to
// "CheetahTemporal range: ...". Used for headings and infobox labels.
function elementText(node: any): string {
  if (!node) return "";
  if (node.nodeType === NODE_TEXT) {
    return typeof node.textContent === "string" ? node.textContent : "";
  }
  if (node.nodeType !== NODE_ELEMENT) return "";
  const parts: string[] = [];
  for (const child of node.childNodes || []) {
    if (child.nodeType === NODE_TEXT) {
      parts.push(child.textContent || "");
    } else if (child.nodeType === NODE_ELEMENT) {
      parts.push(" ");
      parts.push(elementText(child));
      parts.push(" ");
    }
  }
  return collapseWhitespace(parts.join("")).trim();
}

function hasClass(el: any, needle: string): boolean {
  const cls = (el?.getAttribute && el.getAttribute("class")) || "";
  return typeof cls === "string" && cls.split(/\s+/).includes(needle);
}

function classContains(el: any, needle: string): boolean {
  const cls = (el?.getAttribute && el.getAttribute("class")) || "";
  return typeof cls === "string" && cls.includes(needle);
}

function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ");
}

function extractInline(node: any): InlineRun[] {
  const runs: InlineRun[] = [];
  const children = node?.childNodes;
  if (!children) return runs;

  for (const child of children) {
    if (child?.nodeType === NODE_TEXT) {
      const value = collapseWhitespace(textContent(child));
      if (value) runs.push({ kind: "text", value });
      continue;
    }

    if (child?.nodeType !== NODE_ELEMENT) continue;

    const tag = tagName(child);
    if (INLINE_SKIP_TAGS.has(tag)) continue;

    // Drop citation superscripts entirely.
    if (tag === "sup" && classContains(child, "reference")) continue;
    // Drop "edit section" links that sneak through.
    if (tag === "span" && classContains(child, "mw-editsection")) continue;

    if (tag === "br") {
      runs.push({ kind: "text", value: " " });
      continue;
    }

    if (tag === "a") {
      const target =
        (child.getAttribute && child.getAttribute("data-wiki-target")) || "";
      const children = extractInline(child);
      if (target) {
        runs.push({ kind: "link", target, children });
      } else {
        // No valid wiki target — render as plain text.
        const value = collapseWhitespace(textContent(child)).trim();
        if (value) runs.push({ kind: "dead", value });
      }
      continue;
    }

    if (tag === "i" || tag === "em" || tag === "cite") {
      const inner = extractInline(child);
      if (inner.length) runs.push({ kind: "em", children: inner });
      continue;
    }

    if (tag === "b" || tag === "strong") {
      const inner = extractInline(child);
      if (inner.length) runs.push({ kind: "strong", children: inner });
      continue;
    }

    if (tag === "code" || tag === "tt" || tag === "kbd" || tag === "samp") {
      const value = textContent(child).trim();
      if (value) runs.push({ kind: "code", value });
      continue;
    }

    // Unwrap spans, abbrs, wrappers, etc.
    runs.push(...extractInline(child));
  }

  return normalizeRuns(runs);
}

function normalizeRuns(runs: InlineRun[]): InlineRun[] {
  const out: InlineRun[] = [];
  for (const run of runs) {
    const last = out[out.length - 1];
    if (run.kind === "text" && last && last.kind === "text") {
      last.value = collapseWhitespace(last.value + run.value);
      continue;
    }
    out.push(run);
  }
  // Trim leading/trailing whitespace-only text.
  if (out.length && out[0].kind === "text") {
    out[0] = { kind: "text", value: out[0].value.replace(/^\s+/, "") };
    if (out[0].kind === "text" && !out[0].value) out.shift();
  }
  if (out.length && out[out.length - 1].kind === "text") {
    const tail = out[out.length - 1] as { kind: "text"; value: string };
    tail.value = tail.value.replace(/\s+$/, "");
    if (!tail.value) out.pop();
  }
  return out;
}

function runsEmpty(runs: InlineRun[]): boolean {
  for (const r of runs) {
    if (r.kind === "text" && r.value.trim()) return false;
    if (r.kind === "code" || r.kind === "dead") return false;
    if (r.kind === "link" || r.kind === "em" || r.kind === "strong") {
      if (!runsEmpty(r.children)) return false;
    }
  }
  return true;
}

function buildInfobox(table: any): Block {
  let title: string | null = null;
  const items: InfoboxItem[] = [];

  const titleEl =
    table.querySelector && table.querySelector(".infobox-title, .infobox-above, caption");
  if (titleEl) {
    const t = elementText(titleEl);
    if (t) title = t;
  }

  const rows = table.querySelectorAll ? table.querySelectorAll("tr") : [];
  let firstContentRowSeen = false;

  for (const row of rows) {
    const cellEls = elementChildren(row).filter((c: any) => {
      const t = tagName(c);
      return t === "th" || t === "td";
    });
    if (cellEls.length === 0) continue;

    const allHeaders = cellEls.every((c: any) => tagName(c) === "th");
    const allData = cellEls.every((c: any) => tagName(c) === "td");

    // First solitary <th> row: treat as the infobox title if we don't have one.
    if (!firstContentRowSeen && allHeaders && cellEls.length === 1 && !title) {
      const text = elementText(cellEls[0]);
      firstContentRowSeen = true;
      if (text) {
        title = text;
        continue;
      }
    }
    firstContentRowSeen = true;

    // Subsequent solitary <th> row = section header inside the infobox.
    if (allHeaders && cellEls.length === 1) {
      const text = elementText(cellEls[0]);
      if (text) items.push({ kind: "section", title: text });
      continue;
    }

    // Classic label / value pair: <th>Label</th><td>Value</td>
    if (cellEls.length === 2 && tagName(cellEls[0]) === "th" && tagName(cellEls[1]) === "td") {
      const label = elementText(cellEls[0]).replace(/:\s*$/, "");
      const value = extractInline(cellEls[1]);
      if (label && !runsEmpty(value)) {
        items.push({ kind: "pair", label, value });
        continue;
      }
      if (!runsEmpty(value)) {
        items.push({ kind: "note", runs: value });
        continue;
      }
    }

    // Two data cells often act as label/value (e.g. "Kingdom:" | "Animalia").
    if (allData && cellEls.length === 2) {
      const label = elementText(cellEls[0]).replace(/:\s*$/, "");
      const value = extractInline(cellEls[1]);
      if (label && !runsEmpty(value)) {
        items.push({ kind: "pair", label, value });
        continue;
      }
    }

    // A single data cell containing an image becomes an image item.
    if (allData && cellEls.length === 1) {
      const cell = cellEls[0];
      const img = cell.querySelector && cell.querySelector("img");
      if (img) {
        const fig = buildFigure(cell);
        if (fig && fig.kind === "figure") {
          items.push({
            kind: "image",
            src: fig.src,
            srcset: fig.srcset,
            alt: fig.alt,
            width: fig.width,
            height: fig.height
          });
          continue;
        }
      }
    }

    // Data-only row(s) — fold cells into a single note.
    if (allData) {
      const merged: InlineRun[] = [];
      for (const cell of cellEls) {
        const part = extractInline(cell);
        if (part.length === 0) continue;
        if (merged.length) merged.push({ kind: "text", value: " · " });
        merged.push(...part);
      }
      if (!runsEmpty(merged)) items.push({ kind: "note", runs: merged });
      continue;
    }

    // Fallback: flatten everything as a note.
    const merged: InlineRun[] = [];
    for (const cell of cellEls) {
      const part = extractInline(cell);
      if (part.length === 0) continue;
      if (merged.length) merged.push({ kind: "text", value: " " });
      merged.push(...part);
    }
    if (!runsEmpty(merged)) items.push({ kind: "note", runs: merged });
  }

  return { kind: "infobox", title, items };
}

function buildTable(table: any): Block {
  const captionEl = table.querySelector && table.querySelector("caption");
  const caption = captionEl ? textContent(captionEl).trim() || null : null;

  const rows: InlineRun[][][] = [];
  let headers: InlineRun[][] | null = null;

  const theadRows =
    (table.querySelectorAll && table.querySelectorAll("thead tr")) || [];
  if (theadRows.length) {
    const first = theadRows[0];
    const cells: InlineRun[][] = [];
    for (const cell of elementChildren(first)) {
      cells.push(extractInline(cell));
    }
    if (cells.length) headers = cells;
  }

  const bodySelector = theadRows.length ? "tbody tr" : "tr";
  const bodyRows =
    (table.querySelectorAll && table.querySelectorAll(bodySelector)) || [];

  for (const row of bodyRows) {
    const cellEls = elementChildren(row);
    if (cellEls.length === 0) continue;
    const cells: InlineRun[][] = [];
    let isAllHeader = true;
    for (const cell of cellEls) {
      if (tagName(cell) !== "th") isAllHeader = false;
      cells.push(extractInline(cell));
    }
    if (!headers && isAllHeader) {
      headers = cells;
      continue;
    }
    rows.push(cells);
  }

  return { kind: "table", caption, headers, rows };
}

// Minimum intrinsic pixel size for an image to be considered content.
// Smaller images are usually decorative icons (flags, sound/video icons,
// disambig symbols) and just clutter the read view.
const FIGURE_MIN_DIMENSION = 60;

function isSafeImageUrl(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("data:")) return false;
  if (src.startsWith("//")) return true;
  return /^https?:\/\//i.test(src);
}

function absolutizeUrl(src: string): string {
  if (src.startsWith("//")) return "https:" + src;
  return src;
}

function absolutizeSrcset(raw: string): string | null {
  if (!raw) return null;
  const parts = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      // An srcset entry is "<url> <descriptor>"; only the URL needs fixing.
      const match = entry.match(/^(\S+)(\s+.*)?$/);
      if (!match) return null;
      const url = match[1];
      const rest = match[2] || "";
      if (!isSafeImageUrl(url)) return null;
      return absolutizeUrl(url) + rest;
    })
    .filter((v): v is string => v !== null);
  return parts.length ? parts.join(", ") : null;
}

function buildFigure(container: any): Block | null {
  const img = container.querySelector && container.querySelector("img");
  if (!img) return null;

  const rawSrc = img.getAttribute("src") || "";
  if (!isSafeImageUrl(rawSrc)) return null;
  const src = absolutizeUrl(rawSrc);

  const rawSrcset = img.getAttribute("srcset") || "";
  const srcset = absolutizeSrcset(rawSrcset);

  const widthAttr = parseInt(img.getAttribute("width") || "", 10);
  const heightAttr = parseInt(img.getAttribute("height") || "", 10);
  const width = Number.isFinite(widthAttr) && widthAttr > 0 ? widthAttr : null;
  const height = Number.isFinite(heightAttr) && heightAttr > 0 ? heightAttr : null;

  // Drop decorative icons — both intrinsic dimensions too small.
  if (
    width !== null &&
    height !== null &&
    width < FIGURE_MIN_DIMENSION &&
    height < FIGURE_MIN_DIMENSION
  ) {
    return null;
  }

  const alt = img.getAttribute("alt") || "";

  let caption: InlineRun[] | null = null;
  const captionEl =
    (container.querySelector && container.querySelector("figcaption")) ||
    (container.querySelector && container.querySelector(".thumbcaption")) ||
    (container.querySelector && container.querySelector(".gallerytext"));
  if (captionEl) {
    const runs = extractInline(captionEl);
    if (!runsEmpty(runs)) caption = runs;
  }

  return { kind: "figure", src, srcset, alt, width, height, caption };
}

function buildBlocks(root: any): Block[] {
  const blocks: Block[] = [];
  for (const child of elementChildren(root)) {
    const tag = tagName(child);

    if (tag === "p") {
      const runs = extractInline(child);
      if (!runsEmpty(runs)) blocks.push({ kind: "paragraph", runs });
      continue;
    }

    if (tag === "h2") {
      const text = elementText(child);
      if (text) blocks.push({ kind: "heading", level: 2, text });
      continue;
    }

    if (tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
      const text = elementText(child);
      if (text) blocks.push({ kind: "heading", level: 3, text });
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const ordered = tag === "ol";
      const items: InlineRun[][] = [];
      for (const li of elementChildren(child)) {
        if (tagName(li) !== "li") continue;
        const runs = extractInline(li);
        if (!runsEmpty(runs)) items.push(runs);
      }
      if (items.length) blocks.push({ kind: "list", ordered, items });
      continue;
    }

    if (tag === "blockquote") {
      const runs = extractInline(child);
      if (!runsEmpty(runs)) blocks.push({ kind: "quote", runs });
      continue;
    }

    if (tag === "hr") {
      blocks.push({ kind: "hr" });
      continue;
    }

    if (tag === "table") {
      if (classContains(child, "infobox")) {
        blocks.push(buildInfobox(child));
      } else {
        blocks.push(buildTable(child));
      }
      continue;
    }

    if (tag === "dl") {
      for (const dChild of elementChildren(child)) {
        const dTag = tagName(dChild);
        if (dTag === "dt") {
          const inner = extractInline(dChild);
          if (!runsEmpty(inner)) {
            blocks.push({
              kind: "paragraph",
              runs: [{ kind: "strong", children: inner }]
            });
          }
        } else if (dTag === "dd") {
          const inner = extractInline(dChild);
          if (!runsEmpty(inner)) blocks.push({ kind: "paragraph", runs: inner });
        }
      }
      continue;
    }

    if (tag === "figure") {
      const fig = buildFigure(child);
      if (fig) {
        blocks.push(fig);
      } else {
        blocks.push(...buildBlocks(child));
      }
      continue;
    }

    if (tag === "div" && classContains(child, "thumb")) {
      const fig = buildFigure(child);
      if (fig) {
        blocks.push(fig);
      } else {
        blocks.push(...buildBlocks(child));
      }
      continue;
    }

    if (tag === "div" || tag === "section" || tag === "details") {
      // Recurse into structural wrappers so headings/paragraphs inside
      // `.mw-parser-output > div > p` are still picked up.
      blocks.push(...buildBlocks(child));
      continue;
    }

    // Everything else is intentionally dropped.
  }

  return blocks;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function encodeTitle(title: string): string {
  return encodeURIComponent(title.replace(/ /g, "_"));
}

function renderRuns(runs: InlineRun[], out: string[], links: Set<string>): void {
  for (const run of runs) {
    switch (run.kind) {
      case "text":
        out.push(escapeHtml(run.value));
        break;
      case "code":
        out.push(`<code class="article-x-code">${escapeHtml(run.value)}</code>`);
        break;
      case "dead":
        out.push(`<span class="article-x-dead">${escapeHtml(run.value)}</span>`);
        break;
      case "em":
        out.push("<em>");
        renderRuns(run.children, out, links);
        out.push("</em>");
        break;
      case "strong":
        out.push("<strong>");
        renderRuns(run.children, out, links);
        out.push("</strong>");
        break;
      case "link": {
        links.add(run.target);
        out.push(
          `<a class="article-x-link" href="/wiki/${encodeTitle(run.target)}" data-wiki-target="${escapeHtml(run.target)}">`
        );
        if (run.children.length === 0) {
          out.push(escapeHtml(run.target));
        } else {
          renderRuns(run.children, out, links);
        }
        out.push("</a>");
        break;
      }
    }
  }
}

function renderBlock(block: Block, out: string[], links: Set<string>): void {
  switch (block.kind) {
    case "heading":
      out.push(
        `<h${block.level} class="article-x-heading article-x-heading--${block.level}">${escapeHtml(block.text)}</h${block.level}>`
      );
      break;
    case "paragraph":
      out.push(`<p class="article-x-p">`);
      renderRuns(block.runs, out, links);
      out.push(`</p>`);
      break;
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      out.push(`<${tag} class="article-x-list article-x-list--${tag}">`);
      for (const item of block.items) {
        out.push(`<li>`);
        renderRuns(item, out, links);
        out.push(`</li>`);
      }
      out.push(`</${tag}>`);
      break;
    }
    case "quote":
      out.push(`<blockquote class="article-x-quote">`);
      renderRuns(block.runs, out, links);
      out.push(`</blockquote>`);
      break;
    case "hr":
      out.push(`<hr class="article-x-hr" />`);
      break;
    case "infobox": {
      if (block.items.length === 0 && !block.title) break;
      out.push(`<aside class="article-x-infobox">`);
      if (block.title) {
        out.push(
          `<div class="article-x-infobox-title">${escapeHtml(block.title)}</div>`
        );
      }
      if (block.items.length) {
        out.push(`<div class="article-x-infobox-body">`);
        for (const item of block.items) {
          if (item.kind === "section") {
            out.push(
              `<div class="article-x-infobox-section">${escapeHtml(item.title)}</div>`
            );
          } else if (item.kind === "image") {
            out.push(
              `<img class="article-x-infobox-img" src="${escapeHtml(item.src)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"`
            );
            if (item.srcset) out.push(` srcset="${escapeHtml(item.srcset)}"`);
            if (item.alt) out.push(` alt="${escapeHtml(item.alt)}"`);
            if (item.width !== null) out.push(` width="${item.width}"`);
            if (item.height !== null) out.push(` height="${item.height}"`);
            out.push(` />`);
          } else if (item.kind === "pair") {
            out.push(`<div class="article-x-infobox-pair">`);
            out.push(
              `<span class="article-x-infobox-label">${escapeHtml(item.label)}</span>`
            );
            out.push(`<span class="article-x-infobox-value">`);
            renderRuns(item.value, out, links);
            out.push(`</span>`);
            out.push(`</div>`);
          } else {
            out.push(`<p class="article-x-infobox-note">`);
            renderRuns(item.runs, out, links);
            out.push(`</p>`);
          }
        }
        out.push(`</div>`);
      }
      out.push(`</aside>`);
      break;
    }
    case "figure": {
      out.push(`<figure class="article-x-figure">`);
      out.push(
        `<img class="article-x-img" src="${escapeHtml(block.src)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"`
      );
      if (block.srcset) out.push(` srcset="${escapeHtml(block.srcset)}"`);
      if (block.alt) out.push(` alt="${escapeHtml(block.alt)}"`);
      if (block.width !== null) out.push(` width="${block.width}"`);
      if (block.height !== null) out.push(` height="${block.height}"`);
      out.push(` />`);
      if (block.caption) {
        out.push(`<figcaption class="article-x-figcaption">`);
        renderRuns(block.caption, out, links);
        out.push(`</figcaption>`);
      }
      out.push(`</figure>`);
      break;
    }
    case "table": {
      if (block.rows.length === 0 && !block.headers && !block.caption) break;
      out.push(`<div class="article-x-table-wrap"><table class="article-x-table">`);
      if (block.caption) {
        out.push(
          `<caption class="article-x-table-caption">${escapeHtml(block.caption)}</caption>`
        );
      }
      if (block.headers) {
        out.push(`<thead><tr>`);
        for (const cell of block.headers) {
          out.push(`<th>`);
          renderRuns(cell, out, links);
          out.push(`</th>`);
        }
        out.push(`</tr></thead>`);
      }
      out.push(`<tbody>`);
      for (const row of block.rows) {
        out.push(`<tr>`);
        for (const cell of row) {
          out.push(`<td>`);
          renderRuns(cell, out, links);
          out.push(`</td>`);
        }
        out.push(`</tr>`);
      }
      out.push(`</tbody></table></div>`);
      break;
    }
  }
}

// Render a parsed & sanitized article Document into experimental HTML.
// The Document must already have `data-wiki-target` attributes on valid wiki
// links (wikipedia.ts's sanitizeAnchors does this).
export function renderExperimentalArticle(doc: any): {
  html: string;
  linkTargets: string[];
} {
  const root =
    (doc.querySelector && doc.querySelector(".mw-parser-output")) ||
    (doc.querySelector && doc.querySelector("body")) ||
    doc.documentElement ||
    doc;

  const blocks = buildBlocks(root);

  const out: string[] = [];
  const links = new Set<string>();
  out.push(`<div class="article-x">`);
  for (const block of blocks) renderBlock(block, out, links);
  out.push(`</div>`);

  return { html: out.join(""), linkTargets: [...links] };
}
