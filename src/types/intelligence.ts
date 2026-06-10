export type Direction = "Bullish" | "Bearish" | "Neutral";

export type MarketRanking = {
  rank: number;
  symbol: string;
  market: string;
  consistencyScore: number;
  regime: string;
  direction: Direction;
  rankingReason: string;
  priceChangePct: number | null;
  realizedVolatilityPct: number | null;
  trendStrengthPct: number | null;
  fundingRate: number | null;
  scannedAt: string;
  scanBatchId: string | null;
  lastPrice: number | null;
  quoteVolume: number | null;
  rangePct: number | null;
  longShortBalance: number | null;
  orderValid: boolean | null;
};

export type FreshnessStatus = {
  label: string;
  timestamp: string | null;
  ageMinutes: number | null;
  isFresh: boolean | null;
};

export type MarketSummary = {
  totalMarkets: number;
  topSymbol: string;
  topScore: number;
  lastUpdatedAt: string;
  freshness: FreshnessStatus[];
};

export type LabDecision = {
  symbol: string;
  selectedSide: string;
  decisionType: string;
  reason: string;
  signalStatus: string;
  rewardRisk: number | null;
  setupKey: string;
  observedAt: string;
  scanBatchId: string | null;
  setupKeyVersion: string | null;
  environment: string | null;
  directionHint: string | null;
  capitalProfile: string | null;
  operatingCapital: number | null;
  autoEntryEnabled: boolean | null;
  autoExitEnabled: boolean | null;
  takeProfitPct: number | null;
  stopLossPct: number | null;
  takeProfitUsdt: number | null;
  stopLossUsdt: number | null;
  leverage: number | null;
  oracleRecommendation: string | null;
  trendAlignmentLabel: string | null;
  trendSupportsDirection: boolean | null;
};

export type SetupMemory = {
  setupKey: string;
  symbol: string;
  side: string;
  environment: string | null;
  capitalProfile: string | null;
  lane: string | null;
  tradeCount: number | null;
  winCount: number | null;
  winRate: number | null;
  healthScore: number | null;
  healthLabel: string;
  pnlTotal: number | null;
  averagePnl: number | null;
  averagePnlPct: number | null;
  averageCapitalReference: number | null;
  averageHoldTicks: number | null;
  averageWinPnl: number | null;
  averageLossAbs: number | null;
  lastRealizedPnl: number | null;
  lastRealizedPnlPct: number | null;
  cooldownMultiplier: number | null;
  suggestedTakeProfitUsdt: number | null;
  suggestedStopLossUsdt: number | null;
  lastCloseReason: string | null;
  summaryText: string;
  lastSeenAt: string;
  lastSymbol: string;
  lastSide: string;
  lastObservedAt: string;
};

export type GhostTrackingRecord = {
  rejectionReason: string;
  rejectionReasonLabel: string;
  totalCount: number | null;
  settledCount: number | null;
  settledPositiveCount: number | null;
  averageHypotheticalPnlPct: number | null;
  profitFactor: number | null;
};

export type GhostThresholdSimulation = {
  threshold: number;
  includedCount: number;
  positiveCount: number;
  positiveRate: number;
  avgHypotheticalPnlPct: number;
  grossWinsPct: number;
  grossLossesPct: number;
  profitFactor: number;
  maxDrawdownPct: number;
  variance: number;
  avgMaePct: number;
};

export type GhostTracking = {
  pendingCount: number | null;
  settledCount: number | null;
  positiveRate: number | null;
  averageHypotheticalPnlPct: number | null;
  averageMfePct: number | null;
  averageMaePct: number | null;
  lastSettledAt: string | null;
  records: GhostTrackingRecord[];
  rrThresholdSimulation: GhostThresholdSimulation[];
};

export type BetaScannerDetail = {
  symbol: string;
  rank: number;
  consistencyScore: number;
  scanBatchId: string | null;
  lastPrice: number | null;
  quoteVolume: number | null;
  rangePct: number | null;
  longShortBalance: number | null;
  orderValid: boolean | null;
  rankingReason: string;
  priceChangePct: number | null;
  trendStrengthPct: number | null;
  realizedVolatilityPct: number | null;
  fundingRate: number | null;
  scannedAt: string;
};

