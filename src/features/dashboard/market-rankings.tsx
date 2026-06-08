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
                <TableHead>Symbol</TableHead>
                <TableHead>Market</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Regime</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((ranking) => (
                <TableRow key={ranking.symbol}>
                  <TableCell className="font-mono text-muted-foreground">
                    #{ranking.rank || "-"}
                  </TableCell>
                  <TableCell className="font-medium">{ranking.symbol}</TableCell>
                  <TableCell>{ranking.market}</TableCell>
                  <TableCell>{ranking.direction}</TableCell>
                  <TableCell>
                    <Badge tone={getDirectionTone(ranking.direction)}>
                      {ranking.regime}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {ranking.consistencyScore}
                  </TableCell>
                </TableRow>
              ))}
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
