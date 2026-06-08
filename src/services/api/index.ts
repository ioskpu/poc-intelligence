import { getGhostTracking } from "@/services/api/ghost-tracking";
import { getRecentLabDecisions } from "@/services/api/lab-decisions";
import { getMarketRankings } from "@/services/api/market-rankings";
import { getSetupMemory } from "@/services/api/setup-memory";
import {
  mockOpportunityRankings,
  mockPatternDiscovery,
  mockRegimeAnalysis,
} from "@/services/api/mock-data";

export async function getIntelligenceSnapshot() {
  const [marketRankings, labDecisions, setupMemory, ghostTracking] =
    await Promise.all([
    getMarketRankings(),
    getRecentLabDecisions(),
    getSetupMemory(),
    getGhostTracking(),
  ]);

  return {
    generatedAt: marketRankings.generatedAt,
    ghostTracking,
    labDecisions,
    marketSummary: marketRankings.summary,
    marketRankings: marketRankings.rankings,
    setupMemory,
    opportunityRankings: mockOpportunityRankings,
    patternDiscovery: mockPatternDiscovery,
    regimeAnalysis: mockRegimeAnalysis,
  };
}
