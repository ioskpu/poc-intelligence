import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCopy, type Locale } from "@/lib/i18n";
import type { OpportunityRanking } from "@/types/intelligence";

type OpportunityRankingsProps = {
  rankings: OpportunityRanking[];
  locale: Locale;
};

export function OpportunityRankings({ rankings, locale }: OpportunityRankingsProps) {
  const copy = getCopy(locale);

  return (
    <Card id="opportunities">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>{copy.dashboard.opportunityRankings.title}</CardTitle>
          <Badge tone="info">{copy.dashboard.opportunityRankings.badge}</Badge>
        </div>
        <CardDescription>{copy.dashboard.opportunityRankings.description}</CardDescription>
        <p className="text-xs leading-5 text-muted-foreground">
          {copy.dashboard.opportunityRankings.note}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {rankings.map((ranking) => (
          <article key={ranking.label} className="rounded-md border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="text-sm font-semibold"
                  data-analytics-module="rankings"
                  data-analytics-ranking="opportunity-rankings"
                  data-analytics-symbol={ranking.symbol}
                >
                  {ranking.symbol} · {ranking.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {copy.dashboard.opportunityRankings.horizon}: {ranking.horizon}
                </p>
              </div>
              <p className="text-lg font-semibold">{ranking.edgeScore.toFixed(1)}</p>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${ranking.confidence}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {copy.dashboard.opportunityRankings.confidence} {ranking.confidence}%
            </p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
