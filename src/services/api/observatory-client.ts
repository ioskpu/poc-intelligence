import { createIntelligenceBrief } from "@/services/api/intelligence-brief";
import { createPublicDemoSnapshot } from "@/services/api/public-demo-snapshot";
import type {
  BetaDecisionContext,
  BetaDiagnosticDistribution,
  BetaDiagnosticSeries,
  BetaLiveInsights,
  BetaScannerDetail,
  ChangeAwareness,
  ChangeAwarenessItem,
  Direction,
  GhostTracking,
  IntelligenceSnapshot,
  LabDecision,
  MarketRanking,
  MarketSummary,
  OpportunityRanking,
  PatternDiscovery,
  RegimeAnalysis,
  SetupMemory,
} from "@/types/intelligence";

type ObservatorySnapshotSource = "gateway" | "demo";

type ObservatorySnapshotResolution = {
  snapshot: IntelligenceSnapshot;
  source: ObservatorySnapshotSource;
  fallbackReason: string | null;
  gatewayError: string | null;
};

type ObservatorySnapshotPayload = Record<string, unknown> & {
  generatedAt?: unknown;
  changeAwareness?: unknown;
  intelligenceBrief?: unknown;
  marketSummary?: unknown;
  marketRankings?: unknown;
  recentLabDecisions?: unknown;
  labDecisions?: unknown;
  setupMemory?: unknown;
  ghostTracking?: unknown;
  betaLiveInsights?: unknown;
  opportunityRankings?: unknown;
  patternDiscovery?: unknown;
  regimeAnalysis?: unknown;
};

type GatewayChangeAwareness = {
  currentWindow?: unknown;
  baselineWindow?: unknown;
  scannerLeaderChange?: unknown;
  directionBiasChange?: unknown;
  researchActivityChange?: unknown;
  ghostTrackingChange?: unknown;
  observations?: unknown;
};

const DEFAULT_REQUEST_TIMEOUT_MS = 60000;

export async function resolveObservatorySnapshot(): Promise<ObservatorySnapshotResolution> {
  const gatewayBaseUrl = readGatewayBaseUrl();

  if (!gatewayBaseUrl) {
    return {
      snapshot: createPublicDemoSnapshot(),
      source: "demo",
      fallbackReason: "POC_INTELLIGENCE_API_URL is not configured",
      gatewayError: null,
    };
  }

  try {
    const rawSnapshot = await fetchObservatorySnapshotFromGateway(gatewayBaseUrl);

    return {
      snapshot: normalizeObservatorySnapshot(rawSnapshot),
      source: "gateway",
      fallbackReason: null,
      gatewayError: null,
    };
  } catch (error) {
    return {
      snapshot: createPublicDemoSnapshot(),
      source: "demo",
      fallbackReason:
        error instanceof Error ? error.message : "Unknown observatory gateway error",
      gatewayError:
        error instanceof Error ? error.message : "Unknown observatory gateway error",
    };
  }
}

