type PrivateBetaFetchOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: Record<string, unknown> | null;
};

export async function submitPrivateBetaRequest(
  payload: Record<string, unknown>,
) {
  return fetchPrivateBetaApi("/api/private-beta", {
    method: "POST",
    body: payload,
  });
}

export async function changePrivateBetaRequestStatus(
  requestId: string,
  payload: Record<string, unknown>,
) {
  return fetchPrivateBetaApi(`/api/private-beta/${requestId}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function trackPrivateBetaLandingVisit(
  payload: Record<string, unknown>,
) {
  await fetchPrivateBetaApi("/api/private-beta/events", {
    method: "POST",
    body: {
      eventName: "landing_visit",
      ...payload,
    },
  });
}

async function fetchPrivateBetaApi(
  path: string,
  options: PrivateBetaFetchOptions,
) {
  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body),
    cache: "no-store",
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(readErrorMessage(payload, response.status));
  }

  return payload;
}

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function readErrorMessage(payload: unknown, status: number) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as Record<string, unknown>).error === "string"
  ) {
    return (payload as Record<string, string>).error;
  }

  return `Private beta request failed with status ${status}`;
}
