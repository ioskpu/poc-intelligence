import { getRecentLabDecisions } from "@/services/api/lab-decisions";
import { getMarketRankings } from "@/services/api/market-rankings";
import {
  mockOpportunityRankings,
  mockPatternDiscovery,
  mockRegimeAnalysis,
} from "@/services/api/mock-data";

export async function getIntelligenceSnapshot() {
  const [marketRankings, labDecisions] = await Promise.all([
    getMarketRankings(),
    getRecentLabDecisions(),
  ]);

  return {
    generatedAt: marketRankings.generatedAt,
    labDecisions,
    marketSummary: marketRankings.summary,
    marketRankings: marketRankings.rankings,
    opportunityRankings: mockOpportunityRankings,
    patternDiscovery: mockPatternDiscovery,
    regimeAnalysis: mockRegimeAnalysis,
  };
}
