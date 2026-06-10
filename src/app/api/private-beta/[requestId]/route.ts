import { NextResponse } from "next/server";
import {
  PrivateBetaNotFoundError,
  PrivateBetaValidationError,
  changePrivateBetaRequestStatus,
} from "@/services/api/private-beta";
import { getCurrentBetaSessionToken } from "@/services/api/beta-auth";

type RouteParams = {
  params: Promise<{
    requestId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteParams) {
  try {
    const { requestId } = await context.params;
    const body = await request.json();
    const sessionToken = await getCurrentBetaSessionToken();
    const record = await changePrivateBetaRequestStatus(
      requestId,
      body.status,
      sessionToken,
    );

    return NextResponse.json({ request: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  if (error instanceof PrivateBetaValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof PrivateBetaNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { error: "Private beta request update failed" },
    { status: 500 },
  );
}
