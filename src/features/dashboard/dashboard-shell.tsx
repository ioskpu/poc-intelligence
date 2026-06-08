import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { ChangeAwareness } from "@/features/dashboard/change-awareness";
import { FreshnessStrip } from "@/features/dashboard/freshness-strip";
import { GhostTracking } from "@/features/dashboard/ghost-tracking";
import { IntelligenceBrief } from "@/features/dashboard/intelligence-brief";
import { MarketSummaryCards } from "@/features/dashboard/market-summary-cards";
import { MarketRankings } from "@/features/dashboard/market-rankings";
import { OpportunityRankings } from "@/features/dashboard/opportunity-rankings";
import { PatternDiscovery } from "@/features/dashboard/pattern-discovery";
import { RankingExplanation } from "@/features/dashboard/ranking-explanation";
import { RecentLabDecisions } from "@/features/dashboard/recent-lab-decisions";
import { RegimeAnalysis } from "@/features/dashboard/regime-analysis";
import { SetupMemory } from "@/features/dashboard/setup-memory";
import type { IntelligenceSnapshot } from "@/types/intelligence";

type DashboardShellProps = {
  snapshot: IntelligenceSnapshot;
};

export function DashboardShell({ snapshot }: DashboardShellProps) {
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <TopBar generatedAt={snapshot.generatedAt} />
        <div className="space-y-5 p-4 lg:p-5">
          <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <IntelligenceBrief brief={snapshot.intelligenceBrief} />
            <ChangeAwareness changeAwareness={snapshot.changeAwareness} />
          </section>
          <section className="space-y-4">
            <MarketSummaryCards summary={snapshot.marketSummary} />
            <FreshnessStrip freshness={snapshot.marketSummary.freshness} />
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <MarketRankings rankings={snapshot.marketRankings} />
            <RankingExplanation lastUpdatedAt={snapshot.marketSummary.lastUpdatedAt} />
          </section>
          <RecentLabDecisions decisions={snapshot.labDecisions} />
          <SetupMemory records={snapshot.setupMemory} />
          <GhostTracking ghostTracking={snapshot.ghostTracking} />
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <OpportunityRankings rankings={snapshot.opportunityRankings} />
            <PatternDiscovery patterns={snapshot.patternDiscovery} />
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            <RegimeAnalysis regimes={snapshot.regimeAnalysis} />
          </section>
        </div>
      </div>
    </main>
  );
}
