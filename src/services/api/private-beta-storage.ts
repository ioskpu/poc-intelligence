import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import type {
  PrivateBetaExperienceLevel,
  PrivateBetaStatus,
} from "@/lib/private-beta-content";
import {
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
  reviewedAt: string | null;
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

type PrivateBetaState = {
  requests: PrivateBetaRequestRecord[];
  events: PrivateBetaEventRecord[];
};

const runtimeStorePath = join(
  process.cwd(),
  ".runtime",
  "private-beta-store.json",
);

let runtimeState: PrivateBetaState | null = null;

const emptyState: PrivateBetaState = {
  requests: [],
  events: [],
};

export class PrivateBetaNotFoundError extends Error {
  constructor(message = "Private beta request not found") {
    super(message);
    this.name = "PrivateBetaNotFoundError";
  }
}

function getConnectionString() {
  return process.env.POC_INTELLIGENCE_DATABASE_URL?.trim() || null;
}

function hasDatabase() {
  return Boolean(getConnectionString());
}

export async function listPrivateBetaRequests() {
  if (!hasDatabase()) {
    const state = await readRuntimeState();

    return [...state.requests].sort(
      (left, right) =>
        Date.parse(right.createdAt) - Date.parse(left.createdAt),
    );
  }

  return listPrivateBetaRequestsFromDatabase();
}

export async function listPrivateBetaEvents() {
  if (!hasDatabase()) {
    const state = await readRuntimeState();

    return [...state.events].sort(
      (left, right) =>
        Date.parse(right.createdAt) - Date.parse(left.createdAt),
    );
  }

  return listPrivateBetaEventsFromDatabase();
}

export async function createPrivateBetaRequest(input: PrivateBetaRequestInput) {
  if (!hasDatabase()) {
    const request = createRequestRecord(input);
    const state = await readRuntimeState();
    upsertRuntimeRequest(state, request);
    addRuntimeEvent(state, {
      eventName: "beta_request_submitted",
      requestId: request.id,
      payload: {
        email: request.email,
        experienceLevel: request.experienceLevel,
      },
    });
    await writeRuntimeState(state);

    return request;
  }

  return createPrivateBetaRequestInDatabase(input);
}

export async function updatePrivateBetaRequestStatus(
  requestId: string,
  status: PrivateBetaStatus,
) {
  if (!hasDatabase()) {
    const state = await readRuntimeState();
    const request = state.requests.find((item) => item.id === requestId);

    if (!request) {
      throw new PrivateBetaNotFoundError();
    }

    request.status = status;
    request.updatedAt = new Date().toISOString();
    request.reviewedAt = status === "Pending" ? null : new Date().toISOString();

    addRuntimeEvent(state, {
      eventName:
        status === "Approved"
          ? "beta_approved"
          : status === "Rejected"
            ? "beta_rejected"
            : "landing_visit",
      requestId: request.id,
      payload: {
        email: request.email,
        status,
      },
    });
    await writeRuntimeState(state);

    return { ...request };
  }

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
  if (!hasDatabase()) {
    const state = await readRuntimeState();

    addRuntimeEvent(state, {
      eventName: input.eventName,
      requestId: input.requestId ?? null,
      payload: input.payload ?? {},
    });
    await writeRuntimeState(state);

    return;
  }

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

function createRequestRecord(
  input: PrivateBetaRequestInput,
): PrivateBetaRequestRecord {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    experienceLevel: input.experienceLevel,
    interest: input.interest?.trim() ? input.interest.trim() : null,
    status: "Pending",
    createdAt: now,
    updatedAt: now,
    reviewedAt: null,
  };
}

async function readRuntimeState() {
  try {
    const raw = await readFile(runtimeStorePath, "utf8");
    runtimeState = JSON.parse(raw) as PrivateBetaState;
  } catch {
    runtimeState = structuredClone(emptyState);
  }

  return runtimeState;
}

async function writeRuntimeState(state: PrivateBetaState) {
  runtimeState = state;
  await mkdir(dirname(runtimeStorePath), { recursive: true });
  await writeFile(runtimeStorePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function upsertRuntimeRequest(requestState: PrivateBetaState, request: PrivateBetaRequestRecord) {
  const existingIndex = requestState.requests.findIndex(
    (item) => item.email === request.email,
  );

  if (existingIndex >= 0) {
    const existing = requestState.requests[existingIndex];
    requestState.requests[existingIndex] = {
      ...existing,
      ...request,
      id: existing.id,
      createdAt: existing.createdAt,
    };
    return;
  }

  requestState.requests.unshift(request);
}

function addRuntimeEvent(
  requestState: PrivateBetaState,
  input: PrivateBetaEventInput,
) {
  requestState.events.unshift({
    id: randomUUID(),
    eventName: input.eventName,
    requestId: input.requestId ?? null,
    payload: input.payload ?? {},
    createdAt: new Date().toISOString(),
  });
}
