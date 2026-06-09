import {
  getPrivateBetaCopy,
  type PrivateBetaExperienceLevel,
  type PrivateBetaStatus,
} from "@/lib/private-beta-content";
import {
  createPrivateBetaRequest as createStoredPrivateBetaRequest,
  getPrivateBetaAdminSnapshot as getStoredPrivateBetaAdminSnapshot,
  PrivateBetaNotFoundError,
  recordPrivateBetaEvent as recordStoredPrivateBetaEvent,
  updatePrivateBetaRequestStatus as updateStoredPrivateBetaRequestStatus,
  type PrivateBetaRequestInput,
  type PrivateBetaRequestRecord,
} from "@/services/api/private-beta-storage";

export type PrivateBetaSubmissionInput = {
  name: string;
  email: string;
  experienceLevel: PrivateBetaExperienceLevel;
  interest?: string | null;
};

export type PrivateBetaAdminSnapshot = Awaited<
  ReturnType<typeof getStoredPrivateBetaAdminSnapshot>
>;

export class PrivateBetaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrivateBetaValidationError";
  }
}

export { PrivateBetaNotFoundError };

export async function submitPrivateBetaRequest(
  input: unknown,
): Promise<PrivateBetaRequestRecord> {
  const request = parseSubmissionInput(input);
  return createStoredPrivateBetaRequest(request);
}

export async function changePrivateBetaRequestStatus(
  requestId: string,
  status: unknown,
) {
  const nextStatus = parseStatus(status);
  return updateStoredPrivateBetaRequestStatus(requestId, nextStatus);
}

export async function trackPrivateBetaLandingVisit(input: unknown) {
  const payload = parseVisitPayload(input);

  await recordStoredPrivateBetaEvent({
    eventName: "landing_visit",
    payload,
  });
}

export async function getPrivateBetaAdminData(): Promise<PrivateBetaAdminSnapshot> {
  return getStoredPrivateBetaAdminSnapshot();
}

export function getPrivateBetaRequestCopy(locale: "es" | "en") {
  return getPrivateBetaCopy(locale);
}

function parseSubmissionInput(input: unknown): PrivateBetaRequestInput {
  if (!isObject(input)) {
    throw new PrivateBetaValidationError("Request body must be an object");
  }

  const name = readText(input.name);
  const email = readText(input.email);
  const experienceLevel = readExperienceLevel(input.experienceLevel);
  const interest = readOptionalText(input.interest);

  if (!name) {
    throw new PrivateBetaValidationError("Name is required");
  }

  if (!email || !isValidEmail(email)) {
    throw new PrivateBetaValidationError("A valid email is required");
  }

  return {
    name,
    email,
    experienceLevel,
    interest,
  };
}

function parseStatus(value: unknown): PrivateBetaStatus {
  const text = readText(value);

  if (text === "Pending" || text === "Approved" || text === "Rejected") {
    return text;
  }

  throw new PrivateBetaValidationError("Status must be Pending, Approved, or Rejected");
}

function parseVisitPayload(input: unknown) {
  if (!isObject(input)) {
    return {};
  }

  const locale = readOptionalText(input.locale);
  const pathname = readOptionalText(input.pathname);

  return {
    ...(locale ? { locale } : {}),
    ...(pathname ? { pathname } : {}),
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalText(value: unknown) {
  const text = readText(value);
  return text || null;
}

function readExperienceLevel(value: unknown): PrivateBetaExperienceLevel {
  const text = readText(value);

  if (
    text === "Exploring" ||
    text === "Intermediate" ||
    text === "Advanced" ||
    text === "Professional"
  ) {
    return text;
  }

  throw new PrivateBetaValidationError("Experience level is required");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
