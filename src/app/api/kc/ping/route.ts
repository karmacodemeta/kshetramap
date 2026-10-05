import { NextResponse } from "next/server";
import { checkPingRateLimit, clientIpFromRequest } from "@/lib/kc-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ip = clientIpFromRequest(request);
  const limited = checkPingRateLimit(ip);

  if (!limited.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(limited.retryAfterSec),
        },
      }
    );
  }

  return NextResponse.json(
    { ok: true, t: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
