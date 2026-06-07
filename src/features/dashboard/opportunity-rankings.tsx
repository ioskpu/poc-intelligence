import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OpportunityRanking } from "@/types/intelligence";

type OpportunityRankingsProps = {
  rankings: OpportunityRanking[];
};

export function OpportunityRankings({ rankings }: OpportunityRankingsProps) {
  return (
    <Card id="opportunities">
      <CardHeader>
        <CardTitle>Opportunity rankings</CardTitle>
        <CardDescription>
          Ranked statistical opportunities from the mock API layer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rankings.map((ranking) => (
          <article key={ranking.label} className="rounded-md border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">
                  {ranking.symbol} · {ranking.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Horizon: {ranking.horizon}
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
              Confidence {ranking.confidence}%
            </p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
