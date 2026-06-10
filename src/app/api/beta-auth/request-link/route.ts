import { NextResponse } from "next/server";
import { requestBetaMagicLink, BetaAccessDeniedError } from "@/services/api/beta-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";
    const redirectPath = typeof body.redirectPath === "string" ? body.redirectPath : null;
    const result = await requestBetaMagicLink(email, redirectPath);

    return NextResponse.json({
      ok: true,
      delivery: result.delivery,
      ...(result.magicLink ? { magicLink: result.magicLink } : {}),
    });
  } catch (error) {
    if (error instanceof BetaAccessDeniedError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Magic link request failed" },
      { status: 500 },
    );
  }
}
