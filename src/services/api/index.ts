import { getMarketRankings } from "@/services/api/market-rankings";
import {
  mockOpportunityRankings,
  mockPatternDiscovery,
  mockRegimeAnalysis,
} from "@/services/api/mock-data";

export async function getIntelligenceSnapshot() {
  const marketRankings = await getMarketRankings();

  return {
    generatedAt: marketRankings.generatedAt,
    marketSummary: marketRankings.summary,
    marketRankings: marketRankings.rankings,
    opportunityRankings: mockOpportunityRankings,
    patternDiscovery: mockPatternDiscovery,
    regimeAnalysis: mockRegimeAnalysis,
  };
}
