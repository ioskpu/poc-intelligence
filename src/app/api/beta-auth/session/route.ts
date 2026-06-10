import { NextResponse } from "next/server";
import { getCurrentBetaSession } from "@/services/api/beta-auth";

export async function GET() {
  const session = await getCurrentBetaSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    session,
  });
}
