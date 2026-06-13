import { AppSidebar } from "@/components/layout/app-sidebar";
import { PublicDemoBanner } from "@/components/layout/public-demo-banner";
import { TopBar } from "@/components/layout/top-bar";
import { ChangeAwareness } from "@/features/dashboard/change-awareness";
import { FreshnessStrip } from "@/features/dashboard/freshness-strip";
import { GhostTracking } from "@/features/dashboard/ghost-tracking";
import { IntelligenceBrief } from "@/features/dashboard/intelligence-brief";
import { InsightCards } from "@/features/dashboard/insight-cards";
import { MarketSummaryCards } from "@/features/dashboard/market-summary-cards";
import { MarketRankings } from "@/features/dashboard/market-rankings";
import { BetaResearchLayer } from "@/features/dashboard/beta-research-layer";
import { OpportunityRankings } from "@/features/dashboard/opportunity-rankings";
import { RankingExplanation } from "@/features/dashboard/ranking-explanation";
import { RecentLabDecisions } from "@/features/dashboard/recent-lab-decisions";
import { SetupMemory } from "@/features/dashboard/setup-memory";
import { DashboardFeedbackController } from "@/features/feedback/feedback-prompt";
import { ProductAnalyticsTracker } from "@/features/product-analytics/product-analytics-tracker";
import type { BetaSession } from "@/lib/beta-auth";
import { getCopy, type Locale } from "@/lib/i18n";
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
  const copy = getCopy(locale);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <ProductAnalyticsTracker
        enabled={session?.account.status === "Active"}
        pageViewEvent="dashboard_view"
        pageViewMetadata={{ module: "dashboard" }}
        events={[
          {
            eventType: "awareness_view",
            selector: "#change-awareness",
            metadata: { module: "change-awareness" },
          },
          {
            eventType: "ranking_view",
            selector: "#markets",
            metadata: { module: "rankings", ranking: "market-rankings" },
          },
          {
            eventType: "setup_memory_view",
            selector: "#setup-memory",
            metadata: { module: "setup-memory" },
          },
          {
            eventType: "ghost_tracking_view",
            selector: "#ghost-tracking",
            metadata: { module: "ghost-tracking" },
          },
          {
            eventType: "ranking_view",
            selector: "#opportunities",
            metadata: { module: "rankings", ranking: "opportunity-rankings" },
          },
          {
            eventType: "beta_research_view",
            selector: "#beta-research-layer",
            metadata: { module: "beta-research", source: "beta-research" },
          },
        ]}
      />
      {session?.account.status === "Active" ? (
        <DashboardFeedbackController locale={locale} />
      ) : null}
      <AppSidebar locale={locale} betaLive={showBetaResearchLayer} />
      <div className="min-w-0 flex-1">
        <PublicDemoBanner locale={locale} betaLive={showBetaResearchLayer} />
        <TopBar
          generatedAt={snapshot.generatedAt}
          locale={locale}
          betaLive={showBetaResearchLayer}
          session={session}
        />
        <div className="space-y-8 p-4 lg:p-5">
          <FreshnessStrip freshness={snapshot.marketSummary.freshness} locale={locale} />
          
          <InsightCards snapshot={snapshot} locale={locale} />

          <section className="rounded-xl bg-gradient-to-br from-muted/40 to-transparent p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                {copy.dashboard.intelligenceBrief.title}
              </h1>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <IntelligenceBrief brief={snapshot.intelligenceBrief} locale={locale} />
              <ChangeAwareness changeAwareness={snapshot.changeAwareness} locale={locale} />
            </div>
          </section>

          <section className="space-y-5">
            <MarketSummaryCards summary={snapshot.marketSummary} locale={locale} />
            <RankingExplanation
              lastUpdatedAt={snapshot.marketSummary.lastUpdatedAt}
              locale={locale}
            />
            <MarketRankings rankings={snapshot.marketRankings} locale={locale} />
          </section>

          <Separator className="my-8" />

          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {locale === "es" ? "Análisis Profundo" : "Deep Analysis"}
              </h2>
            </div>
            <OpportunityRankings rankings={snapshot.opportunityRankings} locale={locale} />
            <GhostTracking ghostTracking={snapshot.ghostTracking} locale={locale} />
            <SetupMemory records={snapshot.setupMemory} locale={locale} />
            <RecentLabDecisions decisions={snapshot.labDecisions} locale={locale} />
            {showBetaResearchLayer ? (
              <BetaResearchLayer betaLive={snapshot.betaLiveInsights!} locale={locale} />
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}

function Separator({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-px w-full bg-border ${className}`}
    />
  );
}
