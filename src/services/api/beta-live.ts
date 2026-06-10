import type {
  BetaDecisionContext,
  BetaDiagnosticDistribution,
  BetaLiveInsights,
  BetaScannerDetail,
  GhostThresholdSimulation,
  SetupMemory,
} from "@/types/intelligence";
import type { FuturesDashboardState } from "@/services/api/market-rankings";

type LiveGhostTracking = {
  pending_count?: unknown;
  settled_count?: unknown;
  positive_rate?: unknown;
  avg_hypothetical_pnl_pct?: unknown;
  avg_mfe_pct?: unknown;
  avg_mae_pct?: unknown;
  last_settled_at?: unknown;
  rr_threshold_simulation?: unknown;
};

type BetaLiveDashboardState = FuturesDashboardState & {
  capital_control?: {
    futures_lab?: {
      operational_diagnostics?: Record<string, unknown>;
      ghost_tracking?: LiveGhostTracking;
      recent_decisions?: unknown;
      latest_decision?: unknown;
      setup_rankings?: {
        available?: unknown;
        by_setup_key?: unknown;
      };
    };
  };
};

type LiveScannerRow = {
  funding_rate?: unknown;
  last_price?: unknown;
  long_short_balance?: unknown;
  order_valid?: unknown;
  price_change_pct?: unknown;
  quote_volume?: unknown;
  range_pct?: unknown;
  rank_position?: unknown;
  ranking_reason?: unknown;
  realized_volatility_pct?: unknown;
  scan_batch_id?: unknown;
  score?: unknown;
  scanned_at?: unknown;
  symbol?: unknown;
  trend_strength_pct?: unknown;
};

type LiveDecisionRow = {
  decision_snapshot?: {
    scan_batch_id?: unknown;
    setup_key?: unknown;
    setup_key_version?: unknown;
    selected_side?: unknown;
    estimated_rr_ratio?: unknown;
    oracle_recommendation?: unknown;
    trend_alignment_label?: unknown;
    trend_supports_direction?: unknown;
    signal_ok?: unknown;
  };
  auto_entry_enabled?: unknown;
  auto_exit_enabled?: unknown;
  capital_profile?: unknown;
  decision_type?: unknown;
  estimated_rr_ratio?: unknown;
  environment?: unknown;
  direction_hint?: unknown;
  observed_at?: unknown;
  reason?: unknown;
  reason_label?: unknown;
  selected_side?: unknown;
  setup_key?: unknown;
  setup_key_version?: unknown;
  signal_ok?: unknown;
  symbol?: unknown;
  leverage?: unknown;
  operating_capital?: unknown;
  take_profit_pct?: unknown;
  stop_loss_pct?: unknown;
  take_profit_usdt?: unknown;
  stop_loss_usdt?: unknown;
};

type LiveSetupRow = {
  avg_capital_reference?: unknown;
  avg_hold_ticks?: unknown;
  avg_loss_abs?: unknown;
  avg_pnl?: unknown;
  avg_pnl_pct?: unknown;
  avg_win_pnl?: unknown;
  capital_profile?: unknown;
  cooldown_multiplier?: unknown;
  environment?: unknown;
  health_label?: unknown;
  health_score?: unknown;
  lane?: unknown;
  last_observed_at?: unknown;
  last_seen?: unknown;
  last_side?: unknown;
  last_symbol?: unknown;
  last_realized_pnl?: unknown;
  last_realized_pnl_pct?: unknown;
  last_close_reason?: unknown;
  pnl_total?: unknown;
  setup_key?: unknown;
  side?: unknown;
  summary_text?: unknown;
  symbol?: unknown;
  trade_count?: unknown;
  win_count?: unknown;
  win_rate?: unknown;
  suggested_take_profit_usdt?: unknown;
  suggested_stop_loss_usdt?: unknown;
};

type LiveGhostSimulationRow = {
  avg_hypothetical_pnl_pct?: unknown;
  avg_mae_pct?: unknown;
  gross_losses_pct?: unknown;
  gross_wins_pct?: unknown;
  included_count?: unknown;
  max_drawdown_pct?: unknown;
  positive_count?: unknown;
  positive_rate?: unknown;
  profit_factor?: unknown;
  threshold?: unknown;
  variance?: unknown;
};

