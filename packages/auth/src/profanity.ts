const BLOCKLIST = [
  "admin",
  "ass",
  "bitch",
  "cock",
  "cunt",
  "damn",
  "dick",
  "fag",
  "fuck",
  "god",
  "hitler",
  "nazi",
  "penis",
  "piss",
  "porn",
  "pussy",
  "rape",
  "sex",
  "shit",
  "slut",
  "whore"
];

export function isAllowedUsername(username: string): boolean {
  const normalized = username.toLowerCase();
  return !BLOCKLIST.some((term) => normalized.includes(term));
}
