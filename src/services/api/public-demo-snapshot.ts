import {
  mockOpportunityRankings,
  mockPatternDiscovery,
  mockRegimeAnalysis,
} from "@/services/api/mock-data";
import { createIntelligenceBrief } from "@/services/api/intelligence-brief";
import type {
  ChangeAwareness,
  GhostTracking,
  IntelligenceSnapshot,
  LabDecision,
  MarketRanking,
  MarketSummary,
  SetupMemory,
} from "@/types/intelligence";

const DEMO_TIMESTAMP = "2026-06-08T12:00:00.000Z";

export function createPublicDemoSnapshot(): IntelligenceSnapshot {
  const marketRankings = createMarketRankings();
  const marketSummary = createMarketSummary(marketRankings);
  const labDecisions = createLabDecisions();
  const setupMemory = createSetupMemory();
  const ghostTracking = createGhostTracking();
  const changeAwareness = createChangeAwareness();

  return {
    generatedAt: DEMO_TIMESTAMP,
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
    opportunityRankings: mockOpportunityRankings,
    patternDiscovery: mockPatternDiscovery,
    regimeAnalysis: mockRegimeAnalysis,
  };
}

function createMarketRankings(): MarketRanking[] {
  return [
    {
      rank: 1,
      symbol: "BTCUSDT",
      market: "Binance USDT Perpetual",
      consistencyScore: 94,
      regime: "Momentum Expansion",
      direction: "Bullish",
      rankingReason: "Broad participation, clean trend structure and strong follow-through.",
      priceChangePct: 2.8,
      realizedVolatilityPct: 1.9,
      trendStrengthPct: 7.2,
      fundingRate: 0.006,
      scannedAt: DEMO_TIMESTAMP,
    },
    {
      rank: 2,
      symbol: "ETHUSDT",
      market: "Binance USDT Perpetual",
      consistencyScore: 89,
      regime: "Trend Stabilization",
      direction: "Bullish",
      rankingReason: "Directional pressure remains elevated with improving consistency.",
      priceChangePct: 1.7,
      realizedVolatilityPct: 1.4,
      trendStrengthPct: 6.4,
      fundingRate: 0.003,
      scannedAt: DEMO_TIMESTAMP,
    },
    {
      rank: 3,
      symbol: "SOLUSDT",
      market: "Binance USDT Perpetual",
      consistencyScore: 82,
      regime: "Compression Release",
      direction: "Neutral",
      rankingReason: "Range compression is resolving after several quiet sessions.",
      priceChangePct: 1.1,
      realizedVolatilityPct: 2.3,
      trendStrengthPct: 4.9,
      fundingRate: -0.001,
      scannedAt: DEMO_TIMESTAMP,
    },
  ];
}

function createMarketSummary(rankings: MarketRanking[]): MarketSummary {
  return {
    totalMarkets: rankings.length,
    topSymbol: rankings[0]?.symbol ?? "None",
    topScore: rankings[0]?.consistencyScore ?? 0,
    lastUpdatedAt: DEMO_TIMESTAMP,
    freshness: [
      {
        label: "Scanner",
        timestamp: DEMO_TIMESTAMP,
        ageMinutes: 4,
        isFresh: true,
      },
      {
        label: "Decisions",
        timestamp: DEMO_TIMESTAMP,
        ageMinutes: 18,
        isFresh: true,
      },
      {
        label: "Observations",
        timestamp: DEMO_TIMESTAMP,
        ageMinutes: 22,
        isFresh: true,
      },
    ],
  };
}

