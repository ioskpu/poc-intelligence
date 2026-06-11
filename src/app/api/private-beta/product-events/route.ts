import { NextResponse } from "next/server";
import {
  getCurrentBetaSession,
  getCurrentBetaSessionToken,
} from "@/services/api/beta-auth";
import { recordProductAnalyticsEventInBackend } from "@/services/api/product-analytics-client";
import {
  isProductAnalyticsEventType,
  sanitizeProductAnalyticsMetadata,
} from "@/services/api/product-analytics";

export async function POST(request: Request) {
  const sessionToken = await getCurrentBetaSessionToken();

  if (!sessionToken) {
    return NextResponse.json({ error: "Private beta access is required" }, { status: 401 });
  }
  const session = await getCurrentBetaSession();

  if (!session || session.account.status !== "Active") {
    return NextResponse.json({ error: "Private beta access is required" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be an object" }, { status: 400 });
  }

  const eventType = (body as Record<string, unknown>).eventType;

  if (!isProductAnalyticsEventType(eventType)) {
    return NextResponse.json({ error: "Unsupported product analytics event" }, { status: 400 });
  }

  await recordProductAnalyticsEventInBackend(
    {
      eventType,
      accountId: session.account.id,
      email: session.account.email,
      role: session.account.role,
      status: session.account.status,
      timestamp: new Date().toISOString(),
      metadata: sanitizeProductAnalyticsMetadata((body as Record<string, unknown>).metadata),
    },
    sessionToken,
  );

  return new NextResponse(null, { status: 204 });
}
