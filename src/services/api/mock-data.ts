import type {
  OpportunityRanking,
  PatternDiscovery,
  RegimeAnalysis,
} from "@/types/intelligence";

export const mockOpportunityRankings: OpportunityRanking[] = [
  {
    symbol: "ES",
    label: "Opening range continuation",
    edgeScore: 8.7,
    confidence: 84,
    horizon: "Intraday",
  },
  {
    symbol: "NQ",
    label: "Breakout follow-through",
    edgeScore: 8.2,
    confidence: 79,
    horizon: "1-2 sessions",
  },
  {
    symbol: "CL",
    label: "Compression release",
    edgeScore: 7.4,
    confidence: 71,
    horizon: "Swing",
  },
];

export const mockPatternDiscovery: PatternDiscovery[] = [
  {
    id: "p-001",
    name: "High consistency trend day",
    occurrences: 126,
    winRate: 68,
    markets: ["ES", "NQ"],
  },
  {
    id: "p-002",
    name: "Failed auction reversal",
    occurrences: 84,
    winRate: 61,
    markets: ["CL", "GC"],
  },
  {
    id: "p-003",
    name: "Low volatility expansion",
    occurrences: 103,
    winRate: 64,
    markets: ["ES", "GC"],
  },
];

export const mockRegimeAnalysis: RegimeAnalysis[] = [
  {
    regime: "Momentum Expansion",
    description: "Directional participation is broadening across index futures.",
    probability: 72,
    volatility: "Medium",
  },
  {
    regime: "Volatility Compression",
    description: "Range contraction is visible in defensive futures markets.",
    probability: 46,
    volatility: "Low",
  },
  {
    regime: "Mean Reversion",
    description: "Energy markets show reduced follow-through after extremes.",
    probability: 58,
    volatility: "High",
  },
];
