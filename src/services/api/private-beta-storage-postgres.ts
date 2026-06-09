import { randomUUID } from "crypto";
import { Client } from "pg";
import type {
  PrivateBetaEventInput,
  PrivateBetaEventName,
  PrivateBetaEventRecord,
  PrivateBetaRequestInput,
  PrivateBetaRequestRecord,
} from "@/services/api/private-beta-storage";
import type {
  PrivateBetaExperienceLevel,
  PrivateBetaStatus,
} from "@/lib/private-beta-content";

export async function listPrivateBetaRequestsFromDatabase() {
  return withPrivateBetaDatabase(async (client) => {
    const result = await client.query<PrivateBetaRequestRow>(
      `
        SELECT
          id,
          name,
          email,
          experience_level,
          interest_text,
          status,
          created_at,
          updated_at
        FROM private_beta_requests
        ORDER BY created_at DESC
      `,
    );

    return result.rows.map(mapRequestRow);
  });
}

export async function listPrivateBetaEventsFromDatabase() {
  return withPrivateBetaDatabase(async (client) => {
    const result = await client.query<PrivateBetaEventRow>(
      `
        SELECT
          id,
          event_name,
          request_id,
          payload,
          created_at
        FROM private_beta_events
        ORDER BY created_at DESC
      `,
    );

    return result.rows.map(mapEventRow);
  });
}

export async function createPrivateBetaRequestInDatabase(
  input: PrivateBetaRequestInput,
) {
  return withPrivateBetaDatabase(async (client) => {
    await client.query("BEGIN");

    try {
      const request = createRequestRecord(input);
      const result = await client.query<PrivateBetaRequestRow>(
        `
          INSERT INTO private_beta_requests (
            id,
            name,
            email,
            experience_level,
            interest_text,
            status,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, 'Pending', now(), now())
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            experience_level = EXCLUDED.experience_level,
            interest_text = EXCLUDED.interest_text,
            status = 'Pending',
            updated_at = now()
          RETURNING
            id,
            name,
            email,
            experience_level,
            interest_text,
            status,
            created_at,
            updated_at
        `,
        [
          request.id,
          request.name,
          request.email,
          request.experienceLevel,
          request.interest,
        ],
      );

      const storedRequest = mapRequestRow(result.rows[0]);

      await client.query(
        `
          INSERT INTO private_beta_events (
            id,
            event_name,
            request_id,
            payload,
            created_at
          )
          VALUES ($1, $2, $3, $4::jsonb, now())
        `,
        [
          generateEventId(),
          "beta_request_submitted",
          storedRequest.id,
          JSON.stringify({
            email: storedRequest.email,
            experienceLevel: storedRequest.experienceLevel,
          }),
        ],
      );

      await client.query("COMMIT");
      return storedRequest;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    }
  });
}

export async function updatePrivateBetaRequestStatusInDatabase(
  requestId: string,
  status: PrivateBetaStatus,
) {
  return withPrivateBetaDatabase(async (client) => {
    const result = await client.query<PrivateBetaRequestRow>(
      `
        UPDATE private_beta_requests
        SET
          status = $2,
          updated_at = now()
        WHERE id = $1
        RETURNING
          id,
          name,
          email,
          experience_level,
          interest_text,
          status,
          created_at,
          updated_at
      `,
      [requestId, status],
    );

    if (!result.rows[0]) {
      return null;
    }

    const request = mapRequestRow(result.rows[0]);

    await client.query(
      `
        INSERT INTO private_beta_events (
          id,
          event_name,
          request_id,
          payload,
          created_at
        )
        VALUES ($1, $2, $3, $4::jsonb, now())
      `,
      [
        generateEventId(),
        status === "Approved"
          ? "beta_approved"
          : status === "Rejected"
            ? "beta_rejected"
            : "landing_visit",
        request.id,
        JSON.stringify({
          email: request.email,
          status,
        }),
      ],
    );

    return request;
  });
}

export async function recordPrivateBetaEventInDatabase(
  input: PrivateBetaEventInput,
) {
  await withPrivateBetaDatabase(async (client) => {
    await client.query(
      `
        INSERT INTO private_beta_events (
          id,
          event_name,
          request_id,
          payload,
          created_at
        )
        VALUES ($1, $2, $3, $4::jsonb, now())
      `,
      [
        generateEventId(),
        input.eventName,
        input.requestId ?? null,
        JSON.stringify(input.payload ?? {}),
      ],
    );
  });
}

type PrivateBetaRequestRow = {
  id: string;
  name: string;
  email: string;
  experience_level: string;
  interest_text: string | null;
  status: PrivateBetaStatus;
  created_at: string;
  updated_at: string;
};

type PrivateBetaEventRow = {
  id: string;
  event_name: PrivateBetaEventName;
  request_id: string | null;
  payload: Record<string, unknown> | string;
  created_at: string;
};

function withPrivateBetaDatabase<T>(
  runQuery: (client: Client) => Promise<T>,
) {
  const connectionString = process.env.POC_INTELLIGENCE_DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("POC_INTELLIGENCE_DATABASE_URL is required");
  }

  const client = new Client({ connectionString });

  return client.connect().then(async () => {
    try {
      return await runQuery(client);
    } finally {
      await client.end();
    }
  });
}

function createRequestRecord(
  input: PrivateBetaRequestInput,
): PrivateBetaRequestRecord {
  const now = new Date().toISOString();

  return {
    id: generateRequestId(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    experienceLevel: input.experienceLevel,
    interest: input.interest?.trim() ? input.interest.trim() : null,
    status: "Pending",
    createdAt: now,
    updatedAt: now,
  };
}

function mapRequestRow(row: PrivateBetaRequestRow): PrivateBetaRequestRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    experienceLevel: row.experience_level as PrivateBetaExperienceLevel,
    interest: row.interest_text,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEventRow(row: PrivateBetaEventRow): PrivateBetaEventRecord {
  return {
    id: row.id,
    eventName: row.event_name,
    requestId: row.request_id,
    payload:
      typeof row.payload === "string"
        ? JSON.parse(row.payload)
        : row.payload ?? {},
    createdAt: row.created_at,
  };
}

function generateRequestId() {
  return randomUUID();
}

function generateEventId() {
  return randomUUID();
}
