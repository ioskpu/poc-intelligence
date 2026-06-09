import { NextResponse } from "next/server";
import { getPrivateBetaHealth } from "@/services/api/private-beta";

export const runtime = "nodejs";

export async function GET() {
  const health = await getPrivateBetaHealth();

  return NextResponse.json(
    {
      database: health.reachable ? "reachable" : "unreachable",
      reachable: health.reachable,
      reason: health.reason,
    },
    { status: health.reachable ? 200 : 503 },
  );
}
