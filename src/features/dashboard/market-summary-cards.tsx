import { Clock, Hash, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getCopy, type Locale } from "@/lib/i18n";
import { emptyHistoryLabel, formatDisplayText } from "@/lib/observatory-empty-states";
import type { MarketSummary } from "@/types/intelligence";

type MarketSummaryCardsProps = {
  summary: MarketSummary;
  locale: Locale;
};

export function MarketSummaryCards({ summary, locale }: MarketSummaryCardsProps) {
  const copy = getCopy(locale);
  const cards = [
    {
      label: copy.dashboard.marketSummary.marketsShown,
      value: summary.totalMarkets,
      icon: Hash,
    },
    {
      label: copy.dashboard.marketSummary.topSymbol,
      value: formatDisplayText(summary.topSymbol, locale, emptyHistoryLabel(locale)),
      icon: Star,
    },
    {
      label: copy.dashboard.marketSummary.topScore,
      value: summary.totalMarkets > 0 ? `${summary.topScore}` : "-",
      icon: TrendingUp,
    },
    {
      label: copy.dashboard.marketSummary.lastUpdated,
      value: formatDate(summary.lastUpdatedAt, locale),
      icon: Clock,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <card.icon className="h-4 w-4 text-secondary" aria-hidden="true" />
            </div>
            <p className="mt-2 truncate text-3xl font-semibold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