export function isBetaLiveModeEnabled() {
  return process.env.POC_INTELLIGENCE_BETA_LIVE_MODE?.trim().toLowerCase() === "true";
}

export function buildBetaLiveInsights(
  state: FuturesDashboardState,
): BetaLiveInsights {
  const betaState = state as BetaLiveDashboardState;
  const scannerRows = Array.isArray(state.futures_scanner_rankings)
    ? state.futures_scanner_rankings as LiveScannerRow[]
    : [];
  const futuresLab = betaState.capital_control?.futures_lab ?? {};
  const recentDecisions = collectDecisions(futuresLab.recent_decisions, futuresLab.latest_decision);
  const setupRows = collectSetupRows(futuresLab.setup_rankings);
  const diagnostics = buildDiagnostics(futuresLab.operational_diagnostics);
  const ghostOutcomes = buildGhostOutcomes(futuresLab.ghost_tracking);

  return {
    scannerDetails: scannerRows.slice(0, 5).map(toScannerDetail),
    decisionContext: recentDecisions.slice(0, 5).map(toDecisionContext),
    setupDepth: setupRows.slice(0, 5).map(toSetupDepth),
    ghostOutcomes,
    diagnostics,
    fieldInventory: {
      scanner: [
        "scan_batch_id",
        "last_price",
        "quote_volume",
        "range_pct",
        "long_short_balance",
        "order_valid",
        "ranking_reason",
        "price_change_pct",
        "trend_strength_pct",
        "realized_volatility_pct",
        "funding_rate",
      ],
      decision: [
        "decision_type",
        "environment",
        "direction_hint",
        "selected_side",
        "signal_ok",
        "estimated_rr_ratio",
        "trend_alignment_label",
        "trend_supports_direction",
        "setup_key",
        "setup_key_version",
        "oracle_recommendation",
        "capital_profile",
        "operating_capital",
        "auto_entry_enabled",
        "auto_exit_enabled",
        "take_profit_pct",
        "stop_loss_pct",
        "take_profit_usdt",
        "stop_loss_usdt",
      ],
      setup: [
        "trade_count",
        "win_count",
        "win_rate",
        "pnl_total",
        "avg_pnl",
        "avg_pnl_pct",
        "avg_capital_reference",
        "avg_hold_ticks",
        "avg_win_pnl",
        "avg_loss_abs",
        "health_score",
        "summary_text",
        "environment",
        "capital_profile",
        "lane",
        "last_realized_pnl",
        "last_realized_pnl_pct",
        "cooldown_multiplier",
        "suggested_take_profit_usdt",
        "suggested_stop_loss_usdt",
        "last_close_reason",
      ],
      ghost: [
        "pending_count",
        "settled_count",
        "positive_rate",
        "avg_hypothetical_pnl_pct",
        "avg_mfe_pct",
        "avg_mae_pct",
        "last_settled_at",
        "reason_breakdown",
        "profit_factor_by_reason",
        "rr_threshold_simulation",
      ],
      diagnostics: [
        "window_cycles",
        "window_hours",
        "total_candidates",
        "total_eligible",
        "candidate_ready_cycle_rate",
        "eligible_cycle_rate",
        "expected_candidate_ready_per_day",
        "expected_eligible_cycles_per_day",
        "opportunity_starvation",
        "filter_survival",
        "dominant_rejection_reason",
        "rejection_combinations",
        "regime_distribution",
      ],
    },
    missingFields: [],
  };
}

function collectDecisions(recentDecisions: unknown, latestDecision: unknown) {
  const rows = Array.isArray(recentDecisions) ? recentDecisions : [];

  if (rows.length > 0) {
    return rows as LiveDecisionRow[];
  }

  if (latestDecision && typeof latestDecision === "object") {
    return [latestDecision as LiveDecisionRow];
  }

  return [];
}

function collectSetupRows(value: unknown) {
  if (!value || typeof value !== "object") {
    return [];
  }

  const setupRankings = value as { available?: unknown; by_setup_key?: unknown };
  const rows = setupRankings.available === true
    ? setupRankings.by_setup_key
    : [];

  return Array.isArray(rows) ? (rows as LiveSetupRow[]) : [];
}

