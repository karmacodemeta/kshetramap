import { NextResponse } from "next/server";
import {
  buildHealthPayload,
  isValidHealthSignature,
  KC_HEALTH_SIGNATURE_HEADER,
} from "@/lib/kc-health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const signature = request.headers.get(KC_HEALTH_SIGNATURE_HEADER);
  if (!isValidHealthSignature(signature)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const body = await buildHealthPayload();
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}
