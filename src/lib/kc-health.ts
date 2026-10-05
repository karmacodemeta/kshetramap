import { timingSafeEqual } from "crypto";
import { MongoClient } from "mongodb";
import { getRuntimeInfo } from "@/lib/kc-version";

export const KC_HEALTH_SIGNATURE_HEADER = "x-kc-admin-signature";

export function isValidHealthSignature(
  header: string | null | undefined,
  secret = process.env.KC_HEALTH_SECRET
): boolean {
  if (!secret || !header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function checkMongodb(): Promise<{ ok: boolean; detail?: string }> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    return { ok: false, detail: "unconfigured" };
  }

  // One-shot ping. Do not import @/lib/db/mongo — that module defaults a
  // localhost URI and caches a client. Never log the URI or driver errors
  // (they can embed credentials).
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
  try {
    await client.connect();
    await client.db().admin().command({ ping: 1 });
    return { ok: true };
  } catch {
    return { ok: false, detail: "unreachable" };
  } finally {
    try {
      await client.close();
    } catch {
      // ignore close errors
    }
  }
}

function checkBackup(): { ok: boolean; detail: "unknown"; age: "unknown" } {
  // Rule 9 (backups) is deferred. Age stays unknown.
  return { ok: false, detail: "unknown", age: "unknown" };
}

export type HealthStatus = "ok" | "degraded" | "down";

export async function buildHealthPayload(): Promise<{
  status: HealthStatus;
  version: string;
  commit: string;
  deployedAt: string;
  uptimeSec: number;
  checks: {
    mongodb: { ok: boolean; detail?: string };
    backup: { ok: boolean; detail: "unknown"; age: "unknown" };
  };
}> {
  const mongodb = await checkMongodb();
  const backup = checkBackup();
  const runtime = getRuntimeInfo();

  const status: HealthStatus = mongodb.ok ? "ok" : "down";

  return {
    status,
    version: runtime.version,
    commit: runtime.commit,
    deployedAt: runtime.deployedAt,
    uptimeSec: runtime.uptimeSec,
    checks: { mongodb, backup },
  };
}
