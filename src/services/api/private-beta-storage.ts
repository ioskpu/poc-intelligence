import type {
  PrivateBetaExperienceLevel,
  PrivateBetaStatus,
} from "@/lib/private-beta-content";
import {
  checkPrivateBetaDatabaseReachability,
  createPrivateBetaRequestInDatabase,
  listPrivateBetaEventsFromDatabase,
  listPrivateBetaRequestsFromDatabase,
  recordPrivateBetaEventInDatabase,
  updatePrivateBetaRequestStatusInDatabase,
} from "@/services/api/private-beta-storage-postgres";

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
  return listPrivateBetaRequestsFromDatabase();
}

export async function listPrivateBetaEvents() {
  return listPrivateBetaEventsFromDatabase();
}

export async function createPrivateBetaRequest(input: PrivateBetaRequestInput) {
  return createPrivateBetaRequestInDatabase(input);
}

export async function updatePrivateBetaRequestStatus(
  requestId: string,
  status: PrivateBetaStatus,
) {
  const request = await updatePrivateBetaRequestStatusInDatabase(
    requestId,
    status,
  );

  if (!request) {
    throw new PrivateBetaNotFoundError();
  }

  return request;
}

export async function recordPrivateBetaEvent(input: PrivateBetaEventInput) {
  await recordPrivateBetaEventInDatabase(input);
}

export async function getPrivateBetaAdminSnapshot() {
  const [requests, events] = await Promise.all([
    listPrivateBetaRequests(),
    listPrivateBetaEvents(),
  ]);

  const counts = requests.reduce(
    (accumulator, request) => {
      accumulator.total += 1;
      accumulator[request.status.toLowerCase() as "pending" | "approved" | "rejected"] +=
        1;
      return accumulator;
    },
    {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    },
  );

  const eventCounts = events.reduce(
    (accumulator, event) => {
      accumulator[event.eventName] += 1;
      return accumulator;
    },
    {
      landing_visit: 0,
      beta_request_submitted: 0,
      beta_approved: 0,
      beta_rejected: 0,
    },
  );

  return {
    events,
    eventCounts,
    requests,
    counts,
  };
}

export async function getPrivateBetaHealth() {
  return checkPrivateBetaDatabaseReachability();
}
