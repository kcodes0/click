// Weave dictionary.
//
// The raw word list is bundled by wrangler's Data rules as a plain string
// (one uppercase word per line). We parse it into a Set<string> exactly
// once per isolate via module-level memoisation — subsequent requests in
// the same warm isolate reuse the same Set. All entries are 4-15 letters,
// all uppercase, proper nouns stripped.

import RAW_DICTIONARY from "../static/dictionary.txt";

let cached: Set<string> | null = null;

function loadDictionary(): Set<string> {
  if (cached) return cached;
  // Wrangler bundles .txt files as an ArrayBuffer (see globals.d.ts),
  // so decode to text once per cold start and never again — the result
  // is cached in a module-level Set that persists across requests in
  // the same warm isolate.
  const text = new TextDecoder().decode(RAW_DICTIONARY);
  const words = new Set<string>();
  for (const line of text.split(/\s+/)) {
    if (line.length >= 4) {
      words.add(line);
    }
  }
  cached = words;
  return words;
}

export function isValidWord(word: string): boolean {
  const upper = word.toUpperCase();
  return loadDictionary().has(upper);
}

export function dictionarySize(): number {
  return loadDictionary().size;
}
