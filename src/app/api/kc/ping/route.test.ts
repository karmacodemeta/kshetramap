import { beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/kc/ping/route";
import { PING_RATE_LIMIT_MAX, resetPingRateLimiter } from "@/lib/kc-rate-limit";

function pingRequest(ip = "203.0.113.10"): Request {
  return new Request("http://localhost:3001/api/kc/ping", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("GET /api/kc/ping", () => {
  beforeEach(() => {
    resetPingRateLimiter();
  });

  it("returns 200 with ok true and ISO server time only", async () => {
    const res = await GET(pingRequest());
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(typeof body.t).toBe("string");
    expect(Number.isNaN(Date.parse(body.t))).toBe(false);
    expect(Object.keys(body).sort()).toEqual(["ok", "t"]);
  });

  it("trips rate limit after the IP window max", async () => {
    const ip = "203.0.113.99";
    for (let i = 0; i < PING_RATE_LIMIT_MAX; i++) {
      const res = await GET(pingRequest(ip));
      expect(res.status).toBe(200);
    }

    const limited = await GET(pingRequest(ip));
    expect(limited.status).toBe(429);
    const body = await limited.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("rate_limited");
  });
});
