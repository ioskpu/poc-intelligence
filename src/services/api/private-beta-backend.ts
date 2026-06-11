import type {
  PrivateBetaEventInput,
  PrivateBetaEventRecord,
  PrivateBetaRequestInput,
  PrivateBetaRequestRecord,
} from "@/services/api/private-beta-storage";
import type { PrivateBetaStatus } from "@/lib/private-beta-content";
import type { BetaSession } from "@/lib/beta-auth";

type PrivateBetaAdminSnapshotPayload = {
  requests: PrivateBetaRequestRecord[];
  events: PrivateBetaEventRecord[];
  accounts: PrivateBetaAccountRecord[];
  sessions: PrivateBetaSessionRecord[];
  auditEvents: PrivateBetaAuditEventRecord[];
  counts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  eventCounts: {
    landing_visit: number;
    beta_request_submitted: number;
    beta_approved: number;
    beta_rejected: number;
  };
};

export type PrivateBetaAccountRecord = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  status: "Active" | "Revoked";
  approvedAt: string | null;
  revokedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string | null;
  invitationSentAt: string | null;
  invitationOpenedAt: string | null;
  invitationUsedAt: string | null;
  firstLoginCompletedAt: string | null;
  invitationDelivery: "email" | "log_only" | null;
  invitationMessageId: string | null;
  invitationFallbackReason: string | null;
  invitationStatus: "Pending" | "Sent" | "Opened" | "Used" | "Expired";
};

export type PrivateBetaSessionRecord = {
  id: string;
  accountId: string;
  email: string;
  createdAt: string | null;
  lastSeenAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
};

export type PrivateBetaAuditEventRecord = {
  id: string;
  eventType: string;
  actorAccountId: string | null;
  actorEmail: string | null;
  targetAccountId: string | null;
  targetEmail: string | null;
  targetSessionId: string | null;
  payload: Record<string, unknown>;
  createdAt: string | null;
};

export type PrivateBetaAnalyticsOverview = {
  totalAccounts: number;
  activeAccounts: number;
  revokedAccounts: number;
  adminAccounts: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  invitationsSent: number;
  invitationsOpened: number;
  invitationsUsed: number;
  firstLogins: number;
  activeSessions: number;
  accountsCreatedLast7Days: number;
  accountsCreatedLast30Days: number;
  loginsLast24Hours: number;
  loginsLast7Days: number;
  loginsLast30Days: number;
};

export type PrivateBetaAnalyticsActivity = {
  timestamp: string | null;
  eventType: string;
  actorEmail: string | null;
  targetEmail: string | null;
  metadata: Record<string, unknown>;
};

export type PrivateBetaAnalyticsAdoption = {
  invitationOpenRate: number;
  invitationUseRate: number;
  activationRate: number;
  activeUserRate: number;
  adminRatio: number;
};

export type PrivateBetaAnalytics = {
  overview: PrivateBetaAnalyticsOverview;
  activity: PrivateBetaAnalyticsActivity[];
  adoption: PrivateBetaAnalyticsAdoption;
};

export type PrivateBetaAccountAction =
  | "revoke"
  | "reactivate"
  | "promote"
  | "demote";

type PrivateBetaRequestResponse = {
  request: PrivateBetaRequestRecord;
};

type PrivateBetaHealthResponse = {
  database: "reachable" | "unreachable";
  reachable: boolean;
  reason: string | null;
};

function getPrivateBetaApiBaseUrl() {
  const value = process.env.POC_INTELLIGENCE_API_URL?.trim();

  if (!value) {
    throw new Error("POC_INTELLIGENCE_API_URL is required");
  }

  return value.replace(/\/+$/, "");
}

async function fetchPrivateBetaApi(
  path: string,
  options?: {
    method?: string;
    body?: Record<string, unknown>;
    sessionToken?: string | null;
  },
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options?.sessionToken) {
    headers.Authorization = `Bearer ${options.sessionToken}`;
  }

  const response = await fetch(new URL(path, getPrivateBetaApiBaseUrl()), {
    method: options?.method ?? "GET",
    headers,
    body:
      options?.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw createPrivateBetaApiError(payload, response.status);
  }

  return payload;
}

export async function fetchPrivateBetaAdminSnapshotFromBackend() {
  return fetchPrivateBetaApi("/private-beta/requests") as Promise<PrivateBetaAdminSnapshotPayload>;
}

export async function fetchPrivateBetaAdminSnapshotFromBackendWithSession(
  sessionToken: string,
) {
  return fetchPrivateBetaApi("/private-beta/requests", {
    sessionToken,
  }) as Promise<PrivateBetaAdminSnapshotPayload>;
}

export async function fetchPrivateBetaAnalyticsFromBackendWithSession(
  sessionToken: string,
): Promise<PrivateBetaAnalytics> {
  const [overview, activity, adoption] = await Promise.all([
    fetchPrivateBetaApi("/private-beta/analytics/overview", {
      sessionToken,
    }) as Promise<PrivateBetaAnalyticsOverview>,
    fetchPrivateBetaApi("/private-beta/analytics/activity", {
      sessionToken,
    }) as Promise<PrivateBetaAnalyticsActivity[]>,
    fetchPrivateBetaApi("/private-beta/analytics/adoption", {
      sessionToken,
    }) as Promise<PrivateBetaAnalyticsAdoption>,
  ]);

  return { overview, activity, adoption };
}

