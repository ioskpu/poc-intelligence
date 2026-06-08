import {
  fetchFuturesDashboardState,
  type FuturesDashboardState,
} from "@/services/api/market-rankings";
import type { SetupMemory } from "@/types/intelligence";

type SetupMemoryDashboardState = FuturesDashboardState & {
  capital_control?: {
    futures_lab?: {
      setup_rankings?: {
        available?: unknown;
        by_setup_key?: FuturesSetupMemoryRow[];
      };
    };
  };
};

type FuturesSetupMemoryRow = {
  avg_pnl?: unknown;
  health_label?: unknown;
  health_score?: unknown;
  last_observed_at?: unknown;
  last_seen?: unknown;
  last_side?: unknown;
  last_symbol?: unknown;
  pnl_total?: unknown;
  setup_key?: unknown;
  side?: unknown;
  summary_text?: unknown;
  symbol?: unknown;
  trade_count?: unknown;
  win_rate?: unknown;
};

const SETUP_MEMORY_LIMIT = 5;

export async function getSetupMemory(): Promise<SetupMemory[]> {
  const state = (await fetchFuturesDashboardState()) as SetupMemoryDashboardState;

  return getSetupMemoryFromState(state);
}

export function getSetupMemoryFromState(
  state: FuturesDashboardState,
): SetupMemory[] {
  const setupState = state as SetupMemoryDashboardState;
  const setupRankings = setupState.capital_control?.futures_lab?.setup_rankings;

  if (setupRankings?.available !== true) {
    return [];
  }

  const rows = Array.isArray(setupRankings.by_setup_key)
    ? setupRankings.by_setup_key
    : [];

  return rows.slice(0, SETUP_MEMORY_LIMIT).map(toSetupMemory);
}

function toSetupMemory(row: FuturesSetupMemoryRow): SetupMemory {
  return {
    setupKey: readText(row.setup_key) || "unknown_setup",
    symbol: readText(row.symbol) || readText(row.last_symbol) || "UNKNOWN",
    side: readText(row.side) || readText(row.last_side) || "Unknown",
    tradeCount: readOptionalNumber(row.trade_count),
    winRate: readOptionalNumber(row.win_rate),
    healthScore: readOptionalNumber(row.health_score),
    healthLabel: readText(row.health_label) || "Unknown",
    pnlTotal: readOptionalNumber(row.pnl_total),
    averagePnl: readOptionalNumber(row.avg_pnl),
    summaryText: readText(row.summary_text),
    lastSeenAt:
      readTimestamp(row.last_seen) ??
      readTimestamp(row.last_observed_at) ??
      new Date(0).toISOString(),
  };
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalNumber(value: unknown) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
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
