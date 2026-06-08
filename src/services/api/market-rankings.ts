import type { Direction, MarketRanking, MarketSummary } from "@/types/intelligence";

type FuturesDashboardState = {
  generated_at?: string;
  futures_scanner_rankings?: FuturesScannerRow[];
};

type FuturesScannerRow = {
  symbol?: unknown;
  rank_position?: unknown;
  score?: unknown;
  direction_hint?: unknown;
  regime_bias?: unknown;
  scanned_at?: unknown;
};

type MarketRankingResult = {
  generatedAt: string;
  summary: MarketSummary;
  rankings: MarketRanking[];
};

const DEFAULT_REQUEST_TIMEOUT_MS = 20000;

export async function getMarketRankings(): Promise<MarketRankingResult> {
  const state = await fetchFuturesDashboardState();
  const rows = Array.isArray(state.futures_scanner_rankings)
    ? state.futures_scanner_rankings
    : [];

  return {
    generatedAt: readTimestamp(state.generated_at) ?? latestScannedAt(rows),
    rankings: rows.map(toMarketRanking),
    summary: toMarketSummary(rows),
  };
}

async function fetchFuturesDashboardState(): Promise<FuturesDashboardState> {
  const { apiKey, baseUrl, timeoutMs } = readFuturesLabConfig();

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/internal/dashboard/state`, {
      headers: {
        "X-API-KEY": apiKey,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new Error(toNetworkErrorMessage(error));
  }

  if (!response.ok) {
    throw new Error(toStatusErrorMessage(response.status));
  }

  const payload: unknown = await response.json();

  if (!isDashboardState(payload)) {
    throw new Error("Futures Lab dashboard state returned an invalid shape");
  }

  return payload;
}

function readFuturesLabConfig() {
  const rawBaseUrl = process.env.FUTURES_LAB_API_BASE_URL?.trim();
  const apiKey = process.env.FUTURES_LAB_INTERNAL_API_KEY?.trim();

  if (!rawBaseUrl) {
    throw new Error("FUTURES_LAB_API_BASE_URL is required");
  }

  if (!apiKey) {
    throw new Error("FUTURES_LAB_INTERNAL_API_KEY is required");
  }

  let url: URL;

  try {
    url = new URL(rawBaseUrl);
  } catch {
    throw new Error("FUTURES_LAB_API_BASE_URL must be a valid URL");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("FUTURES_LAB_API_BASE_URL must use http or https");
  }

  return {
    apiKey,
    baseUrl: rawBaseUrl.replace(/\/$/, ""),
    timeoutMs: readRequestTimeoutMs(),
  };
}

function readRequestTimeoutMs() {
  const rawTimeout = process.env.FUTURES_LAB_REQUEST_TIMEOUT_MS?.trim();

  if (!rawTimeout) {
    return DEFAULT_REQUEST_TIMEOUT_MS;
  }

  const parsed = Number(rawTimeout);

  if (!Number.isFinite(parsed) || parsed < 1000) {
    throw new Error("FUTURES_LAB_REQUEST_TIMEOUT_MS must be at least 1000");
  }

  return Math.round(parsed);
}

function isDashboardState(value: unknown): value is FuturesDashboardState {
  return typeof value === "object" && value !== null;
}

function toMarketRanking(row: FuturesScannerRow): MarketRanking {
  const symbol = readText(row.symbol) || "UNKNOWN";

  return {
    rank: readRank(row.rank_position),
    symbol,
    market: "Binance USDT Perpetual",
    consistencyScore: normalizeScore(row.score),
    regime: humanizeRegime(readText(row.regime_bias)),
    direction: mapDirection(readText(row.direction_hint)),
    scannedAt: readTimestamp(row.scanned_at) ?? new Date(0).toISOString(),
  };
}

function toMarketSummary(rows: FuturesScannerRow[]): MarketSummary {
  const rankings = rows.map(toMarketRanking);
  const topRanking = rankings[0];

  return {
    totalMarkets: rankings.length,
    topSymbol: topRanking?.symbol ?? "None",
    topScore: topRanking?.consistencyScore ?? 0,
    lastUpdatedAt: latestScannedAt(rows),
  };
}

function readRank(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 0;
  }

  return Math.round(parsed);
}

function normalizeScore(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  const scaled = parsed >= 0 && parsed <= 1 ? parsed * 100 : parsed;

  return Math.max(0, Math.min(100, Math.round(scaled)));
}

function mapDirection(value: string): Direction {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes("long") || normalized.includes("bull")) {
    return "Bullish";
  }

  if (normalized.includes("short") || normalized.includes("bear")) {
    return "Bearish";
  }

  return "Neutral";
}

function humanizeRegime(value: string) {
  const normalized = value.trim().replaceAll("_", " ");

  if (!normalized) {
    return "Unknown";
  }

  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function latestScannedAt(rows: FuturesScannerRow[]) {
  const firstTimestamp = rows
    .map((row) => readTimestamp(row.scanned_at))
    .find(Boolean);

  return firstTimestamp ?? new Date().toISOString();
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readTimestamp(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function toStatusErrorMessage(status: number) {
  if (status === 401 || status === 403) {
    return `Futures Lab authentication failed: ${status}`;
  }

  if (status === 404) {
    return "Futures Lab dashboard state endpoint was not found: 404";
  }

  if (status >= 500) {
    return `Futures Lab dashboard state is unavailable: ${status}`;
  }

  return `Futures Lab dashboard state failed: ${status}`;
}

function toNetworkErrorMessage(error: unknown) {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "Futures Lab dashboard state request timed out";
  }

  if (error instanceof Error && error.name === "AbortError") {
    return "Futures Lab dashboard state request was aborted";
  }

  return "Futures Lab dashboard state is unreachable";
}
