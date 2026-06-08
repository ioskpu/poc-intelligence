import type {
  GhostTracking,
  IntelligenceBrief,
  LabDecision,
  MarketRanking,
  MarketSummary,
  SetupMemory,
} from "@/types/intelligence";

type IntelligenceBriefInput = {
  ghostTracking: GhostTracking;
  labDecisions: LabDecision[];
  marketRankings: MarketRanking[];
  marketSummary: MarketSummary;
  setupMemory: SetupMemory[];
};

export function createIntelligenceBrief({
  ghostTracking,
  labDecisions,
  marketRankings,
  marketSummary,
  setupMemory,
}: IntelligenceBriefInput): IntelligenceBrief {
  const topMarket = marketRankings[0];
  const latestDecision = labDecisions[0];
  const topSetup = setupMemory[0];
  const topGhostRecord = ghostTracking.records[0];

  return {
    headline: createHeadline(topMarket, marketSummary),
    items: [
      {
        label: "Strongest market",
        value: topMarket?.symbol ?? "No market",
        detail: topMarket
          ? `${topMarket.consistencyScore}/100 scanner score. ${formatFreshness(marketSummary)}. ${topMarket.rankingReason || "No ranking reason provided."}`
          : "No current market ranking is available.",
      },
      {
        label: "Directional bias",
        value: topMarket?.direction ?? "Unknown",
        detail: topMarket
          ? `${topMarket.symbol} currently carries a ${topMarket.direction.toLowerCase()} observation with ${topMarket.regime.toLowerCase()} regime context.`
          : "No directional observation is available.",
      },
      {
        label: "Research activity",
        value: latestDecision?.symbol ?? "No recent decision",
        detail: latestDecision
          ? `${latestDecision.decisionType}: ${latestDecision.reason}`
          : "Futures Lab has not returned recent decision records.",
      },
      {
        label: "Setup memory",
        value: topSetup?.healthLabel ?? "No setup memory",
        detail: topSetup
          ? `${topSetup.symbol} ${topSetup.side} setup observed ${formatCount(topSetup.tradeCount)} times. ${topSetup.summaryText || topSetup.setupKey}`
          : "No setup memory records are available.",
      },
      {
        label: "Ghost tracking",
        value: topGhostRecord?.rejectionReasonLabel ?? "No ghost record",
        detail: topGhostRecord
          ? `${topGhostRecord.rejectionReasonLabel} has ${formatCount(topGhostRecord.settledCount)} settled post-evaluations.`
          : "No rejected-opportunity feedback is available.",
      },
    ],
  };
}

function createHeadline(
  topMarket: MarketRanking | undefined,
  marketSummary: MarketSummary,
) {
  if (!topMarket) {
    return "Futures Lab has no current ranked market observation.";
  }

  return `${topMarket.symbol} leads the current Futures Lab ranking at ${marketSummary.topScore}/100.`;
}

function formatCount(value: number | null) {
  if (value === null) {
    return "unknown";
  }

  return new Intl.NumberFormat("en").format(value);
}

function formatFreshness(marketSummary: MarketSummary) {
  const scanner = marketSummary.freshness.find(
    (status) => status.label === "Scanner",
  );

  if (!scanner) {
    return "Scanner freshness is unavailable";
  }

  if (scanner.isFresh === true) {
    return "Scanner data is fresh";
  }

  if (scanner.isFresh === false) {
    return "Scanner data is stale";
  }

  return "Scanner freshness is unknown";
}
