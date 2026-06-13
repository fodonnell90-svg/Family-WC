import { NextResponse } from "next/server";
import { getLivePayload } from "@/lib/standings";

// Always compute fresh from current data.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wantLive = url.searchParams.get("live") !== "0";
  // ?fresh=1 bypasses the 30s feed cache (manual refresh button).
  const fresh = url.searchParams.get("fresh") === "1";
  const payload = await getLivePayload(wantLive, fresh);
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