function toScannerDetail(row: LiveScannerRow): BetaScannerDetail {
  return {
    symbol: readText(row.symbol) || "UNKNOWN",
    rank: readNumber(row.rank_position),
    consistencyScore: readNumber(row.score),
    scanBatchId: readText(row.scan_batch_id) || null,
    lastPrice: readOptionalNumber(row.last_price),
    quoteVolume: readOptionalNumber(row.quote_volume),
    rangePct: readOptionalNumber(row.range_pct),
    longShortBalance: readOptionalNumber(row.long_short_balance),
    orderValid: readBoolean(row.order_valid),
    rankingReason: readText(row.ranking_reason),
    priceChangePct: readOptionalNumber(row.price_change_pct),
    trendStrengthPct: readOptionalNumber(row.trend_strength_pct),
    realizedVolatilityPct: readOptionalNumber(row.realized_volatility_pct),
    fundingRate: readOptionalNumber(row.funding_rate),
    scannedAt: readTimestamp(row.scanned_at) ?? new Date(0).toISOString(),
  };
}

function toDecisionContext(row: LiveDecisionRow): BetaDecisionContext {
  return {
    symbol: readText(row.symbol) || "UNKNOWN",
    selectedSide:
      readText(row.selected_side) ||
      readText(row.decision_snapshot?.selected_side) ||
      "Unknown",
    decisionType: humanize(readText(row.decision_type) || "lab_observation"),
    reason:
      readText(row.reason_label) ||
      humanize(readText(row.reason)) ||
      "No reason provided",
    signalStatus: readSignalStatus(
      row.signal_ok ?? row.decision_snapshot?.signal_ok,
    ),
    rewardRisk: readOptionalNumber(
      row.estimated_rr_ratio ?? row.decision_snapshot?.estimated_rr_ratio,
    ),
    setupKey: readText(row.setup_key) || readText(row.decision_snapshot?.setup_key),
    observedAt: readTimestamp(row.observed_at) ?? new Date(0).toISOString(),
    scanBatchId: readText(row.decision_snapshot?.scan_batch_id) || null,
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
    oracleRecommendation: readText(row.decision_snapshot?.oracle_recommendation),
    trendAlignmentLabel: readText(row.decision_snapshot?.trend_alignment_label),
    trendSupportsDirection: readBoolean(
      row.decision_snapshot?.trend_supports_direction,
    ),
  };
}

