const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  secret: string | undefined,
  token: string | undefined,
  remoteIp: string
): Promise<{ ok: boolean; skipped: boolean; reason?: string }> {
  if (!secret) {
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, skipped: false, reason: "missing-token" };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp && remoteIp !== "unknown") {
    body.set("remoteip", remoteIp);
  }

  const response = await fetch(SITEVERIFY_URL, {
    method: "POST",
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });

  if (!response.ok) {
    return { ok: false, skipped: false, reason: `siteverify-${response.status}` };
  }

  const payload = (await response.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };

  if (!payload.success) {
    return {
      ok: false,
      skipped: false,
      reason: payload["error-codes"]?.join(",") || "rejected"
    };
  }

  return { ok: true, skipped: false };
}
