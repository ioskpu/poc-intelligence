import {
  fetchFuturesDashboardState,
  type FuturesDashboardState,
} from "@/services/api/market-rankings";
import type { LabDecision } from "@/types/intelligence";

type DecisionDashboardState = FuturesDashboardState & {
  capital_control?: {
    futures_lab?: {
      latest_decision?: FuturesDecisionRow;
      recent_decisions?: FuturesDecisionRow[];
    };
  };
};

type FuturesDecisionRow = {
  decision_snapshot?: {
    scan_batch_id?: unknown;
    setup_key?: unknown;
    setup_key_version?: unknown;
    estimated_rr_ratio?: unknown;
    selected_side?: unknown;
    signal_ok?: unknown;
    oracle_recommendation?: unknown;
    trend_alignment_label?: unknown;
    trend_supports_direction?: unknown;
  };
  auto_entry_enabled?: unknown;
  auto_exit_enabled?: unknown;
  capital_profile?: unknown;
  decision_type?: unknown;
  direction_hint?: unknown;
  estimated_rr_ratio?: unknown;
  environment?: unknown;
  leverage?: unknown;
  observed_at?: unknown;
  reason?: unknown;
  reason_label?: unknown;
  selected_side?: unknown;
  setup_key?: unknown;
  setup_key_version?: unknown;
  signal_ok?: unknown;
  stop_loss_pct?: unknown;
  stop_loss_usdt?: unknown;
  symbol?: unknown;
  take_profit_pct?: unknown;
  take_profit_usdt?: unknown;
  operating_capital?: unknown;
};

const RECENT_DECISION_LIMIT = 5;

export async function getRecentLabDecisions(): Promise<LabDecision[]> {
  const state = (await fetchFuturesDashboardState()) as DecisionDashboardState;

  return getRecentLabDecisionsFromState(state);
}

export function getRecentLabDecisionsFromState(
  state: FuturesDashboardState,
): LabDecision[] {
  const decisionState = state as DecisionDashboardState;
  const futuresLab = decisionState.capital_control?.futures_lab;
  const rows = Array.isArray(futuresLab?.recent_decisions)
    ? futuresLab.recent_decisions
    : [];

  if (rows.length === 0 && futuresLab?.latest_decision) {
    return [toLabDecision(futuresLab.latest_decision)];
  }

  return rows.slice(0, RECENT_DECISION_LIMIT).map(toLabDecision);
}

function toLabDecision(row: FuturesDecisionRow): LabDecision {
  return {
    symbol: readText(row.symbol) || "UNKNOWN",
    selectedSide:
      readText(row.selected_side) ||
      readText(row.decision_snapshot?.selected_side) ||
      readText(row.direction_hint) ||
      "Not selected",
    decisionType: humanizeText(readText(row.decision_type) || "lab_observation"),
    reason:
      readText(row.reason_label) ||
      humanizeText(readText(row.reason)) ||
      "No reason provided",
    signalStatus: readSignalStatus(
      row.signal_ok ?? row.decision_snapshot?.signal_ok,
    ),
    rewardRisk: readOptionalNumber(
      row.estimated_rr_ratio ?? row.decision_snapshot?.estimated_rr_ratio,
    ),
    setupKey: readText(row.setup_key),
    observedAt: readTimestamp(row.observed_at) ?? new Date(0).toISOString(),
    scanBatchId: readText(row.decision_snapshot?.scan_batch_id),
    setupKeyVersion: readText(
      row.setup_key_version ?? row.decision_snapshot?.setup_key_version,
    ),
    environment: readText(row.environment),
    directionHint: readText(row.direction_hint),
    capitalProfile: readText(row.capital_profile),
    operatingCapital: readOptionalNumber(row.operating_capital),
    autoEntryEnabled: readBoolean(row.auto_entry_enabled),
    autoExitEnabled: readBoolean(row.auto_exit_enabled),
    takeProfitPct: readOptionalNumber(row.take_profit_pct),
    stopLossPct: readOptionalNumber(row.stop_loss_pct),
    takeProfitUsdt: readOptionalNumber(row.take_profit_usdt),
    stopLossUsdt: readOptionalNumber(row.stop_loss_usdt),
    leverage: readOptionalNumber(row.leverage),
    oracleRecommendation: readText(
      row.decision_snapshot?.oracle_recommendation,
    ),
    trendAlignmentLabel: readText(
      row.decision_snapshot?.trend_alignment_label,
    ),
    trendSupportsDirection: readBoolean(
      row.decision_snapshot?.trend_supports_direction,
    ),
  };
}

function readSignalStatus(value: unknown) {
  if (value === true) {
    return "Signal OK";
  }

  if (value === false) {
    return "Signal not OK";
  }

  return "Unknown";
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

function readBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "t", "1", "yes", "y"].includes(normalized)) {
      return true;
    }

    if (["false", "f", "0", "no", "n"].includes(normalized)) {
      return false;
    }
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }
  }

  return null;
}