function toSetupDepth(row: LiveSetupRow): SetupMemory {
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

function buildGhostOutcomes(ghost: LiveGhostTracking | undefined) {
  const ghostValue = ghost ?? {};
  const rrThresholdSimulation = Array.isArray(ghostValue.rr_threshold_simulation)
    ? (ghostValue.rr_threshold_simulation as LiveGhostSimulationRow[])
    : [];

  return {
    pendingCount: readOptionalNumber(ghostValue.pending_count),
    settledCount: readOptionalNumber(ghostValue.settled_count),
    positiveRate: readOptionalNumber(ghostValue.positive_rate),
    averageHypotheticalPnlPct: readOptionalNumber(
      ghostValue.avg_hypothetical_pnl_pct,
    ),
    averageMfePct: readOptionalNumber(ghostValue.avg_mfe_pct),
    averageMaePct: readOptionalNumber(ghostValue.avg_mae_pct),
    lastSettledAt: readTimestamp(ghostValue.last_settled_at),
    records: [],
    rrThresholdSimulation: rrThresholdSimulation.map((row) => ({
      threshold: readOptionalNumber(row.threshold) ?? 0,
      includedCount: readOptionalNumber(row.included_count) ?? 0,
      positiveCount: readOptionalNumber(row.positive_count) ?? 0,
      positiveRate: readOptionalNumber(row.positive_rate) ?? 0,
      avgHypotheticalPnlPct: readOptionalNumber(row.avg_hypothetical_pnl_pct) ?? 0,
      grossWinsPct: readOptionalNumber(row.gross_wins_pct) ?? 0,
      grossLossesPct: readOptionalNumber(row.gross_losses_pct) ?? 0,
      profitFactor: readOptionalNumber(row.profit_factor) ?? 0,
      maxDrawdownPct: readOptionalNumber(row.max_drawdown_pct) ?? 0,
      variance: readOptionalNumber(row.variance) ?? 0,
      avgMaePct: readOptionalNumber(row.avg_mae_pct) ?? 0,
    })) as GhostThresholdSimulation[],
  };
}

function buildDiagnostics(diagnostics: Record<string, unknown> | undefined) {
  const value = diagnostics ?? {};
  const funnelIncrementalSurvival = Array.isArray(value.funnel_incremental_survival)
    ? value.funnel_incremental_survival
    : [];
  const rejectionCombinations = Array.isArray(value.rejection_combinations)
    ? value.rejection_combinations
    : [];

  return {
    windowCycles: readNumber(value.window_cycles),
    windowHours: readOptionalNumber(value.window_hours) ?? 0,
    totalCandidates: readNumber(value.total_candidates),
    totalEligible: readNumber(value.total_eligible),
    avgCandidatesPerCycle: readOptionalNumber(value.avg_candidates_per_cycle) ?? 0,
    avgEligiblePerCycle: readOptionalNumber(value.avg_eligible_per_cycle) ?? 0,
    eligibleCycleRate: readOptionalNumber(value.eligible_cycle_rate) ?? 0,
    candidateReadyCycleRate: readOptionalNumber(value.candidate_ready_cycle_rate) ?? 0,
    expectedCandidateReadyPerDay: readOptionalNumber(value.expected_candidate_ready_per_day) ?? 0,
    expectedEligibleCyclesPerDay: readOptionalNumber(value.expected_eligible_cycles_per_day) ?? 0,
    hoursSinceEligibleSetup: readOptionalNumber(value.hours_since_eligible_setup),
    opportunityStarvation: {
      hoursSinceEligibleSetup: readOptionalNumber(
        (value.opportunity_starvation as Record<string, unknown> | undefined)?.hours_since_eligible_setup,
      ),
      isStarved: Boolean(
        (value.opportunity_starvation as Record<string, unknown> | undefined)?.is_starved,
      ),
    },
    filterSurvival: {
      postTimeContext: readOptionalNumber(
        (value.filter_survival as Record<string, unknown> | undefined)?.post_time_context,
      ) ?? 0,
      postEma: readOptionalNumber(
        (value.filter_survival as Record<string, unknown> | undefined)?.post_ema,
      ) ?? 0,
      postRr: readOptionalNumber(
        (value.filter_survival as Record<string, unknown> | undefined)?.post_rr,
      ) ?? 0,
      eligible: readOptionalNumber(
        (value.filter_survival as Record<string, unknown> | undefined)?.eligible,
      ) ?? 0,
    },
    funnelIncrementalSurvival: funnelIncrementalSurvival
      .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
      .map((row) => ({
        label: readText(row.label),
        count: readNumber(row.count),
      })),
    dominantRejectionReason: readText(value.dominant_rejection_reason) || null,
    rejectionCounts: normalizeNumberMap(value.rejection_counts),
    rejectionCombinations: rejectionCombinations
      .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
      .map((row) => ({
        label: readText(row.label),
        count: readNumber(row.count),
      })),
    regimeDistribution: {
      trendAlignment: normalizeDistribution((value.regime_distribution as Record<string, unknown> | undefined)?.trend_alignment),
      regimeBias: normalizeDistribution((value.regime_distribution as Record<string, unknown> | undefined)?.regime_bias),
      timeSession: normalizeDistribution((value.regime_distribution as Record<string, unknown> | undefined)?.time_session),
      contextConfidence: normalizeDistribution((value.regime_distribution as Record<string, unknown> | undefined)?.context_confidence),
    },
  };
}

function normalizeDistribution(value: unknown): BetaDiagnosticDistribution[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map((row) => ({
      label: readText(row.label) || "unknown",
      count: readNumber(row.count),
      share: readOptionalNumber(row.share) ?? 0,
    }));
}

function normalizeNumberMap(value: unknown) {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, current]) => [
      key,
      readNumber(current),
    ]),
  );
}

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readOptionalNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

function humanize(value: string) {
  const normalized = value.trim().replaceAll("_", " ");

  if (!normalized) {
    return "";
  }

  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
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
