import { NextResponse } from "next/server";
import { BETA_SESSION_COOKIE_NAME } from "@/lib/beta-auth";
import { logoutCurrentBetaSession } from "@/services/api/beta-auth";

export async function POST() {
  await logoutCurrentBetaSession();
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}

export async function GET(request: Request) {
  await logoutCurrentBetaSession();
  const response = NextResponse.redirect(new URL("/", request.url));
  clearSessionCookie(response);
  return response;
}

function clearSessionCookie(response: NextResponse) {
  response.cookies.set(BETA_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
