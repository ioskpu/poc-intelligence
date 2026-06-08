import {
  fetchFuturesDashboardState,
  type FuturesDashboardState,
} from "@/services/api/market-rankings";
import type { GhostTracking, GhostTrackingRecord } from "@/types/intelligence";

type GhostDashboardState = FuturesDashboardState & {
  capital_control?: {
    futures_lab?: {
      ghost_tracking?: FuturesGhostTracking;
    };
  };
};

type FuturesGhostTracking = {
  avg_hypothetical_pnl_pct?: unknown;
  avg_mae_pct?: unknown;
  avg_mfe_pct?: unknown;
  last_settled_at?: unknown;
  pending_count?: unknown;
  positive_rate?: unknown;
  profit_factor_by_reason?: FuturesGhostProfitFactorRow[];
  reason_breakdown?: FuturesGhostReasonRow[];
  settled_count?: unknown;
};

type FuturesGhostReasonRow = {
  avg_hypothetical_pnl_pct?: unknown;
  gate_reason?: unknown;
  gate_reason_label?: unknown;
  settled_count?: unknown;
  settled_positive_count?: unknown;
  total_count?: unknown;
};

type FuturesGhostProfitFactorRow = {
  gate_reason?: unknown;
  profit_factor?: unknown;
};

const GHOST_RECORD_LIMIT = 5;

export async function getGhostTracking(): Promise<GhostTracking> {
  const state = (await fetchFuturesDashboardState()) as GhostDashboardState;
  const ghost = state.capital_control?.futures_lab?.ghost_tracking;

  if (!ghost) {
    return emptyGhostTracking();
  }

  return {
    pendingCount: readOptionalNumber(ghost.pending_count),
    settledCount: readOptionalNumber(ghost.settled_count),
    positiveRate: readOptionalNumber(ghost.positive_rate),
    averageHypotheticalPnlPct: readOptionalNumber(
      ghost.avg_hypothetical_pnl_pct,
    ),
    averageMfePct: readOptionalNumber(ghost.avg_mfe_pct),
    averageMaePct: readOptionalNumber(ghost.avg_mae_pct),
    lastSettledAt: readTimestamp(ghost.last_settled_at),
    records: toGhostRecords(ghost),
  };
}

function emptyGhostTracking(): GhostTracking {
  return {
    pendingCount: null,
    settledCount: null,
    positiveRate: null,
    averageHypotheticalPnlPct: null,
    averageMfePct: null,
    averageMaePct: null,
    lastSettledAt: null,
    records: [],
  };
}

function toGhostRecords(ghost: FuturesGhostTracking): GhostTrackingRecord[] {
  const rows = Array.isArray(ghost.reason_breakdown)
    ? ghost.reason_breakdown
    : [];
  const profitFactors = Array.isArray(ghost.profit_factor_by_reason)
    ? ghost.profit_factor_by_reason
    : [];

  return rows.slice(0, GHOST_RECORD_LIMIT).map((row) => {
    const reason = readText(row.gate_reason);
    const profitFactor = profitFactors.find(
      (item) => readText(item.gate_reason) === reason,
    );

    return {
      rejectionReason: reason || "unknown_reason",
      rejectionReasonLabel:
        readText(row.gate_reason_label) || humanizeText(reason) || "Unknown",
      totalCount: readOptionalNumber(row.total_count),
      settledCount: readOptionalNumber(row.settled_count),
      settledPositiveCount: readOptionalNumber(row.settled_positive_count),
      averageHypotheticalPnlPct: readOptionalNumber(
        row.avg_hypothetical_pnl_pct,
      ),
      profitFactor: readOptionalNumber(profitFactor?.profit_factor),
    };
  });
}

function humanizeText(value: string) {
  const normalized = value.trim().replaceAll("_", " ");

  if (!normalized) {
    return "";
  }

  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
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
