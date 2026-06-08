import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCopy, translateVolatility, type Locale } from "@/lib/i18n";
import type { RegimeAnalysis as RegimeAnalysisType } from "@/types/intelligence";

type RegimeAnalysisProps = {
  regimes: RegimeAnalysisType[];
  locale: Locale;
};

export function RegimeAnalysis({ regimes, locale }: RegimeAnalysisProps) {
  const copy = getCopy(locale);

  return (
    <Card id="regimes">
      <CardHeader>
        <CardTitle>{copy.dashboard.regimeAnalysis.title}</CardTitle>
        <CardDescription>{copy.dashboard.regimeAnalysis.description}</CardDescription>
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
                {translateVolatility(regime.volatility, locale)}
              </Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {copy.dashboard.regimeAnalysis.probability} {regime.probability}%
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
