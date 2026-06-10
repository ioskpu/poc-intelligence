import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  BETA_ONBOARDING_COOKIE_NAME,
  BETA_SESSION_COOKIE_NAME,
  BETA_SESSION_MAX_AGE_SECONDS,
} from "@/lib/beta-auth";
import { verifyBetaMagicToken } from "@/services/api/beta-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const next = readSafeNextPath(url.searchParams.get("next"));

  try {
    const session = await verifyBetaMagicToken(token);
    const cookieStore = await cookies();
    cookieStore.set(BETA_SESSION_COOKIE_NAME, session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: BETA_SESSION_MAX_AGE_SECONDS,
      expires: new Date(session.expiresAt),
    });

    if (session.firstLogin) {
      cookieStore.set(BETA_ONBOARDING_COOKIE_NAME, "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/dashboard",
        maxAge: 60 * 60 * 24,
      });
    }

    return NextResponse.redirect(new URL(next, request.url));
  } catch {
    return NextResponse.redirect(new URL("/beta/login?error=invalid-link", request.url));
  }
}

function readSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}
