import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LabDecision } from "@/types/intelligence";

type RecentLabDecisionsProps = {
  decisions: LabDecision[];
};

export function RecentLabDecisions({ decisions }: RecentLabDecisionsProps) {
  return (
    <Card id="lab-decisions">
      <CardHeader>
        <CardTitle>Recent Lab Decisions</CardTitle>
        <CardDescription>
          Recent Futures Lab research activity from existing decision records.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {decisions.length === 0 ? (
          <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
            No recent lab decision records are available from Futures Lab.
          </div>
        ) : (
          decisions.map((decision) => (
            <article
              className="rounded-md border bg-background p-4"
              key={`${decision.symbol}-${decision.observedAt}-${decision.decisionType}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{decision.symbol}</p>
                    <Badge tone="info">{decision.selectedSide}</Badge>
                    <Badge tone={getSignalTone(decision.signalStatus)}>
                      {decision.signalStatus}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-foreground">
                    {decision.reason}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {formatDate(decision.observedAt)}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border px-2 py-1">
                  Type: {decision.decisionType}
                </span>
                {decision.rewardRisk !== null ? (
                  <span className="rounded-md border px-2 py-1">
                    R/R: {formatNumber(decision.rewardRisk)}
                  </span>
                ) : null}
                {decision.setupKey ? (
                  <span className="max-w-full truncate rounded-md border px-2 py-1">
                    Setup: {decision.setupKey}
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(value);
}
