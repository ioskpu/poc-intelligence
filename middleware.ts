import { NextResponse, type NextRequest } from "next/server";
import { BETA_SESSION_COOKIE_NAME } from "@/lib/beta-auth";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin/private-beta")) {
    const hasSession = Boolean(request.cookies.get(BETA_SESSION_COOKIE_NAME)?.value);

    if (!hasSession) {
      const loginUrl = new URL("/beta/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/private-beta/:path*"],
};
