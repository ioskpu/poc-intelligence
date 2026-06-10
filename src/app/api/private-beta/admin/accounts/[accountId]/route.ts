import { NextResponse } from "next/server";
import {
  PrivateBetaValidationError,
  changePrivateBetaAccount,
} from "@/services/api/private-beta";
import { getCurrentBetaSessionToken } from "@/services/api/beta-auth";

type RouteParams = {
  params: Promise<{
    accountId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteParams) {
  try {
    const { accountId } = await context.params;
    const body = await request.json();
    const sessionToken = await getCurrentBetaSessionToken();
    const payload = await changePrivateBetaAccount(
      accountId,
      body.action,
      sessionToken,
    );

    return NextResponse.json(payload);
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  if (error instanceof PrivateBetaValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof Error) {
    const status = (error as Error & { status?: number }).status;
    if (status === 401 || status === 403 || status === 404) {
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { error: "Private beta account update failed" },
    { status: 500 },
  );
}
