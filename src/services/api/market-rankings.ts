import type { Direction, MarketRanking } from "@/types/intelligence";

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
  rankings: MarketRanking[];
};

const DEFAULT_FUTURES_LAB_URL = "http://127.0.0.1:8000";
const DEFAULT_INTERNAL_API_KEY = "dev-secret-key";

export async function getMarketRankings(): Promise<MarketRankingResult> {
  const state = await fetchFuturesDashboardState();
  const rows = Array.isArray(state.futures_scanner_rankings)
    ? state.futures_scanner_rankings
    : [];

  return {
    generatedAt: readTimestamp(state.generated_at) ?? latestScannedAt(rows),
    rankings: rows.map(toMarketRanking),
  };
}

async function fetchFuturesDashboardState(): Promise<FuturesDashboardState> {
  const baseUrl = (
    process.env.FUTURES_LAB_API_BASE_URL ?? DEFAULT_FUTURES_LAB_URL
  ).replace(/\/$/, "");
  const apiKey =
    process.env.FUTURES_LAB_INTERNAL_API_KEY ?? DEFAULT_INTERNAL_API_KEY;

  const response = await fetch(`${baseUrl}/internal/dashboard/state`, {
    headers: {
      "X-API-KEY": apiKey,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Futures Lab dashboard state failed: ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isDashboardState(payload)) {
    throw new Error("Futures Lab dashboard state returned an invalid shape");
  }

  return payload;
}

function isDashboardState(value: unknown): value is FuturesDashboardState {
  return typeof value === "object" && value !== null;
}

function toMarketRanking(row: FuturesScannerRow): MarketRanking {
  return {
    symbol: readText(row.symbol) || "UNKNOWN",
    market: "Binance USDT Perpetual",
    consistencyScore: normalizeScore(row.score),
    regime: humanizeRegime(readText(row.regime_bias)),
    direction: mapDirection(readText(row.direction_hint)),
  };
}

function normalizeScore(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(parsed)));
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
