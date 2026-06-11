import {
  getPrivateBetaCopy,
  type PrivateBetaExperienceLevel,
  type PrivateBetaStatus,
} from "@/lib/private-beta-content";
import {
  createPrivateBetaRequest as createStoredPrivateBetaRequest,
  getPrivateBetaHealth as getStoredPrivateBetaHealth,
  getPrivateBetaAdminSnapshot as getStoredPrivateBetaAdminSnapshot,
  getPrivateBetaAdminSnapshotWithSession as getStoredPrivateBetaAdminSnapshotWithSession,
  getPrivateBetaAnalyticsWithSession as getStoredPrivateBetaAnalyticsWithSession,
  PrivateBetaNotFoundError,
  recordPrivateBetaEvent as recordStoredPrivateBetaEvent,
  resendPrivateBetaInvitation as resendStoredPrivateBetaInvitation,
  terminatePrivateBetaAccountSessions as terminateStoredPrivateBetaAccountSessions,
  terminatePrivateBetaSession as terminateStoredPrivateBetaSession,
  updatePrivateBetaAccount as updateStoredPrivateBetaAccount,
  updatePrivateBetaRequestStatus as updateStoredPrivateBetaRequestStatus,
  type PrivateBetaRequestInput,
  type PrivateBetaRequestRecord,
} from "@/services/api/private-beta-storage";
import type { PrivateBetaAccountAction } from "@/services/api/private-beta-backend";
import {
  fetchProductAnalyticsSummaryFromBackend,
} from "@/services/api/product-analytics-client";
import type { ProductAnalyticsSummary } from "@/services/api/product-analytics";

export type PrivateBetaSubmissionInput = {
  name: string;
  email: string;
  experienceLevel: PrivateBetaExperienceLevel;
  interest?: string | null;
};

export type PrivateBetaAdminSnapshot = Awaited<
  ReturnType<typeof getStoredPrivateBetaAdminSnapshot>
>;

export type PrivateBetaAnalytics = Awaited<
  ReturnType<typeof getStoredPrivateBetaAnalyticsWithSession>
>;

export type PrivateBetaProductAnalytics = ProductAnalyticsSummary;

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
  sessionToken?: string | null,
) {
  const nextStatus = parseStatus(status);
  return updateStoredPrivateBetaRequestStatus(requestId, nextStatus, sessionToken);
}

export async function changePrivateBetaAccount(
  accountId: string,
  action: unknown,
  sessionToken?: string | null,
) {
  const nextAction = parseAccountAction(action);
  return updateStoredPrivateBetaAccount(accountId, nextAction, sessionToken);
}

export async function resendPrivateBetaInvitation(
  accountId: string,
  sessionToken?: string | null,
) {
  return resendStoredPrivateBetaInvitation(accountId, sessionToken);
}

export async function terminatePrivateBetaSession(
  sessionId: string,
  sessionToken?: string | null,
) {
  return terminateStoredPrivateBetaSession(sessionId, sessionToken);
}

export async function terminatePrivateBetaAccountSessions(
  accountId: string,
  sessionToken?: string | null,
) {
  return terminateStoredPrivateBetaAccountSessions(accountId, sessionToken);
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

export async function getPrivateBetaAdminDataWithSession(
  sessionToken: string,
): Promise<PrivateBetaAdminSnapshot> {
  return getStoredPrivateBetaAdminSnapshotWithSession(sessionToken);
}

export async function getPrivateBetaAnalyticsWithSession(
  sessionToken: string,
): Promise<PrivateBetaAnalytics> {
  return getStoredPrivateBetaAnalyticsWithSession(sessionToken);
}

export async function getPrivateBetaProductAnalyticsWithSession(
  sessionToken: string,
): Promise<PrivateBetaProductAnalytics | null> {
  try {
    return await fetchProductAnalyticsSummaryFromBackend(sessionToken);
  } catch {
    return null;
  }
}

export async function getPrivateBetaHealth() {
  return getStoredPrivateBetaHealth();
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

function parseAccountAction(value: unknown): PrivateBetaAccountAction {
  const text = readText(value);

  if (
    text === "revoke" ||
    text === "reactivate" ||
    text === "promote" ||
    text === "demote"
  ) {
    return text;
  }

  throw new PrivateBetaValidationError("Unsupported account action");
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
