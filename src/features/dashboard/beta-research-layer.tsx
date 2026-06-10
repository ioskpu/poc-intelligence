import { Badge } from "@/components/ui/badge";
import { BetaLiveDepth } from "@/features/dashboard/beta-live-depth";
import { getCopy, type Locale } from "@/lib/i18n";
import type { BetaLiveInsights } from "@/types/intelligence";

type BetaResearchLayerProps = {
  betaLive: BetaLiveInsights;
  locale: Locale;
};

export function BetaResearchLayer({ betaLive, locale }: BetaResearchLayerProps) {
  const copy = getCopy(locale);

  if (!betaLive) {
    return null;
  }

  return (
    <section
      id="beta-research-layer"
      className="space-y-4 rounded-lg border border-dashed border-secondary/40 bg-secondary/5 p-4 lg:p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="info">{copy.dashboard.betaResearch.badge}</Badge>
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.dashboard.betaResearch.description}
        </p>
      </div>
      <BetaLiveDepth betaLive={betaLive} locale={locale} />
    </section>
  );
}
