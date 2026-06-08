import { getChangeAwareness } from "@/services/api/change-awareness";
import { getGhostTrackingFromState } from "@/services/api/ghost-tracking";
import { createIntelligenceBrief } from "@/services/api/intelligence-brief";
import { getRecentLabDecisionsFromState } from "@/services/api/lab-decisions";
import {
  fetchFuturesDashboardState,
  getMarketRankingsFromState,
} from "@/services/api/market-rankings";
import { createPublicDemoSnapshot } from "@/services/api/public-demo-snapshot";
import { getSetupMemoryFromState } from "@/services/api/setup-memory";
import {
  mockOpportunityRankings,
  mockPatternDiscovery,
  mockRegimeAnalysis,
} from "@/services/api/mock-data";

export async function getIntelligenceSnapshot() {
  if (shouldUsePublicDemoSnapshot()) {
    return createPublicDemoSnapshot();
  }

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

function shouldUsePublicDemoSnapshot() {
  const baseUrl = process.env.FUTURES_LAB_API_BASE_URL?.trim();
  const apiKey = process.env.FUTURES_LAB_INTERNAL_API_KEY?.trim();
  const databaseUrl = process.env.FUTURES_LAB_DATABASE_URL?.trim();
  const dashboardStatePath =
    process.env.FUTURES_LAB_DASHBOARD_STATE_PATH?.trim();

  const hasAnyPrivateConfig =
    Boolean(baseUrl) ||
    Boolean(apiKey) ||
    Boolean(databaseUrl) ||
    Boolean(dashboardStatePath);

  if (!hasAnyPrivateConfig) {
    return true;
  }

  const hasAllPrivateConfig =
    Boolean(baseUrl) &&
    Boolean(apiKey) &&
    Boolean(databaseUrl) &&
    Boolean(dashboardStatePath);

  if (!hasAllPrivateConfig) {
    throw new Error(
      "Futures Lab live configuration is incomplete. Use demo mode or provide all private runtime variables.",
    );
  }

  return false;
}
