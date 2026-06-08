import { Clock, Hash, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketSummary } from "@/types/intelligence";

type MarketSummaryCardsProps = {
  summary: MarketSummary;
};

export function MarketSummaryCards({ summary }: MarketSummaryCardsProps) {
  const cards = [
    {
      label: "Markets shown",
      value: summary.totalMarkets,
      icon: Hash,
    },
    {
      label: "Top ranked symbol",
      value: summary.topSymbol,
      icon: Star,
    },
    {
      label: "Top score",
      value: summary.totalMarkets > 0 ? `${summary.topScore}` : "-",
      icon: TrendingUp,
    },
    {
      label: "Last updated",
      value: formatDate(summary.lastUpdatedAt),
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
