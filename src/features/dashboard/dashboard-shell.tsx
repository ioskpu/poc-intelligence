import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { MarketRankings } from "@/features/dashboard/market-rankings";
import { OpportunityRankings } from "@/features/dashboard/opportunity-rankings";
import { PatternDiscovery } from "@/features/dashboard/pattern-discovery";
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
          <section className="grid gap-4 md:grid-cols-4">
            <SummaryCard label="Markets ranked" value={snapshot.marketRankings.length} />
            <SummaryCard
              label="Top consistency"
              value={`${snapshot.marketRankings[0]?.consistencyScore ?? 0}%`}
            />
            <SummaryCard
              label="Opportunities"
              value={snapshot.opportunityRankings.length}
            />
            <SummaryCard label="Regimes tracked" value={snapshot.regimeAnalysis.length} />
          </section>
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <MarketRankings rankings={snapshot.marketRankings} />
            <OpportunityRankings rankings={snapshot.opportunityRankings} />
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            <PatternDiscovery patterns={snapshot.patternDiscovery} />
            <RegimeAnalysis regimes={snapshot.regimeAnalysis} />
          </section>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
