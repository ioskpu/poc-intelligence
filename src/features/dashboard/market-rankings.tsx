import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatNumber,
  getCopy,
  translateDirection,
  type Locale,
} from "@/lib/i18n";
import type { MarketRanking } from "@/types/intelligence";

type MarketRankingsProps = {
  rankings: MarketRanking[];
  locale: Locale;
};

export function MarketRankings({ rankings, locale }: MarketRankingsProps) {
  const copy = getCopy(locale);

  return (
    <Card id="markets">
      <CardHeader>
        <CardTitle>{copy.dashboard.marketRankings.title}</CardTitle>
        <CardDescription>{copy.dashboard.marketRankings.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {rankings.length === 0 ? (
          <div className="rounded-md border bg-background p-6 text-sm text-muted-foreground">
            {copy.dashboard.marketRankings.empty}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[880px]">
            <TableHeader>
              <TableRow>
                <TableHead>{copy.dashboard.marketRankings.headers.rank}</TableHead>
                <TableHead>{copy.dashboard.marketRankings.headers.context}</TableHead>
                <TableHead>{copy.dashboard.marketRankings.headers.direction}</TableHead>
                <TableHead>{copy.dashboard.marketRankings.headers.regime}</TableHead>
                <TableHead>{copy.dashboard.marketRankings.headers.metrics}</TableHead>
                <TableHead className="text-right">
                  {copy.dashboard.marketRankings.headers.score}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((ranking) => {
                const metrics = getSupportingMetrics(ranking, locale, copy);

                return (
                  <TableRow key={ranking.symbol}>
                    <TableCell className="font-mono text-muted-foreground">
                      #{ranking.rank || "-"}
                    </TableCell>
                    <TableCell className="max-w-[340px]">
                      <div className="font-medium">{ranking.symbol}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {ranking.market}
                      </div>
                      {ranking.rankingReason ? (
                        <div className="mt-2 text-sm leading-5 text-foreground">
                          {ranking.rankingReason}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>{translateDirection(ranking.direction, locale)}</TableCell>
                    <TableCell>
                      <Badge tone={getDirectionTone(ranking.direction)}>
                        {ranking.regime}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {metrics.length > 0 ? (
                        <div className="flex max-w-[280px] flex-wrap gap-2">
                          {metrics.map((metric) => (
                            <span
                              className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground"
                              key={metric.label}
                            >
                              <span className="text-foreground">{metric.label}</span>{" "}
                              {metric.value}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {locale === "es" ? "Sin métricas" : "No metrics"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-lg font-semibold">
                      {formatNumber(ranking.consistencyScore, locale, {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getDirectionTone(direction: MarketRanking["direction"]) {
  if (direction === "Bullish") {
    return "positive";
  }

  if (direction === "Bearish") {
    return "warning";
  }

  return "neutral";
}

function getSupportingMetrics(
  ranking: MarketRanking,
  locale: Locale,
  copy: ReturnType<typeof getCopy>,
) {
  return [
    toMetric(copy.dashboard.marketRankings.metrics.change, ranking.priceChangePct, locale, "%"),
    toMetric(copy.dashboard.marketRankings.metrics.trend, ranking.trendStrengthPct, locale, "%"),
    toMetric(
      copy.dashboard.marketRankings.metrics.volatility,
      ranking.realizedVolatilityPct,
      locale,
      "%",
    ),
    toMetric(copy.dashboard.marketRankings.metrics.funding, ranking.fundingRate, locale),
  ].filter((metric): metric is { label: string; value: string } => metric !== null);
}

function toMetric(label: string, value: number | null, locale: Locale, suffix = "") {
  if (value === null) {
    return null;
  }

  return {
    label,
    value: `${formatNumber(value, locale)}${suffix}`,
  };
}
