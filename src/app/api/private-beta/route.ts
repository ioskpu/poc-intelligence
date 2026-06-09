import { NextResponse } from "next/server";
import {
  PrivateBetaValidationError,
  submitPrivateBetaRequest,
} from "@/services/api/private-beta";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const record = await submitPrivateBetaRequest(body);

    return NextResponse.json({ request: record }, { status: 201 });
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
    { error: "Private beta request failed" },
    { status: 500 },
  );
}