async function fetchObservatorySnapshotFromGateway(
  baseUrl: string,
): Promise<ObservatorySnapshotPayload> {
  const response = await fetch(new URL("/observatory/snapshot", baseUrl), {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(DEFAULT_REQUEST_TIMEOUT_MS),
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw createObservatoryGatewayError(payload, response.status);
  }

  if (!isRecord(payload)) {
    throw new Error("Observatory snapshot returned an invalid shape");
  }

  return payload as ObservatorySnapshotPayload;
}

function normalizeObservatorySnapshot(
  payload: ObservatorySnapshotPayload,
): IntelligenceSnapshot {
  const marketRankings = normalizeMarketRankings(payload.marketRankings);
  const marketSummary = normalizeMarketSummary(
    payload.marketSummary,
    marketRankings,
    payload.generatedAt,
  );
  const labDecisions = normalizeLabDecisions(payload.labDecisions ?? payload.recentLabDecisions);
  const setupMemory = normalizeSetupMemory(payload.setupMemory);
  const ghostTracking = normalizeGhostTracking(payload.ghostTracking);
  const changeAwareness = normalizeChangeAwareness(payload.changeAwareness);
  const betaLiveInsights = normalizeBetaLiveInsights(
    payload.betaLiveInsights,
    marketRankings,
    labDecisions,
    setupMemory,
    ghostTracking,
  );

  return {
    generatedAt: readTimestamp(payload.generatedAt) ?? marketSummary.lastUpdatedAt,
    changeAwareness,
    intelligenceBrief: createIntelligenceBrief({
      ghostTracking,
      labDecisions,
      marketRankings,
      marketSummary,
      setupMemory,
    }),
    labDecisions,
    marketSummary,
    marketRankings,
    setupMemory,
    ghostTracking,
    betaLiveInsights,
    opportunityRankings: normalizeOpportunityRankings(payload.opportunityRankings),
    patternDiscovery: normalizePatternDiscovery(payload.patternDiscovery),
    regimeAnalysis: normalizeRegimeAnalysis(payload.regimeAnalysis),
  };
}

function normalizeMarketRankings(value: unknown): MarketRanking[] {
  const rows = readArray(value);

  return rows.map((row, index) => {
    const record = readRecord(row);
    const score = normalizeScore(readNumber(record.score ?? record.consistencyScore));

    return {
      rank: readRank(record.rankPosition ?? record.rank ?? index + 1),
      symbol: readText(record.symbol) || "UNKNOWN",
      market: "Binance USDT Perpetual",
      consistencyScore: score,
      regime: humanizeRegime(readText(record.regimeBias ?? record.regime)),
      direction: mapDirection(readText(record.directionHint ?? record.direction)),
      rankingReason: readText(record.rankingReason ?? record.ranking_reason),
      priceChangePct: readOptionalNumber(record.priceChangePct ?? record.price_change_pct),
      realizedVolatilityPct: readOptionalNumber(
        record.realizedVolatilityPct ?? record.realized_volatility_pct,
      ),
      trendStrengthPct: readOptionalNumber(record.trendStrengthPct ?? record.trend_strength_pct),
      fundingRate: readOptionalNumber(record.fundingRate ?? record.funding_rate),
      scannedAt:
        readTimestamp(record.scannedAt ?? record.scanned_at) ??
        new Date(0).toISOString(),
      scanBatchId: readText(record.scanBatchId ?? record.scan_batch_id) || null,
      lastPrice: readOptionalNumber(record.lastPrice ?? record.last_price),
      quoteVolume: readOptionalNumber(record.quoteVolume ?? record.quote_volume),
      rangePct: readOptionalNumber(record.rangePct ?? record.range_pct),
      longShortBalance: readOptionalNumber(
        record.longShortBalance ?? record.long_short_balance,
      ),
      orderValid: readBoolean(record.orderValid ?? record.order_valid),
    };
  });
}

function normalizeMarketSummary(
  value: unknown,
  marketRankings: MarketRanking[],
  generatedAt: unknown,
): MarketSummary {
  const record = readRecord(value);
  const topRanking = marketRankings[0];
  const topScore = normalizeScore(
    readNumber(record.topRankedScore ?? record.topScore ?? topRanking?.consistencyScore),
  );
  const topSymbol =
    readText(record.topRankedSymbol ?? record.topSymbol ?? topRanking?.symbol) || "None";

  return {
    totalMarkets: readNumber(record.totalMarkets) ?? marketRankings.length,
    topSymbol,
    topScore,
    lastUpdatedAt:
      readTimestamp(record.lastUpdatedAt) ??
      readTimestamp(generatedAt) ??
      new Date(0).toISOString(),
    freshness: normalizeFreshness(record.freshness),
  };
}

function normalizeFreshness(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const record = readRecord(item);
        const label = readText(record.label);

        if (!label) {
          return null;
        }

        return {
          label,
          timestamp: readTimestamp(record.timestamp),
          ageMinutes: readNumber(record.ageMinutes ?? record.age_minutes),
          isFresh: readBoolean(record.isFresh ?? record.is_fresh),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }

  const record = readRecord(value);

  return [
    toFreshnessStatus("Scanner", firstFreshnessEntry(record, ["futuresScanner", "spotScanner", "spotRecentTrades"])),
    toFreshnessStatus("Decisions", firstFreshnessEntry(record, ["futuresLabDecision"])),
    toFreshnessStatus(
      "Observations",
      firstFreshnessEntry(record, ["futuresLabObservation", "futuresCandidatePromoter"]),
    ),
  ].filter((item) => item.timestamp !== null || item.ageMinutes !== null);
}

function firstFreshnessEntry(
  record: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> | null {
  for (const key of keys) {
    const entry = readRecord(record[key]);
    if (Object.keys(entry).length > 0) {
      return entry;
    }
  }

  return null;
}

function toFreshnessStatus(label: string, entry: Record<string, unknown> | null) {
  if (!entry) {
    return { label, timestamp: null, ageMinutes: null, isFresh: null };
  }

  return {
    label,
    timestamp: readTimestamp(entry.timestamp),
    ageMinutes: readNumber(entry.ageMinutes ?? entry.age_minutes),
    isFresh: readBoolean(entry.isFresh ?? entry.is_fresh),
  };
}

function normalizeLabDecisions(value: unknown): LabDecision[] {
  return readArray(value).map((item) => {
    const record = readRecord(item);
    const selectedSide = readText(record.selectedSide ?? record.selected_side) || "Neutral";
    const signalOk = readBoolean(record.signalOk ?? record.signal_ok);
    const signalStatus = normalizeSignalStatus(signalOk, record.signalStatus ?? record.signal_status);

    return {
      symbol: readText(record.symbol) || "UNKNOWN",
      selectedSide,
      decisionType: readText(record.decisionType ?? record.decision_type) || "Unknown",
      reason:
        readText(record.reasonLabel ?? record.reason_label) ||
        readText(record.reason ?? record.decision_reason) ||
        "No reason available",
      signalStatus,
      rewardRisk: readNumber(record.rewardRisk ?? record.estimatedRrRatio ?? record.estimated_rr_ratio),
      setupKey: readText(record.setupKey ?? record.setup_key) || "unknown",
      observedAt:
        readTimestamp(record.observedAt ?? record.observed_at) ??
        new Date(0).toISOString(),
      scanBatchId: readText(record.scanBatchId ?? record.scan_batch_id) || null,
      setupKeyVersion: readText(record.setupKeyVersion ?? record.setup_key_version) || null,
      environment: readText(record.environment) || null,
      directionHint: readText(record.directionHint ?? record.direction_hint) || null,
      capitalProfile: readText(record.capitalProfile ?? record.capital_profile) || null,
      operatingCapital: readNumber(record.operatingCapital ?? record.operating_capital),
      autoEntryEnabled: readBoolean(record.autoEntryEnabled ?? record.auto_entry_enabled),
      autoExitEnabled: readBoolean(record.autoExitEnabled ?? record.auto_exit_enabled),
      takeProfitPct: readNumber(record.takeProfitPct ?? record.take_profit_pct),
      stopLossPct: readNumber(record.stopLossPct ?? record.stop_loss_pct),
      takeProfitUsdt: readNumber(record.takeProfitUsdt ?? record.take_profit_usdt),
      stopLossUsdt: readNumber(record.stopLossUsdt ?? record.stop_loss_usdt),
      leverage: readNumber(record.leverage),
      oracleRecommendation: readText(record.oracleRecommendation ?? record.oracle_recommendation) || null,
      trendAlignmentLabel: readText(record.trendAlignmentLabel ?? record.trend_alignment_label) || null,
      trendSupportsDirection: readBoolean(
        record.trendSupportsDirection ?? record.trend_supports_direction,
      ),
    };
  });
}

function normalizeSetupMemory(value: unknown): SetupMemory[] {
  return readArray(value).map((item) => {
    const record = readRecord(item);
    const healthScore = normalizeHealthScore(
      readNumber(record.healthScore ?? record.health_score),
    );

    return {
      setupKey: readText(record.setupKey ?? record.setup_key) || "unknown",
      symbol: readText(record.symbol) || "UNKNOWN",
      side: readText(record.side) || "Neutral",
      environment: readText(record.environment) || null,
      capitalProfile: readText(record.capitalProfile ?? record.capital_profile) || null,
      lane: readText(record.lane) || null,
      tradeCount: readNumber(record.tradeCount ?? record.trade_count),
      winCount: readNumber(record.winCount ?? record.win_count),
      winRate: readNumber(record.winRate ?? record.win_rate),
      healthScore,
      healthLabel:
        readText(record.healthLabel ?? record.health_label) ||
        deriveHealthLabel(healthScore),
      pnlTotal: readNumber(record.pnlTotal ?? record.pnl_total),
      averagePnl: readNumber(record.averagePnl ?? record.avg_pnl),
      averagePnlPct: readNumber(record.averagePnlPct ?? record.avg_pnl_pct),
      averageCapitalReference: readNumber(
        record.averageCapitalReference ?? record.avg_capital_reference,
      ),
      averageHoldTicks: readNumber(record.averageHoldTicks ?? record.avg_hold_ticks),
      averageWinPnl: readNumber(record.averageWinPnl ?? record.avg_win_pnl),
      averageLossAbs: readNumber(record.averageLossAbs ?? record.avg_loss_abs),
      lastRealizedPnl: readNumber(record.lastRealizedPnl ?? record.last_realized_pnl),
      lastRealizedPnlPct: readNumber(record.lastRealizedPnlPct ?? record.last_realized_pnl_pct),
      cooldownMultiplier: readNumber(record.cooldownMultiplier ?? record.cooldown_multiplier),
      suggestedTakeProfitUsdt: readNumber(
        record.suggestedTakeProfitUsdt ?? record.suggested_take_profit_usdt,
      ),
      suggestedStopLossUsdt: readNumber(
        record.suggestedStopLossUsdt ?? record.suggested_stop_loss_usdt,
      ),
      lastCloseReason: readText(record.lastCloseReason ?? record.last_close_reason) || null,
      summaryText: readText(record.summaryText ?? record.summary_text) || "",
      lastSeenAt:
        readTimestamp(record.lastSeenAt ?? record.last_seen_at) ??
        readTimestamp(record.lastObservedAt ?? record.last_observed_at) ??
        new Date(0).toISOString(),
      lastSymbol: readText(record.lastSymbol ?? record.last_symbol) || readText(record.symbol) || "UNKNOWN",
      lastSide: readText(record.lastSide ?? record.last_side) || readText(record.side) || "Neutral",
      lastObservedAt:
        readTimestamp(record.lastObservedAt ?? record.last_observed_at) ??
        readTimestamp(record.lastSeenAt ?? record.last_seen_at) ??
        new Date(0).toISOString(),
    };
  });
}

function normalizeGhostTracking(value: unknown): GhostTracking {
  const record = readRecord(value);
  const reasonBreakdown = readArray(record.reasonBreakdown ?? record.reason_breakdown);
  const profitFactorByReason = readArray(
    record.profitFactorByReason ?? record.profit_factor_by_reason,
  );
  const rrThresholdSimulation = readArray(record.rrThresholdSimulation ?? record.rr_threshold_simulation);
  const profitFactorLookup = new Map<string, number>();

  profitFactorByReason.forEach((item) => {
    const itemRecord = readRecord(item);
    const gateReason = readText(itemRecord.gateReason ?? itemRecord.gate_reason);

    if (gateReason) {
      const profitFactor = readNumber(itemRecord.profitFactor ?? itemRecord.profit_factor);

      if (profitFactor !== null) {
        profitFactorLookup.set(gateReason, profitFactor);
      }
    }
  });

  return {
    pendingCount: readNumber(record.pendingCount ?? record.pending_count),
    settledCount: readNumber(record.settledCount ?? record.settled_count),
    positiveRate: readNumber(record.positiveRate ?? record.positive_rate),
    averageHypotheticalPnlPct: readNumber(
      record.avgHypotheticalPnlPct ?? record.averageHypotheticalPnlPct,
    ),
    averageMfePct: readNumber(record.avgMfePct ?? record.averageMfePct),
    averageMaePct: readNumber(record.avgMaePct ?? record.averageMaePct),
    lastSettledAt: readTimestamp(record.lastSettledAt ?? record.last_settled_at),
    records: reasonBreakdown.map((item) => {
      const itemRecord = readRecord(item);
      const gateReason = readText(itemRecord.gateReason ?? itemRecord.gate_reason) || "unknown";

      return {
        rejectionReason: gateReason,
        rejectionReasonLabel:
          readText(itemRecord.gateReasonLabel ?? itemRecord.gate_reason_label) || gateReason,
        totalCount: readNumber(itemRecord.totalCount ?? itemRecord.total_count),
        settledCount: readNumber(itemRecord.settledCount ?? itemRecord.settled_count),
        settledPositiveCount: readNumber(
          itemRecord.settledPositiveCount ?? itemRecord.settled_positive_count,
        ),
        averageHypotheticalPnlPct: readNumber(
          itemRecord.avgHypotheticalPnlPct ?? itemRecord.averageHypotheticalPnlPct,
        ),
        profitFactor: profitFactorLookup.get(gateReason) ?? null,
      };
    }),
    rrThresholdSimulation: rrThresholdSimulation.map((item) => {
      const itemRecord = readRecord(item);

      return {
        threshold: readNumber(itemRecord.threshold) ?? 0,
        includedCount: readNumber(itemRecord.includedCount ?? itemRecord.included_count) ?? 0,
        positiveCount: readNumber(itemRecord.positiveCount ?? itemRecord.positive_count) ?? 0,
        positiveRate: readNumber(itemRecord.positiveRate ?? itemRecord.positive_rate) ?? 0,
        avgHypotheticalPnlPct:
          readNumber(itemRecord.avgHypotheticalPnlPct ?? itemRecord.averageHypotheticalPnlPct) ?? 0,
        grossWinsPct: readNumber(itemRecord.grossWinsPct ?? itemRecord.gross_wins_pct) ?? 0,
        grossLossesPct: readNumber(itemRecord.grossLossesPct ?? itemRecord.gross_losses_pct) ?? 0,
        profitFactor: readNumber(itemRecord.profitFactor ?? itemRecord.profit_factor) ?? 0,
        maxDrawdownPct: readNumber(itemRecord.maxDrawdownPct ?? itemRecord.max_drawdown_pct) ?? 0,
        variance: readNumber(itemRecord.variance) ?? 0,
        avgMaePct: readNumber(itemRecord.avgMaePct ?? itemRecord.averageMaePct) ?? 0,
      };
    }),
  };
}

function normalizeChangeAwareness(value: unknown): ChangeAwareness {
  const record = readRecord(value) as GatewayChangeAwareness;
  const scannerLeaderChange = readRecord(record.scannerLeaderChange);
  const directionBiasChange = readRecord(record.directionBiasChange);
  const researchActivityChange = readRecord(record.researchActivityChange);
  const ghostTrackingChange = readRecord(record.ghostTrackingChange);

  return {
    currentWindow: "Last 24 hours",
    baselineWindow: "Previous 24 hours",
    items: [
      toChangeAwarenessItem("Ranking leader", scannerLeaderChange, buildLeaderStatement),
      toChangeAwarenessItem("Directional bias", directionBiasChange, buildBiasStatement),
      toChangeAwarenessItem("Research activity", researchActivityChange, buildActivityStatement),
      toChangeAwarenessItem("Ghost tracking", ghostTrackingChange, buildGhostStatement),
    ].filter((item): item is ChangeAwarenessItem => item !== null),
  };
}

function toChangeAwarenessItem(
  label: string,
  record: Record<string, unknown>,
  buildStatement: (record: Record<string, unknown>) => { statement: string; detail: string },
): ChangeAwarenessItem | null {
  if (Object.keys(record).length === 0) {
    return null;
  }

  const { statement, detail } = buildStatement(record);

  return { label, statement, detail };
}

function buildLeaderStatement(record: Record<string, unknown>) {
  const current = readRecord(record.current);
  const baseline = readRecord(record.baseline);
  const currentSymbol = readText(current.symbol);
  const baselineSymbol = readText(baseline.symbol);
  const headline = readText(record.headline);

  return {
    statement: headline || currentSymbol || "Ranking leader updated.",
    detail:
      currentSymbol && baselineSymbol && currentSymbol !== baselineSymbol
        ? `${currentSymbol} replaced ${baselineSymbol} as the highest-ranked market.`
        : currentSymbol
          ? `${currentSymbol} remains the highest-ranked market.`
          : "Leader comparison is unavailable.",
  };
}

function buildBiasStatement(record: Record<string, unknown>) {
  const current = readRecord(record.current);
  const baseline = readRecord(record.baseline);
  const currentBias = readText(current.bias);
  const baselineBias = readText(baseline.bias);
  const headline = readText(record.headline);

  return {
    statement:
      headline ||
      (currentBias ? `${formatBias(currentBias)} is currently dominant.` : "Directional bias changed."),
    detail:
      currentBias && baselineBias
        ? `Current window: ${formatCount(readNumber(current.longCount))} long and ${formatCount(readNumber(current.shortCount))} short observations. Previous window was ${formatBias(baselineBias).toLowerCase()}.`
        : "Directional bias comparison is unavailable.",
  };
}

function buildActivityStatement(record: Record<string, unknown>) {
  const current = readRecord(record.current);
  const baseline = readRecord(record.baseline);
  const currentType = humanizeDecisionType(readText(current.dominantDecisionType));
  const baselineType = humanizeDecisionType(readText(baseline.dominantDecisionType));
  const headline = readText(record.headline);

  return {
    statement: headline || currentType || "Research activity updated.",
    detail:
      currentType && baselineType
        ? `Current window leader: ${currentType}. Previous window leader: ${baselineType}.`
        : "Research activity comparison is unavailable.",
  };
}

function buildGhostStatement(record: Record<string, unknown>) {
  const current = readRecord(record.current);
  const baseline = readRecord(record.baseline);
  const headline = readText(record.headline);

  return {
    statement: headline || "Ghost tracking updated.",
    detail:
      `Current positive rate: ${formatPercent(readNumber(current.positiveRate))}. ` +
      `Previous positive rate: ${formatPercent(readNumber(baseline.positiveRate))}.`,
  };
}

function normalizeBetaLiveInsights(
  value: unknown,
  marketRankings: MarketRanking[],
  labDecisions: LabDecision[],
  setupMemory: SetupMemory[],
  ghostTracking: GhostTracking,
): BetaLiveInsights {
  const record = readRecord(value);
  const diagnosticContext = readRecord(record.diagnosticContext);

  return {
    scannerDetails: marketRankings.map(toBetaScannerDetail),
    decisionContext: labDecisions.map(toBetaDecisionContext),
    setupDepth: setupMemory,
    ghostOutcomes: ghostTracking,
    diagnostics: normalizeDiagnostics(diagnosticContext),
    fieldInventory: {
      scanner: buildFieldInventory([
        "symbol",
        "rank",
        "consistencyScore",
        "lastPrice",
        "quoteVolume",
        "rangePct",
        "priceChangePct",
        "trendStrengthPct",
        "realizedVolatilityPct",
        "fundingRate",
      ]),
      decision: buildFieldInventory([
        "decisionType",
        "selectedSide",
        "signalStatus",
        "reason",
        "rewardRisk",
        "setupKey",
        "trendAlignmentLabel",
        "trendSupportsDirection",
      ]),
      setup: buildFieldInventory([
        "setupKey",
        "symbol",
        "side",
        "winRate",
        "healthScore",
        "summaryText",
        "tradeCount",
        "pnlTotal",
        "averagePnlPct",
        "lastCloseReason",
      ]),
      ghost: buildFieldInventory([
        "pendingCount",
        "settledCount",
        "positiveRate",
        "lastSettledAt",
        "averageHypotheticalPnlPct",
        "reasonBreakdown",
        "profitFactorByReason",
      ]),
      diagnostics: buildFieldInventory([
        "opportunityStarvation",
        "dominantRejectionReason",
        "candidateReadyCycleRate",
        "eligibleCycleRate",
        "totalCandidates",
        "totalEligible",
        "expectedCandidateReadyPerDay",
        "expectedEligibleCyclesPerDay",
        "windowCycles",
        "windowHours",
        "filterSurvival",
        "rejectionCombinations",
        "regimeDistribution",
      ]),
    },
    missingFields: Array.isArray(record.missingFields)
      ? record.missingFields.filter((item): item is string => typeof item === "string")
      : [],
  };
}

function toBetaScannerDetail(ranking: MarketRanking): BetaScannerDetail {
  return {
    symbol: ranking.symbol,
    rank: ranking.rank,
    consistencyScore: ranking.consistencyScore,
    scanBatchId: ranking.scanBatchId,
    lastPrice: ranking.lastPrice,
    quoteVolume: ranking.quoteVolume,
    rangePct: ranking.rangePct,
    longShortBalance: ranking.longShortBalance,
    orderValid: ranking.orderValid,
    rankingReason: ranking.rankingReason,
    priceChangePct: ranking.priceChangePct,
    trendStrengthPct: ranking.trendStrengthPct,
    realizedVolatilityPct: ranking.realizedVolatilityPct,
    fundingRate: ranking.fundingRate,
    scannedAt: ranking.scannedAt,
  };
}

function toBetaDecisionContext(decision: LabDecision): BetaDecisionContext {
  return {
    symbol: decision.symbol,
    selectedSide: decision.selectedSide,
    decisionType: decision.decisionType,
    reason: decision.reason,
    signalStatus: decision.signalStatus,
    rewardRisk: decision.rewardRisk,
    setupKey: decision.setupKey,
    observedAt: decision.observedAt,
    scanBatchId: decision.scanBatchId,
    setupKeyVersion: decision.setupKeyVersion,
    environment: decision.environment,
    directionHint: decision.directionHint,
    capitalProfile: decision.capitalProfile,
    operatingCapital: decision.operatingCapital,
    autoEntryEnabled: decision.autoEntryEnabled,
    autoExitEnabled: decision.autoExitEnabled,
    takeProfitPct: decision.takeProfitPct,
    stopLossPct: decision.stopLossPct,
    takeProfitUsdt: decision.takeProfitUsdt,
    stopLossUsdt: decision.stopLossUsdt,
    leverage: decision.leverage,
    oracleRecommendation: decision.oracleRecommendation,
    trendAlignmentLabel: decision.trendAlignmentLabel,
    trendSupportsDirection: decision.trendSupportsDirection,
  };
}

function normalizeDiagnostics(value: Record<string, unknown>): BetaLiveInsights["diagnostics"] {
  const visible = readArray(value.visible);
  const advanced = readArray(value.advanced);

  const opportunityStarvation = readRecord(readFieldValue(visible, "opportunity_starvation"));
  const dominantRejectionReason = readText(readFieldValue(visible, "dominant_rejection_reason"));
  const filterSurvival = readRecord(readFieldValue(advanced, "filter_survival"));
  const regimeDistribution = readRecord(readFieldValue(advanced, "regime_distribution"));
  const windowCycles = readNumber(readFieldValue(advanced, "window_cycles")) ?? 0;
  const totalCandidates = readNumber(readFieldValue(advanced, "total_candidates")) ?? 0;
  const totalEligible = readNumber(readFieldValue(advanced, "total_eligible")) ?? 0;

  return {
    windowCycles,
    windowHours: readNumber(readFieldValue(advanced, "window_hours")) ?? 0,
    totalCandidates,
    totalEligible,
    avgCandidatesPerCycle: windowCycles > 0 ? totalCandidates / windowCycles : 0,
    avgEligiblePerCycle: windowCycles > 0 ? totalEligible / windowCycles : 0,
    eligibleCycleRate: readNumber(readFieldValue(advanced, "eligible_cycle_rate")) ?? 0,
    candidateReadyCycleRate: readNumber(readFieldValue(advanced, "candidate_ready_cycle_rate")) ?? 0,
    expectedCandidateReadyPerDay:
      readNumber(readFieldValue(advanced, "expected_candidate_ready_per_day")) ?? 0,
    expectedEligibleCyclesPerDay:
      readNumber(readFieldValue(advanced, "expected_eligible_cycles_per_day")) ?? 0,
    hoursSinceEligibleSetup: readNumber(
      readValueRecord(opportunityStarvation, "hours_since_eligible_setup"),
    ),
    opportunityStarvation: {
      hoursSinceEligibleSetup: readNumber(
        readValueRecord(opportunityStarvation, "hours_since_eligible_setup"),
      ),
      isStarved: readBoolean(readValueRecord(opportunityStarvation, "is_starved")) ?? false,
    },
    filterSurvival: {
      postTimeContext: readNumber(readValueRecord(filterSurvival, "post_time_context")) ?? 0,
      postEma: readNumber(readValueRecord(filterSurvival, "post_ema")) ?? 0,
      postRr: readNumber(readValueRecord(filterSurvival, "post_rr")) ?? 0,
      eligible: readNumber(readValueRecord(filterSurvival, "eligible")) ?? 0,
    },
    funnelIncrementalSurvival: normalizeSeriesArray(readArray(readFieldValue(advanced, "rejection_combinations"))),
    dominantRejectionReason,
    rejectionCounts: normalizeRejectionCounts(readArray(readFieldValue(advanced, "rejection_combinations"))),
    rejectionCombinations: normalizeSeriesArray(readArray(readFieldValue(advanced, "rejection_combinations"))),
    regimeDistribution: {
      trendAlignment: normalizeDistributionArray(readValueRecord(regimeDistribution, "trend_alignment")),
      regimeBias: normalizeDistributionArray(readValueRecord(regimeDistribution, "regime_bias")),
      timeSession: normalizeDistributionArray(readValueRecord(regimeDistribution, "time_session")),
      contextConfidence: normalizeDistributionArray(readValueRecord(regimeDistribution, "context_confidence")),
    },
  };
}

function normalizeSeriesArray(value: unknown): BetaDiagnosticSeries[] {
  return readArray(value).map((item) => {
    const record = readRecord(item);
    return {
      label: readText(record.label) || "unknown",
      count: readNumber(record.count) ?? 0,
    };
  });
}

function normalizeDistributionArray(value: unknown): BetaDiagnosticDistribution[] {
  return readArray(value).map((item) => {
    const record = readRecord(item);
    return {
      label: readText(record.label) || "unknown",
      count: readNumber(record.count) ?? 0,
      share: readNumber(record.share) ?? 0,
    };
  });
}

function normalizeRejectionCounts(value: unknown): Record<string, number> {
  const counts: Record<string, number> = {};

  readArray(value).forEach((item) => {
    const record = readRecord(item);
    const label = readText(record.label);
    const count = readNumber(record.count);

    if (label && count !== null) {
      counts[label] = count;
    }
  });

  return counts;
}

function normalizeOpportunityRankings(value: unknown): OpportunityRanking[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const record = readRecord(item);
    return {
      symbol: readText(record.symbol) || "UNKNOWN",
      label: readText(record.label ?? record.name) || "Opportunity",
      edgeScore: readNumber(record.edgeScore ?? record.score) ?? 0,
      confidence: readNumber(record.confidence ?? record.confidenceScore) ?? 0,
      horizon: readText(record.horizon ?? record.timeframe) || "Unknown",
    };
  });
}

