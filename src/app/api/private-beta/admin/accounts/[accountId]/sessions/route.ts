import { NextResponse } from "next/server";
import { terminatePrivateBetaAccountSessions } from "@/services/api/private-beta";
import { getCurrentBetaSessionToken } from "@/services/api/beta-auth";

type RouteParams = {
  params: Promise<{
    accountId: string;
  }>;
};

export async function POST(_request: Request, context: RouteParams) {
  try {
    const { accountId } = await context.params;
    const sessionToken = await getCurrentBetaSessionToken();
    const payload = await terminatePrivateBetaAccountSessions(
      accountId,
      sessionToken,
    );

    return NextResponse.json(payload);
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  if (error instanceof Error) {
    const status = (error as Error & { status?: number }).status;
    if (status === 401 || status === 403 || status === 404) {
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { error: "Private beta account sessions update failed" },
    { status: 500 },
  );
}
