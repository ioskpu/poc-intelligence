import type {
  PrivateBetaExperienceLevel,
  PrivateBetaStatus,
} from "@/lib/private-beta-content";
import {
  checkPrivateBetaBackendReachability,
  createPrivateBetaRequestInBackend,
  fetchPrivateBetaAdminSnapshotFromBackend,
  recordPrivateBetaEventInBackend,
  updatePrivateBetaRequestStatusInBackend,
} from "@/services/api/private-beta-backend";

export type PrivateBetaRequestInput = {
  name: string;
  email: string;
  experienceLevel: PrivateBetaExperienceLevel;
  interest?: string | null;
};

export type PrivateBetaRequestRecord = {
  id: string;
  name: string;
  email: string;
  experienceLevel: PrivateBetaExperienceLevel;
  interest: string | null;
  status: PrivateBetaStatus;
  createdAt: string;
  updatedAt: string;
};

export type PrivateBetaEventName =
  | "landing_visit"
  | "beta_request_submitted"
  | "beta_approved"
  | "beta_rejected";

export type PrivateBetaEventInput = {
  eventName: PrivateBetaEventName;
  requestId?: string | null;
  payload?: Record<string, unknown>;
};

export type PrivateBetaEventRecord = {
  id: string;
  eventName: PrivateBetaEventName;
  requestId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
};

export class PrivateBetaNotFoundError extends Error {
  constructor(message = "Private beta request not found") {
    super(message);
    this.name = "PrivateBetaNotFoundError";
  }
}

export async function listPrivateBetaRequests() {
  const snapshot = await fetchPrivateBetaAdminSnapshotFromBackend();
  return snapshot.requests;
}

export async function listPrivateBetaEvents() {
  const snapshot = await fetchPrivateBetaAdminSnapshotFromBackend();
  return snapshot.events;
}

export async function createPrivateBetaRequest(input: PrivateBetaRequestInput) {
  return createPrivateBetaRequestInBackend(input);
}

export async function updatePrivateBetaRequestStatus(
  requestId: string,
  status: PrivateBetaStatus,
) {
  const request = await updatePrivateBetaRequestStatusInBackend(
    requestId,
    status,
  );

  if (!request) {
    throw new PrivateBetaNotFoundError();
  }

  return request;
}

export async function recordPrivateBetaEvent(input: PrivateBetaEventInput) {
  await recordPrivateBetaEventInBackend(input);
}

export async function getPrivateBetaAdminSnapshot() {
  return fetchPrivateBetaAdminSnapshotFromBackend();
}

export async function getPrivateBetaHealth() {
  return checkPrivateBetaBackendReachability();
}
