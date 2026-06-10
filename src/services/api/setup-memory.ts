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
  avg_pnl_pct?: unknown;
  avg_capital_reference?: unknown;
  avg_hold_ticks?: unknown;
  avg_win_pnl?: unknown;
  avg_loss_abs?: unknown;
  capital_profile?: unknown;
  cooldown_multiplier?: unknown;
  environment?: unknown;
  health_label?: unknown;
  health_score?: unknown;
  lane?: unknown;
  last_observed_at?: unknown;
  last_realized_pnl?: unknown;
  last_realized_pnl_pct?: unknown;
  last_seen?: unknown;
  last_side?: unknown;
  last_symbol?: unknown;
  last_close_reason?: unknown;
  win_count?: unknown;
  pnl_total?: unknown;
  setup_key?: unknown;
  side?: unknown;
  summary_text?: unknown;
  symbol?: unknown;
  trade_count?: unknown;
  win_rate?: unknown;
  suggested_stop_loss_usdt?: unknown;
  suggested_take_profit_usdt?: unknown;
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
    environment: readText(row.environment),
    capitalProfile: readText(row.capital_profile),
    lane: readText(row.lane),
    tradeCount: readOptionalNumber(row.trade_count),
    winCount: readOptionalNumber(row.win_count),
    winRate: readOptionalNumber(row.win_rate),
    healthScore: readOptionalNumber(row.health_score),
    healthLabel: readText(row.health_label) || "Unknown",
    pnlTotal: readOptionalNumber(row.pnl_total),
    averagePnl: readOptionalNumber(row.avg_pnl),
    averagePnlPct: readOptionalNumber(row.avg_pnl_pct),
    averageCapitalReference: readOptionalNumber(row.avg_capital_reference),
    averageHoldTicks: readOptionalNumber(row.avg_hold_ticks),
    averageWinPnl: readOptionalNumber(row.avg_win_pnl),
    averageLossAbs: readOptionalNumber(row.avg_loss_abs),
    lastRealizedPnl: readOptionalNumber(row.last_realized_pnl),
    lastRealizedPnlPct: readOptionalNumber(row.last_realized_pnl_pct),
    cooldownMultiplier: readOptionalNumber(row.cooldown_multiplier),
    suggestedTakeProfitUsdt: readOptionalNumber(
      row.suggested_take_profit_usdt,
    ),
    suggestedStopLossUsdt: readOptionalNumber(row.suggested_stop_loss_usdt),
    lastCloseReason: readText(row.last_close_reason) || null,
    summaryText: readText(row.summary_text),
    lastSeenAt:
      readTimestamp(row.last_seen) ??
      readTimestamp(row.last_observed_at) ??
      new Date(0).toISOString(),
    lastSymbol: readText(row.last_symbol) || readText(row.symbol) || "UNKNOWN",
    lastSide: readText(row.last_side) || readText(row.side) || "Unknown",
    lastObservedAt:
      readTimestamp(row.last_observed_at) ??
      readTimestamp(row.last_seen) ??
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