function normalizePatternDiscovery(value: unknown): PatternDiscovery[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const record = readRecord(item);
    return {
      id: readText(record.id) || "unknown",
      name: readText(record.name) || "Pattern",
      occurrences: readNumber(record.occurrences) ?? 0,
      winRate: readNumber(record.winRate ?? record.win_rate) ?? 0,
      markets: readArray(record.markets).map((market) => readText(market) || "UNKNOWN"),
    };
  });
}

function normalizeRegimeAnalysis(value: unknown): RegimeAnalysis[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const record = readRecord(item);
    return {
      regime: readText(record.regime) || "Unknown",
      description: readText(record.description) || "",
      probability: readNumber(record.probability) ?? 0,
      volatility: normalizeVolatility(readText(record.volatility)),
    };
  });
}

function readGatewayBaseUrl() {
  const value = process.env.POC_INTELLIGENCE_API_URL?.trim();

  if (!value) {
    return null;
  }

  return value.replace(/\/+$/, "");
}

function readTimestamp(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function readOptionalNumber(value: unknown) {
  return readNumber(value);
}

function readBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "y"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "n"].includes(normalized)) {
      return false;
    }
  }

  return null;
}

function readText(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function readRank(value: unknown) {
  const rank = readNumber(value);

  return rank === null ? 0 : Math.max(0, Math.round(rank));
}

function readArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function readRecord(value: unknown) {
  return isRecord(value) ? value : {};
}

function readFieldValue(entries: unknown[], field: string) {
  for (const entry of entries) {
    const record = readRecord(entry);
    if (readText(record.field) === field) {
      return record.value;
    }
  }

  return null;
}

function readValueRecord(value: unknown, key: string) {
  return readRecord(value)[key];
}

function normalizeScore(value: number | null) {
  if (value === null) {
    return 0;
  }

  if (value >= 0 && value <= 1) {
    return value * 100;
  }

  return value;
}

function normalizeHealthScore(value: number | null) {
  if (value === null) {
    return null;
  }

  if (value >= 0 && value <= 1) {
    return value * 100;
  }

  return value;
}

function humanizeRegime(value: string) {
  if (!value) {
    return "Unknown";
  }

  if (value === "neutral") {
    return "Neutral";
  }

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (part) => part.toUpperCase());
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

function normalizeSignalStatus(value: boolean | null, rawStatus: unknown) {
  const textStatus = readText(rawStatus);

  if (textStatus) {
    return textStatus;
  }

  if (value === true) {
    return "Signal OK";
  }

  if (value === false) {
    return "Signal not OK";
  }

  return "Unknown";
}

function deriveHealthLabel(value: number | null) {
  if (value === null) {
    return "Unknown";
  }

  if (value >= 70) {
    return "Healthy";
  }

  if (value >= 35) {
    return "Watch";
  }

  return "Fragile";
}

function normalizeVolatility(value: string) {
  if (value === "High" || value === "Medium" || value === "Low") {
    return value;
  }

  if (!value) {
    return "Low";
  }

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (part) => part.toUpperCase()) as "Low" | "Medium" | "High";
}

