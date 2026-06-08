import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GhostTracking as GhostTrackingData } from "@/types/intelligence";

type GhostTrackingProps = {
  ghostTracking: GhostTrackingData;
};

export function GhostTracking({ ghostTracking }: GhostTrackingProps) {
  return (
    <Card id="ghost-tracking">
      <CardHeader>
        <CardTitle>Ghost Tracking</CardTitle>
        <CardDescription>
          Post-evaluation observations from rejected Futures Lab opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 md:grid-cols-4">
          {toSummaryMetric("Settled", ghostTracking.settledCount)}
          {toSummaryMetric("Pending", ghostTracking.pendingCount)}
          {toSummaryMetric("Positive rate", ghostTracking.positiveRate, "%")}
          {toSummaryMetric("Avg hypothetical PnL", ghostTracking.averageHypotheticalPnlPct, "%")}
        </div>
        {ghostTracking.records.length === 0 ? (
          <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
            No ghost tracking records are available from Futures Lab.
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {ghostTracking.records.map((record) => (
              <article
                className="rounded-md border bg-background p-4"
                key={record.rejectionReason}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {record.rejectionReasonLabel}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {record.rejectionReason}
                    </p>
                  </div>
                  {record.profitFactor !== null ? (
                    <Badge tone={getProfitFactorTone(record.profitFactor)}>
                      PF {formatNumber(record.profitFactor)}
                    </Badge>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {toRecordMetric("Total", record.totalCount)}
                  {toRecordMetric("Settled", record.settledCount)}
                  {toRecordMetric("Positive", record.settledPositiveCount)}
                  {toRecordMetric(
                    "Avg ghost PnL",
                    record.averageHypotheticalPnlPct,
                    "%",
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        {ghostTracking.lastSettledAt ? (
          <p className="text-xs text-muted-foreground">
            Last settled ghost: {formatDate(ghostTracking.lastSettledAt)}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function getProfitFactorTone(value: number) {
  if (value >= 1) {
    return "positive";
  }

  return "warning";
}

function toSummaryMetric(label: string, value: number | null, suffix = "") {
  return (
    <div className="rounded-md border bg-background p-3" key={label}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">
        {value === null ? "-" : formatMetricValue(value, suffix)}
      </p>
    </div>
  );
}

function toRecordMetric(label: string, value: number | null, suffix = "") {
  if (value === null) {
    return null;
  }

  return (
    <span className="rounded-md border px-2 py-1" key={label}>
      {label}: {formatMetricValue(value, suffix)}
    </span>
  );
}

function formatMetricValue(value: number, suffix: string) {
  if (suffix === "%") {
    return `${formatNumber(value * 100)}${suffix}`;
  }

  return formatNumber(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 4,
  }).format(value);
}
