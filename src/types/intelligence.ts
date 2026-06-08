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
};

export type SetupMemory = {
  setupKey: string;
  symbol: string;
  side: string;
  tradeCount: number | null;
  winRate: number | null;
  healthScore: number | null;
  healthLabel: string;
  pnlTotal: number | null;
  averagePnl: number | null;
  summaryText: string;
  lastSeenAt: string;
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

export type GhostTracking = {
  pendingCount: number | null;
  settledCount: number | null;
  positiveRate: number | null;
  averageHypotheticalPnlPct: number | null;
  averageMfePct: number | null;
  averageMaePct: number | null;
  lastSettledAt: string | null;
  records: GhostTrackingRecord[];
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
  intelligenceBrief: IntelligenceBrief;
  labDecisions: LabDecision[];
  marketSummary: MarketSummary;
  marketRankings: MarketRanking[];
  setupMemory: SetupMemory[];
  ghostTracking: GhostTracking;
  opportunityRankings: OpportunityRanking[];
  patternDiscovery: PatternDiscovery[];
  regimeAnalysis: RegimeAnalysis[];
};