export type BetaDecisionContext = {
  symbol: string;
  selectedSide: string;
  decisionType: string;
  reason: string;
  signalStatus: string;
  rewardRisk: number | null;
  setupKey: string;
  observedAt: string;
  scanBatchId: string | null;
  setupKeyVersion: string | null;
  environment: string | null;
  directionHint: string | null;
  capitalProfile: string | null;
  operatingCapital: number | null;
  autoEntryEnabled: boolean | null;
  autoExitEnabled: boolean | null;
  takeProfitPct: number | null;
  stopLossPct: number | null;
  takeProfitUsdt: number | null;
  stopLossUsdt: number | null;
  leverage: number | null;
  oracleRecommendation: string | null;
  trendAlignmentLabel: string | null;
  trendSupportsDirection: boolean | null;
};

export type BetaDiagnosticDistribution = {
  label: string;
  count: number;
  share: number;
};

export type BetaDiagnosticSeries = {
  label: string;
  count: number;
};

export type BetaLiveInsights = {
  scannerDetails: BetaScannerDetail[];
  decisionContext: BetaDecisionContext[];
  setupDepth: SetupMemory[];
  ghostOutcomes: GhostTracking;
  diagnostics: {
    windowCycles: number;
    windowHours: number;
    totalCandidates: number;
    totalEligible: number;
    avgCandidatesPerCycle: number;
    avgEligiblePerCycle: number;
    eligibleCycleRate: number;
    candidateReadyCycleRate: number;
    expectedCandidateReadyPerDay: number;
    expectedEligibleCyclesPerDay: number;
    hoursSinceEligibleSetup: number | null;
    opportunityStarvation: {
      hoursSinceEligibleSetup: number | null;
      isStarved: boolean;
    };
    filterSurvival: {
      postTimeContext: number;
      postEma: number;
      postRr: number;
      eligible: number;
    };
    funnelIncrementalSurvival: BetaDiagnosticSeries[];
    dominantRejectionReason: string | null;
    rejectionCounts: Record<string, number>;
    rejectionCombinations: BetaDiagnosticSeries[];
    regimeDistribution: {
      trendAlignment: BetaDiagnosticDistribution[];
      regimeBias: BetaDiagnosticDistribution[];
      timeSession: BetaDiagnosticDistribution[];
      contextConfidence: BetaDiagnosticDistribution[];
    };
  };
  fieldInventory: {
    scanner: string[];
    decision: string[];
    setup: string[];
    ghost: string[];
    diagnostics: string[];
  };
  missingFields: string[];
};

export type IntelligenceBriefItem = {
  label: string;
  value: string;
  detail: string;
};

export type IntelligenceBrief = {
  headline: string;
  items: IntelligenceBriefItem[];
};

export type ChangeAwarenessItem = {
  label: string;
  statement: string;
  detail: string;
};

export type ChangeAwareness = {
  currentWindow: string;
  baselineWindow: string;
  items: ChangeAwarenessItem[];
};

export type OpportunityRanking = {
  symbol: string;
  label: string;
  edgeScore: number;
  confidence: number;
  horizon: string;
};

export type PatternDiscovery = {
  id: string;
  name: string;
  occurrences: number;
  winRate: number;
  markets: string[];
};

export type RegimeAnalysis = {
  regime: string;
  description: string;
  probability: number;
  volatility: "Low" | "Medium" | "High";
};

export type IntelligenceSnapshot = {
  generatedAt: string;
  changeAwareness: ChangeAwareness;
  intelligenceBrief: IntelligenceBrief;
  labDecisions: LabDecision[];
  marketSummary: MarketSummary;
  marketRankings: MarketRanking[];
  setupMemory: SetupMemory[];
  ghostTracking: GhostTracking;
  betaLiveInsights: BetaLiveInsights | null;
  opportunityRankings: OpportunityRanking[];
  patternDiscovery: PatternDiscovery[];
  regimeAnalysis: RegimeAnalysis[];
};
