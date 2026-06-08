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
import type { MarketRanking } from "@/types/intelligence";

type MarketRankingsProps = {
  rankings: MarketRanking[];
};

export function MarketRankings({ rankings }: MarketRankingsProps) {
  return (
    <Card id="markets">
      <CardHeader>
        <CardTitle>Market rankings</CardTitle>
        <CardDescription>
          Real Futures Lab scanner output ordered by rank.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rankings.length === 0 ? (
          <div className="rounded-md border bg-background p-6 text-sm text-muted-foreground">
            No market rankings are available yet. Futures Lab may still be
            waiting for its next scanner run.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Market context</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Regime</TableHead>
                <TableHead>Supporting metrics</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((ranking) => {
                const metrics = getSupportingMetrics(ranking);

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
                    <TableCell>{ranking.direction}</TableCell>
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
                        <span className="text-sm text-muted-foreground">No metrics</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-lg font-semibold">
                      {ranking.consistencyScore}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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

function getSupportingMetrics(ranking: MarketRanking) {
  return [
    toMetric("Change", ranking.priceChangePct, "%"),
    toMetric("Trend", ranking.trendStrengthPct, "%"),
    toMetric("Volatility", ranking.realizedVolatilityPct, "%"),
    toMetric("Funding", ranking.fundingRate, ""),
  ].filter((metric): metric is { label: string; value: string } => metric !== null);
}

function toMetric(label: string, value: number | null, suffix: string) {
  if (value === null) {
    return null;
  }

  return {
    label,
    value: `${formatNumber(value)}${suffix}`,
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 4,
  }).format(value);
}
