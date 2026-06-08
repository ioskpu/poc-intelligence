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
  marketSummary: MarketSummary;
  marketRankings: MarketRanking[];
  opportunityRankings: OpportunityRanking[];
  patternDiscovery: PatternDiscovery[];
  regimeAnalysis: RegimeAnalysis[];
};