function buildFieldInventory(fields: string[]) {
  return fields;
}

function formatBias(value: string) {
  if (value === "long") {
    return "Long-bias opportunities";
  }

  if (value === "short") {
    return "Short-bias opportunities";
  }

  return "Balanced activity";
}

function humanizeDecisionType(value: string) {
  const normalized = value.trim().toLowerCase().replace(/[_-]+/g, " ");

  if (normalized === "auto entry disabled") {
    return "Auto entry disabled";
  }

  if (normalized === "candidate ready") {
    return "Candidate ready";
  }

  if (normalized === "context watch") {
    return "Context watch";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  return value;
}

function formatCount(value: number | null) {
  if (value === null) {
    return "unknown";
  }

  return new Intl.NumberFormat("en").format(value);
}

function formatPercent(value: number | null) {
  if (value === null) {
    return "unknown";
  }

  return `${new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(value * 100)}%`;
}

function createObservatoryGatewayError(payload: unknown, status: number) {
  const detailMessage = readObservatoryErrorMessage(payload, status);

  const error = new Error(detailMessage);
  error.name = "ObservatorySnapshotGatewayError";
  (error as Error & { status?: number }).status = status;
  return error;
}

function readObservatoryErrorMessage(payload: unknown, status: number) {
  if (isRecord(payload) && typeof payload.detail === "string") {
    return payload.detail;
  }

  if (isRecord(payload) && isRecord(payload.detail) && typeof payload.detail.reason === "string") {
    return payload.detail.reason;
  }

  if (isRecord(payload) && typeof payload.error === "string") {
    return payload.error;
  }

  return `Observatory snapshot request failed with status ${status}`;
}

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
