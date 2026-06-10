import { cookies } from "next/headers";
import {
  BETA_SESSION_COOKIE_NAME,
  type BetaSession,
} from "@/lib/beta-auth";
import {
  fetchPrivateBetaSessionFromBackend,
  requestPrivateBetaMagicLinkInBackend,
  revokePrivateBetaSessionInBackend,
  verifyPrivateBetaMagicTokenInBackend,
} from "@/services/api/private-beta-backend";

export class BetaAccessDeniedError extends Error {
  constructor(message = "Private beta access is required") {
    super(message);
    this.name = "BetaAccessDeniedError";
  }
}

export async function requestBetaMagicLink(email: string, redirectPath?: string | null) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new BetaAccessDeniedError("A valid email is required");
  }

  return requestPrivateBetaMagicLinkInBackend(normalizedEmail, redirectPath);
}

export async function verifyBetaMagicToken(token: string) {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    throw new BetaAccessDeniedError("Magic link token is required");
  }

  return verifyPrivateBetaMagicTokenInBackend(normalizedToken);
}

export async function getCurrentBetaSession(): Promise<BetaSession | null> {
  const token = await getCurrentBetaSessionToken();

  if (!token) {
    return null;
  }

  try {
    return await fetchPrivateBetaSessionFromBackend(token);
  } catch {
    return null;
  }
}

export async function requireCurrentBetaSession() {
  const session = await getCurrentBetaSession();

  if (!session || session.account.status !== "Active") {
    throw new BetaAccessDeniedError();
  }

  return session;
}

export async function requireCurrentAdminSession() {
  const session = await requireCurrentBetaSession();

  if (session.account.role !== "admin") {
    throw new BetaAccessDeniedError("Admin access is required");
  }

  return session;
}

export async function getCurrentBetaSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(BETA_SESSION_COOKIE_NAME)?.value ?? null;
}

export async function logoutCurrentBetaSession() {
  const token = await getCurrentBetaSessionToken();

  if (token) {
    await revokePrivateBetaSessionInBackend(token);
  }
}
