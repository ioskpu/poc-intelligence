import { getChangeAwareness } from "@/services/api/change-awareness";
import { getGhostTrackingFromState } from "@/services/api/ghost-tracking";
import { createIntelligenceBrief } from "@/services/api/intelligence-brief";
import { getRecentLabDecisionsFromState } from "@/services/api/lab-decisions";
import {
  fetchFuturesDashboardState,
  getMarketRankingsFromState,
} from "@/services/api/market-rankings";
import { getSetupMemoryFromState } from "@/services/api/setup-memory";
import {
  mockOpportunityRankings,
  mockPatternDiscovery,
  mockRegimeAnalysis,
} from "@/services/api/mock-data";

export async function getIntelligenceSnapshot() {
  const [dashboardState, changeAwareness] = await Promise.all([
    fetchFuturesDashboardState(),
    getChangeAwareness(),
  ]);
  const marketRankings = getMarketRankingsFromState(dashboardState);
  const labDecisions = getRecentLabDecisionsFromState(dashboardState);
  const setupMemory = getSetupMemoryFromState(dashboardState);
  const ghostTracking = getGhostTrackingFromState(dashboardState);

  return {
    changeAwareness,
    generatedAt: marketRankings.generatedAt,
    ghostTracking,
    intelligenceBrief: createIntelligenceBrief({
      ghostTracking,
      labDecisions,
      marketRankings: marketRankings.rankings,
      marketSummary: marketRankings.summary,
      setupMemory,
    }),
    labDecisions,
    marketSummary: marketRankings.summary,
    marketRankings: marketRankings.rankings,
    setupMemory,
    opportunityRankings: mockOpportunityRankings,
    patternDiscovery: mockPatternDiscovery,
    regimeAnalysis: mockRegimeAnalysis,
  };
}
