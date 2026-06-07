import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RegimeAnalysis as RegimeAnalysisType } from "@/types/intelligence";

type RegimeAnalysisProps = {
  regimes: RegimeAnalysisType[];
};

export function RegimeAnalysis({ regimes }: RegimeAnalysisProps) {
  return (
    <Card id="regimes">
      <CardHeader>
        <CardTitle>Regime analysis</CardTitle>
        <CardDescription>
          Current market state estimates with probability and volatility context.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {regimes.map((regime) => (
          <article key={regime.regime} className="rounded-md border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{regime.regime}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {regime.description}
                </p>
              </div>
              <Badge tone={getVolatilityTone(regime.volatility)}>
                {regime.volatility}
              </Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Probability {regime.probability}%
            </p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

function getVolatilityTone(volatility: RegimeAnalysisType["volatility"]) {
  if (volatility === "High") {
    return "warning";
  }

  if (volatility === "Medium") {
    return "info";
  }

  return "neutral";
}
