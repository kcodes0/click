const NOON_UTC_MS = 12 * 60 * 60 * 1000;

export function nowMs(): number {
  return Date.now();
}

// A new daily maze "drops" at noon UTC — same convention click uses so
// the two games feel in sync. The returned date key is the YYYY-MM-DD
// string we seed the generator with.
export function getDailyDateKey(timestamp = nowMs()): string {
  return new Date(timestamp - NOON_UTC_MS).toISOString().slice(0, 10);
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds
    .toString()
    .padStart(2, "0")}`;
}

export function formatDateKey(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00.000Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
}
