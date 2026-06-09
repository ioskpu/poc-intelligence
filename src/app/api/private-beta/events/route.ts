import { NextResponse } from "next/server";
import {
  PrivateBetaValidationError,
  trackPrivateBetaLandingVisit,
} from "@/services/api/private-beta";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await trackPrivateBetaLandingVisit(body);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

function toErrorResponse(error: unknown) {
  if (error instanceof PrivateBetaValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { error: "Private beta event capture failed" },
    { status: 500 },
  );
}
