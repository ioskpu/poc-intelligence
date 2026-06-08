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
    estimated_rr_ratio?: unknown;
    selected_side?: unknown;
    signal_ok?: unknown;
  };
  decision_type?: unknown;
  direction_hint?: unknown;
  estimated_rr_ratio?: unknown;
  observed_at?: unknown;
  reason?: unknown;
  reason_label?: unknown;
  selected_side?: unknown;
  setup_key?: unknown;
  signal_ok?: unknown;
  symbol?: unknown;
};

const RECENT_DECISION_LIMIT = 5;

export async function getRecentLabDecisions(): Promise<LabDecision[]> {
  const state = (await fetchFuturesDashboardState()) as DecisionDashboardState;
  const futuresLab = state.capital_control?.futures_lab;
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
