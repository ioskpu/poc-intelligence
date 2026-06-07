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
          Futures markets ordered by current consistency score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Regime</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((ranking) => (
              <TableRow key={ranking.symbol}>
                <TableCell className="font-medium">{ranking.symbol}</TableCell>
                <TableCell>{ranking.market}</TableCell>
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
