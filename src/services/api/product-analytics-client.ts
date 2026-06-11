import type {
  ProductAnalyticsEventInput,
  ProductAnalyticsSummary,
} from "@/services/api/product-analytics";

type PrivateBetaApiOptions = {
  method?: string;
  body?: Record<string, unknown>;
  sessionToken?: string | null;
};

function getPrivateBetaApiBaseUrl() {
  const value = process.env.POC_INTELLIGENCE_API_URL?.trim();

  if (!value) {
    throw new Error("POC_INTELLIGENCE_API_URL is required");
  }

  return value.replace(/\/+$/, "");
}

async function fetchPrivateBetaApi(path: string, options?: PrivateBetaApiOptions) {
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

  if (!response.ok) {
    throw new Error(`Private beta product analytics request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function recordProductAnalyticsEventInBackend(
  input: ProductAnalyticsEventInput & {
    accountId: string;
    email: string;
    role: string;
    status: string;
    timestamp: string;
  },
  sessionToken: string,
) {
  await fetchPrivateBetaApi("/private-beta/product-events", {
    method: "POST",
    sessionToken,
    body: input,
  });
}

export async function fetchProductAnalyticsSummaryFromBackend(
  sessionToken: string,
): Promise<ProductAnalyticsSummary> {
  return fetchPrivateBetaApi("/private-beta/analytics/product-usage", {
    sessionToken,
  }) as Promise<ProductAnalyticsSummary>;
}
