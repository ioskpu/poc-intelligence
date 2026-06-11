import { NextResponse } from "next/server";
import {
  getCurrentBetaSession,
  getCurrentBetaSessionToken,
} from "@/services/api/beta-auth";
import { recordPrivateBetaFeedbackInBackend } from "@/services/api/private-beta-feedback-backend";
import {
  isPrivateBetaFeedbackType,
  sanitizePrivateBetaFeedbackMetadata,
} from "@/services/api/private-beta-feedback";

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

  const feedbackType = (body as Record<string, unknown>).feedbackType;
  const feedbackValue = (body as Record<string, unknown>).feedbackValue;

  if (!isPrivateBetaFeedbackType(feedbackType)) {
    return NextResponse.json({ error: "Unsupported feedback type" }, { status: 400 });
  }

  if (typeof feedbackValue !== "string" || !feedbackValue.trim()) {
    return NextResponse.json({ error: "Feedback value is required" }, { status: 400 });
  }

  await recordPrivateBetaFeedbackInBackend(
    {
      feedbackType,
      feedbackValue: feedbackValue.trim().slice(0, 500),
      metadata: sanitizePrivateBetaFeedbackMetadata((body as Record<string, unknown>).metadata),
    },
    sessionToken,
  );

  return new NextResponse(null, { status: 204 });
}
