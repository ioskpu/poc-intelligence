import { Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatUtcDate, getCopy, type Locale } from "@/lib/i18n";

type RankingExplanationProps = {
  lastUpdatedAt: string;
  locale: Locale;
};

export function RankingExplanation({ lastUpdatedAt, locale }: RankingExplanationProps) {
  const copy = getCopy(locale);

  return (
    <Card>
      <CardHeader>
        <Info className="h-5 w-5 text-secondary" aria-hidden="true" />
        <CardTitle>{copy.dashboard.rankingGuide.title}</CardTitle>
        <CardDescription>{copy.dashboard.rankingGuide.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
        <p>{copy.dashboard.rankingGuide.scoreNote}</p>
        <p>{copy.dashboard.rankingGuide.sourceNote}</p>
        <div className="rounded-md border bg-background p-3">
          <p className="text-xs uppercase tracking-wide">
            {copy.dashboard.rankingGuide.latestScan}
          </p>
          <p className="mt-1 text-foreground" title={formatUtcDate(lastUpdatedAt, locale)}>
            {formatDate(lastUpdatedAt, locale)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
