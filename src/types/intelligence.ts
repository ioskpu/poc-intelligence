export type Direction = "Bullish" | "Bearish" | "Neutral";

export type MarketRanking = {
  rank: number;
  symbol: string;
  market: string;
  consistencyScore: number;
  regime: string;
  direction: Direction;
  scannedAt: string;
};

export type MarketSummary = {
  totalMarkets: number;
  topSymbol: string;
  topScore: number;
  lastUpdatedAt: string;
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
