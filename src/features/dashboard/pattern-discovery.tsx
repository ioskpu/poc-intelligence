import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PatternDiscovery as PatternDiscoveryType } from "@/types/intelligence";

type PatternDiscoveryProps = {
  patterns: PatternDiscoveryType[];
};

export function PatternDiscovery({ patterns }: PatternDiscoveryProps) {
  return (
    <Card id="patterns">
      <CardHeader>
        <CardTitle>Pattern discovery</CardTitle>
        <CardDescription>
          Recurring outcomes discovered across historical Futures Lab data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {patterns.map((pattern) => (
          <article key={pattern.id} className="rounded-md border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{pattern.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {pattern.occurrences} occurrences
                </p>
              </div>
              <p className="text-sm font-semibold">{pattern.winRate}% win rate</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {pattern.markets.map((market) => (
                <Badge key={market} tone="info">
                  {market}
                </Badge>
              ))}
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
