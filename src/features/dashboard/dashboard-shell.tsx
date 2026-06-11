import { AppSidebar } from "@/components/layout/app-sidebar";
import { PublicDemoBanner } from "@/components/layout/public-demo-banner";
import { TopBar } from "@/components/layout/top-bar";
import { ChangeAwareness } from "@/features/dashboard/change-awareness";
import { FreshnessStrip } from "@/features/dashboard/freshness-strip";
import { GhostTracking } from "@/features/dashboard/ghost-tracking";
import { IntelligenceBrief } from "@/features/dashboard/intelligence-brief";
import { MarketSummaryCards } from "@/features/dashboard/market-summary-cards";
import { MarketRankings } from "@/features/dashboard/market-rankings";
import { BetaResearchLayer } from "@/features/dashboard/beta-research-layer";
import { OpportunityRankings } from "@/features/dashboard/opportunity-rankings";
import { RankingExplanation } from "@/features/dashboard/ranking-explanation";
import { RecentLabDecisions } from "@/features/dashboard/recent-lab-decisions";
import { SetupMemory } from "@/features/dashboard/setup-memory";
import type { BetaSession } from "@/lib/beta-auth";
import type { Locale } from "@/lib/i18n";
import type { IntelligenceSnapshot } from "@/types/intelligence";

type DashboardShellProps = {
  locale: Locale;
  snapshot: IntelligenceSnapshot;
  betaResearchEnabled?: boolean;
  session?: BetaSession | null;
};

export function DashboardShell({
  locale,
  snapshot,
  betaResearchEnabled: sessionBetaResearchEnabled = false,
  session = null,
}: DashboardShellProps) {
  const betaLiveEnabled = Boolean(snapshot.betaLiveInsights);
  const showBetaResearchLayer = sessionBetaResearchEnabled && betaLiveEnabled;

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar locale={locale} betaLive={showBetaResearchLayer} />
      <div className="min-w-0 flex-1">
        <PublicDemoBanner locale={locale} betaLive={showBetaResearchLayer} />
        <TopBar
          generatedAt={snapshot.generatedAt}
          locale={locale}
          betaLive={showBetaResearchLayer}
          session={session}
        />
        <div className="space-y-5 p-4 lg:p-5">
          <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <IntelligenceBrief brief={snapshot.intelligenceBrief} locale={locale} />
            <ChangeAwareness changeAwareness={snapshot.changeAwareness} locale={locale} />
          </section>
          <section className="space-y-4">
            <MarketSummaryCards summary={snapshot.marketSummary} locale={locale} />
            <FreshnessStrip freshness={snapshot.marketSummary.freshness} locale={locale} />
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <MarketRankings rankings={snapshot.marketRankings} locale={locale} />
            <RankingExplanation
              lastUpdatedAt={snapshot.marketSummary.lastUpdatedAt}
              locale={locale}
            />
          </section>
          <RecentLabDecisions decisions={snapshot.labDecisions} locale={locale} />
          <SetupMemory records={snapshot.setupMemory} locale={locale} />
          <GhostTracking ghostTracking={snapshot.ghostTracking} locale={locale} />
          <section className="space-y-6">
            <OpportunityRankings rankings={snapshot.opportunityRankings} locale={locale} />
          </section>
          {showBetaResearchLayer ? (
            <BetaResearchLayer betaLive={snapshot.betaLiveInsights!} locale={locale} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
