import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MarketSummaryCards } from "@/features/dashboard/market-summary-cards";
import { MarketRankings } from "@/features/dashboard/market-rankings";
import { OpportunityRankings } from "@/features/dashboard/opportunity-rankings";
import { PatternDiscovery } from "@/features/dashboard/pattern-discovery";
import { RankingExplanation } from "@/features/dashboard/ranking-explanation";
import { RegimeAnalysis } from "@/features/dashboard/regime-analysis";
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
        <div className="space-y-6 p-5">
          <MarketSummaryCards summary={snapshot.marketSummary} />
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <MarketRankings rankings={snapshot.marketRankings} />
            <RankingExplanation lastUpdatedAt={snapshot.marketSummary.lastUpdatedAt} />
          </section>
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
