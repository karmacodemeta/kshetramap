/** In-memory IP window for public GET /api/kc/ping. Fine for a single local process. */

export const PING_RATE_LIMIT_WINDOW_MS = 60_000;
export const PING_RATE_LIMIT_MAX = 20;

const hits = new Map<string, number[]>();

export function resetPingRateLimiter(): void {
  hits.clear();
}

export function clientIpFromRequest(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "127.0.0.1";
}

export function checkPingRateLimit(
  ip: string,
  now = Date.now()
): { allowed: true } | { allowed: false; retryAfterSec: number } {
  const key = (ip || "127.0.0.1").trim() || "127.0.0.1";
  const windowStart = now - PING_RATE_LIMIT_WINDOW_MS;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= PING_RATE_LIMIT_MAX) {
    const oldest = timestamps[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + PING_RATE_LIMIT_WINDOW_MS - now) / 1000)
    );
    hits.set(key, timestamps);
    return { allowed: false, retryAfterSec };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true };
}
