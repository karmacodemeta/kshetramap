import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/kc/health/route";

const TEST_SECRET = "test-kc-health-secret-do-not-leak";

function healthRequest(signature?: string): Request {
  const headers = new Headers();
  if (signature !== undefined) {
    headers.set("x-kc-admin-signature", signature);
  }
  return new Request("http://localhost:3001/api/kc/health", { headers });
}

describe("GET /api/kc/health", () => {
  const previousSecret = process.env.KC_HEALTH_SECRET;
  const previousCommit = process.env.GIT_COMMIT;
  const previousVercelSha = process.env.VERCEL_GIT_COMMIT_SHA;
  const previousMongoUri = process.env.MONGODB_URI;

  beforeEach(() => {
    process.env.KC_HEALTH_SECRET = TEST_SECRET;
    process.env.GIT_COMMIT = "deadbeefcafebabe";
    delete process.env.VERCEL_GIT_COMMIT_SHA;
    // Keep the cheap Mongo check off the live URI so tests stay fast and
    // never log credentials from the host environment.
    delete process.env.MONGODB_URI;
  });

  afterEach(() => {
    if (previousSecret === undefined) {
      delete process.env.KC_HEALTH_SECRET;
    } else {
      process.env.KC_HEALTH_SECRET = previousSecret;
    }
    if (previousCommit === undefined) {
      delete process.env.GIT_COMMIT;
    } else {
      process.env.GIT_COMMIT = previousCommit;
    }
    if (previousVercelSha === undefined) {
      delete process.env.VERCEL_GIT_COMMIT_SHA;
    } else {
      process.env.VERCEL_GIT_COMMIT_SHA = previousVercelSha;
    }
    if (previousMongoUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = previousMongoUri;
    }
  });

  it("returns 401 without signature", async () => {
    const res = await GET(healthRequest());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("returns 401 with an invalid signature", async () => {
    const res = await GET(healthRequest("wrong-signature"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toEqual({ error: "Unauthorized" });
  });

  it("returns 200 with a valid signature, contract fields, and no secrets in body", async () => {
    const res = await GET(healthRequest(TEST_SECRET));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(["ok", "degraded", "down"]).toContain(body.status);
    expect(typeof body.version).toBe("string");
    expect(body.version.length).toBeGreaterThan(0);
    expect(body.commit).toBe("deadbeefcafebabe");
    expect(typeof body.deployedAt).toBe("string");
    expect(Number.isNaN(Date.parse(body.deployedAt))).toBe(false);
    expect(typeof body.uptimeSec).toBe("number");
    expect(body.uptimeSec).toBeGreaterThanOrEqual(0);

    expect(body.checks).toBeTypeOf("object");
    expect(body.checks.mongodb).toMatchObject({ ok: expect.any(Boolean) });
    expect(body.checks.backup).toMatchObject({
      age: "unknown",
    });

    const dumped = JSON.stringify(body);
    expect(dumped).not.toContain(TEST_SECRET);
    expect(dumped).not.toMatch(/MONGODB_URI|mongodb\+srv|KC_HEALTH_SECRET/i);
    expect(dumped).not.toMatch(/"password"|"refresh_token"|"access_token"/i);
  });
});