function createLabDecisions(): LabDecision[] {
  return [
    {
      symbol: "BTCUSDT",
      selectedSide: "Long",
      decisionType: "Candidate Ready",
      reason: "Trend structure and liquidity supported a clean research setup.",
      signalStatus: "Signal OK",
      rewardRisk: 2.4,
      setupKey: "trend-continuation-long",
      observedAt: DEMO_TIMESTAMP,
    },
    {
      symbol: "ETHUSDT",
      selectedSide: "Long",
      decisionType: "Context Watch",
      reason: "Price action remained constructive but still needed confirmation.",
      signalStatus: "Unknown",
      rewardRisk: 1.8,
      setupKey: "momentum-follow-through",
      observedAt: DEMO_TIMESTAMP,
    },
    {
      symbol: "SOLUSDT",
      selectedSide: "Neutral",
      decisionType: "Rejected",
      reason: "Compression was present, but directional evidence was incomplete.",
      signalStatus: "Signal not OK",
      rewardRisk: 1.2,
      setupKey: "compression-release",
      observedAt: DEMO_TIMESTAMP,
    },
  ];
}

function createSetupMemory(): SetupMemory[] {
  return [
    {
      setupKey: "trend-continuation-long",
      symbol: "BTCUSDT",
      side: "Long",
      tradeCount: 128,
      winRate: 0.67,
      healthScore: 84,
      healthLabel: "Healthy",
      pnlTotal: 18.74,
      averagePnl: 0.146,
      summaryText:
        "Long trend continuation has remained the strongest historical structure.",
      lastSeenAt: DEMO_TIMESTAMP,
    },
    {
      setupKey: "momentum-follow-through",
      symbol: "ETHUSDT",
      side: "Long",
      tradeCount: 94,
      winRate: 0.61,
      healthScore: 76,
      healthLabel: "Stable",
      pnlTotal: 11.2,
      averagePnl: 0.119,
      summaryText:
        "Momentum follow-through stays active across several recent observations.",
      lastSeenAt: DEMO_TIMESTAMP,
    },
    {
      setupKey: "compression-release",
      symbol: "SOLUSDT",
      side: "Neutral",
      tradeCount: 52,
      winRate: 0.55,
      healthScore: 61,
      healthLabel: "Watch",
      pnlTotal: 4.91,
      averagePnl: 0.094,
      summaryText:
        "Compression release appears less consistent but still worth tracking.",
      lastSeenAt: DEMO_TIMESTAMP,
    },
  ];
}

function createGhostTracking(): GhostTracking {
  return {
    pendingCount: 2,
    settledCount: 84,
    positiveRate: 0.62,
    averageHypotheticalPnlPct: 0.38,
    averageMfePct: 1.42,
    averageMaePct: 0.77,
    lastSettledAt: DEMO_TIMESTAMP,
    records: [
      {
        rejectionReason: "crowded_longs",
        rejectionReasonLabel: "Crowded longs",
        totalCount: 31,
        settledCount: 29,
        settledPositiveCount: 18,
        averageHypotheticalPnlPct: 0.44,
        profitFactor: 1.41,
      },
      {
        rejectionReason: "weak_trend",
        rejectionReasonLabel: "Weak trend",
        totalCount: 27,
        settledCount: 26,
        settledPositiveCount: 15,
        averageHypotheticalPnlPct: 0.31,
        profitFactor: 1.18,
      },
      {
        rejectionReason: "high_volatility",
        rejectionReasonLabel: "High volatility",
        totalCount: 26,
        settledCount: 29,
        settledPositiveCount: 19,
        averageHypotheticalPnlPct: 0.39,
        profitFactor: 1.07,
      },
    ],
  };
}

function createChangeAwareness(): ChangeAwareness {
  return {
    currentWindow: "Last 24 hours",
    baselineWindow: "Previous 24 hours",
    items: [
      {
        label: "Ranking leader",
        statement: "BTCUSDT remains the highest-ranked market.",
        detail: "Leader score held near the top of the current observation set.",
      },
      {
        label: "Directional bias",
        statement: "Long-bias opportunities represented the larger share of scanner activity.",
        detail: "The current window shows more bullish than bearish observations.",
      },
      {
        label: "Research activity",
        statement: "Candidate Ready decisions were the most common recent research action.",
        detail: "Context Watch activity remained present but secondary.",
      },
      {
        label: "Ghost tracking",
        statement: "Ghost tracking positive rate improved relative to the previous window.",
        detail: "Rejected crowded-long candidates continued to show useful post-evaluation feedback.",
      },
    ],
  };
}
