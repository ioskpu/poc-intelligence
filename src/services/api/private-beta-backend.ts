import type {
  PrivateBetaEventInput,
  PrivateBetaEventRecord,
  PrivateBetaRequestInput,
  PrivateBetaRequestRecord,
} from "@/services/api/private-beta-storage";
import type { PrivateBetaStatus } from "@/lib/private-beta-content";

type PrivateBetaAdminSnapshotPayload = {
  requests: PrivateBetaRequestRecord[];
  events: PrivateBetaEventRecord[];
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
  },
) {
  const response = await fetch(new URL(path, getPrivateBetaApiBaseUrl()), {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
) {
  try {
    const payload = (await fetchPrivateBetaApi(`/private-beta/${requestId}`, {
      method: "PATCH",
      body: { status },
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

export async function recordPrivateBetaEventInBackend(
  input: PrivateBetaEventInput,
) {
  await fetchPrivateBetaApi("/private-beta/events", {
    method: "POST",
    body: input,
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