export async function createPrivateBetaRequestInBackend(
  input: PrivateBetaRequestInput,
) {
  const payload = (await fetchPrivateBetaApi("/private-beta/request", {
    method: "POST",
    body: input,
  })) as PrivateBetaRequestResponse;

  return payload.request;
}

export async function updatePrivateBetaRequestStatusInBackend(
  requestId: string,
  status: PrivateBetaStatus,
  sessionToken?: string | null,
) {
  try {
    const payload = (await fetchPrivateBetaApi(`/private-beta/${requestId}`, {
      method: "PATCH",
      body: { status },
      sessionToken,
    })) as PrivateBetaRequestResponse;

    return payload.request;
  } catch (error) {
    if (
      error instanceof Error &&
      (error as Error & { status?: number }).status === 404
    ) {
      return null;
    }

    throw error;
  }
}

export async function updatePrivateBetaAccountInBackend(
  accountId: string,
  action: PrivateBetaAccountAction,
  sessionToken?: string | null,
) {
  return fetchPrivateBetaApi(`/private-beta/accounts/${accountId}`, {
    method: "PATCH",
    body: { action },
    sessionToken,
  }) as Promise<{ account: PrivateBetaAccountRecord }>;
}

export async function resendPrivateBetaInvitationInBackend(
  accountId: string,
  sessionToken?: string | null,
) {
  return fetchPrivateBetaApi(
    `/private-beta/accounts/${accountId}/invitation/resend`,
    {
      method: "POST",
      sessionToken,
    },
  ) as Promise<{
    account: PrivateBetaAccountRecord;
    invitation: {
      delivery: "email" | "log_only";
      invitationId: string;
      magicLink?: string;
    };
  }>;
}

export async function terminatePrivateBetaSessionInBackend(
  sessionId: string,
  sessionToken?: string | null,
) {
  return fetchPrivateBetaApi(`/private-beta/sessions/${sessionId}/terminate`, {
    method: "POST",
    sessionToken,
  }) as Promise<{ session: PrivateBetaSessionRecord }>;
}

export async function terminatePrivateBetaAccountSessionsInBackend(
  accountId: string,
  sessionToken?: string | null,
) {
  return fetchPrivateBetaApi(
    `/private-beta/accounts/${accountId}/sessions/terminate`,
    {
      method: "POST",
      sessionToken,
    },
  ) as Promise<{ terminatedCount: number }>;
}

export async function recordPrivateBetaEventInBackend(
  input: PrivateBetaEventInput,
) {
  await fetchPrivateBetaApi("/private-beta/events", {
    method: "POST",
    body: input,
  });
}

export async function requestPrivateBetaMagicLinkInBackend(
  email: string,
  redirectPath?: string | null,
) {
  return fetchPrivateBetaApi("/private-beta/auth/request-link", {
    method: "POST",
    body: {
      email,
      ...(redirectPath ? { redirectPath } : {}),
    },
  }) as Promise<{
    ok: boolean;
    delivery?: "email" | "log_only";
    magicLink?: string;
  }>;
}

export async function verifyPrivateBetaMagicTokenInBackend(token: string) {
  return fetchPrivateBetaApi("/private-beta/auth/verify", {
    method: "POST",
    body: { token },
  }) as Promise<
    BetaSession & {
      sessionToken: string;
      firstLogin?: boolean;
    }
  >;
}

export async function fetchPrivateBetaSessionFromBackend(sessionToken: string) {
  return fetchPrivateBetaApi("/private-beta/auth/session", {
    sessionToken,
  }) as Promise<BetaSession>;
}

export async function revokePrivateBetaSessionInBackend(sessionToken: string) {
  await fetchPrivateBetaApi("/private-beta/auth/logout", {
    method: "POST",
    sessionToken,
  });
}

export async function checkPrivateBetaBackendReachability() {
  try {
    const payload = (await fetchPrivateBetaApi("/private-beta/health")) as PrivateBetaHealthResponse;
    return {
      reachable: payload.reachable,
      reason: payload.reason,
    };
  } catch (error) {
    return {
      reachable: false,
      reason: error instanceof Error ? error.message : "Unknown backend error",
    };
  }
}

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function createPrivateBetaApiError(payload: unknown, status: number) {
  const detailMessage = readPrivateBetaErrorMessage(payload, status);

  const error = new Error(detailMessage);
  error.name = "PrivateBetaBackendError";
  (error as Error & { status?: number }).status = status;
  return error;
}

function readPrivateBetaErrorMessage(payload: unknown, status: number) {
  if (isRecord(payload) && typeof payload.detail === "string") {
    return payload.detail;
  }

  if (
    isRecord(payload) &&
    isRecord(payload.detail) &&
    typeof payload.detail.reason === "string"
  ) {
    return payload.detail.reason;
  }

  if (isRecord(payload) && typeof payload.error === "string") {
    return payload.error;
  }

  return `Private beta backend request failed with status ${status}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
