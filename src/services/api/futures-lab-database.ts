import { Client } from "pg";

export async function withFuturesLabDatabase<T>(
  runQuery: (client: Client) => Promise<T>,
) {
  const connectionString = process.env.FUTURES_LAB_DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("FUTURES_LAB_DATABASE_URL is required");
  }

  const client = new Client({
    connectionString,
  });

  await client.connect();

  try {
    return await runQuery(client);
  } finally {
    await client.end();
  }
}
