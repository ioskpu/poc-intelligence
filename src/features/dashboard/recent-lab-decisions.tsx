import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatDate,
  formatNumber,
  getCopy,
  translateSide,
  translateSignalStatus,
  type Locale,
} from "@/lib/i18n";
import type { LabDecision } from "@/types/intelligence";

type RecentLabDecisionsProps = {
  decisions: LabDecision[];
  locale: Locale;
};

export function RecentLabDecisions({ decisions, locale }: RecentLabDecisionsProps) {
  const copy = getCopy(locale);

  return (
    <Card id="lab-decisions">
      <CardHeader>
        <CardTitle>{copy.dashboard.recentDecisions.title}</CardTitle>
        <CardDescription>{copy.dashboard.recentDecisions.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {decisions.length === 0 ? (
          <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
            {copy.dashboard.recentDecisions.empty}
          </div>
        ) : (
          decisions.map((decision) => (
            <article
              className="rounded-md border bg-background p-3"
              key={`${decision.symbol}-${decision.observedAt}-${decision.decisionType}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{decision.symbol}</p>
                    <Badge tone="info">{translateSide(decision.selectedSide, locale)}</Badge>
                    <Badge tone={getSignalTone(decision.signalStatus)}>
                      {translateSignalStatus(decision.signalStatus, locale)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-foreground">
                    {decision.reason}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {formatDate(decision.observedAt, locale)}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border px-2 py-1">
                  {copy.dashboard.recentDecisions.fields.type}: {decision.decisionType}
                </span>
                {decision.rewardRisk !== null ? (
                  <span className="rounded-md border px-2 py-1">
                    {copy.dashboard.recentDecisions.fields.rr}: {formatNumber(decision.rewardRisk, locale, { maximumFractionDigits: 2 })}
                  </span>
                ) : null}
                {decision.setupKey ? (
                  <span className="max-w-full truncate rounded-md border px-2 py-1">
                    {copy.dashboard.recentDecisions.fields.setup}: {decision.setupKey}
                  </span>
                ) : null}
              </div>
            </article>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function getSignalTone(status: string) {
  if (status === "Signal OK") {
    return "positive";
  }

  if (status === "Signal not OK") {
    return "warning";
  }

  return "neutral";
}
