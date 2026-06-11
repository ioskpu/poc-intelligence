import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipLabel } from "@/components/ui/tooltip-label";
import { formatDate, formatNumber, formatUtcDate, getCopy, type Locale } from "@/lib/i18n";
import { getDashboardHumanization } from "@/lib/dashboard-humanization";
import { insufficientDataLabel } from "@/lib/observatory-empty-states";
import type { GhostTracking as GhostTrackingData } from "@/types/intelligence";

type GhostTrackingProps = {
  ghostTracking: GhostTrackingData;
  locale: Locale;
};

export function GhostTracking({ ghostTracking, locale }: GhostTrackingProps) {
  const copy = getCopy(locale);
  const humanization = getDashboardHumanization(locale);
  const hasGhostHistory =
    ghostTracking.records.length > 0 ||
    (ghostTracking.settledCount ?? 0) > 0 ||
    (ghostTracking.pendingCount ?? 0) > 0;

  return (
    <Card id="ghost-tracking">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <TooltipLabel
            label={copy.dashboard.ghostTracking.title}
            tooltip={humanization.tooltips.ghostTracking}
            className="text-inherit"
            labelClassName="text-inherit"
          />
        </CardTitle>
        <CardDescription>{copy.dashboard.ghostTracking.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {toSummaryMetric(copy.dashboard.ghostTracking.metrics.settled, hasGhostHistory ? ghostTracking.settledCount : null, locale)}
          {toSummaryMetric(copy.dashboard.ghostTracking.metrics.pending, hasGhostHistory ? ghostTracking.pendingCount : null, locale)}
          {toSummaryMetric(copy.dashboard.ghostTracking.metrics.positiveRate, hasGhostHistory ? ghostTracking.positiveRate : null, locale, "%")}
          {toSummaryMetric(
            copy.dashboard.ghostTracking.metrics.averageHypotheticalPnl,
            hasGhostHistory ? ghostTracking.averageHypotheticalPnlPct : null,
            locale,
            "%",
          )}
        </div>
        {ghostTracking.records.length === 0 ? (
          <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
            {copy.dashboard.ghostTracking.empty}
          </div>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {ghostTracking.records.map((record) => (
              <article
                className="rounded-md border bg-background p-3"
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
                      <TooltipLabel
                        label="PF"
                        tooltip={humanization.tooltips.profitFactor}
                        className="text-inherit"
                        labelClassName="text-inherit"
                      />{" "}
                      {formatNumber(record.profitFactor, locale)}
                    </Badge>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {toRecordMetric(copy.dashboard.ghostTracking.metrics.total, record.totalCount, locale)}
                  {toRecordMetric(copy.dashboard.ghostTracking.metrics.settled, record.settledCount, locale)}
                  {toRecordMetric(copy.dashboard.ghostTracking.metrics.positive, record.settledPositiveCount, locale)}
                  {toRecordMetric(
                    copy.dashboard.ghostTracking.metrics.averageHypotheticalPnl,
                    record.averageHypotheticalPnlPct,
                    locale,
                    "%",
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        {ghostTracking.lastSettledAt ? (
          <p
            className="text-xs text-muted-foreground"
            title={formatUtcDate(ghostTracking.lastSettledAt, locale)}
          >
            {copy.dashboard.ghostTracking.lastSettled}: {formatDate(ghostTracking.lastSettledAt, locale)}
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

function toSummaryMetric(label: string, value: number | null, locale: Locale, suffix = "") {
  return (
    <div className="rounded-md border bg-background p-3" key={label}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">
        {value === null ? insufficientDataLabel(locale) : formatMetricValue(value, locale, suffix)}
      </p>
    </div>
  );
}

function toRecordMetric(label: string, value: number | null, locale: Locale, suffix = "") {
  if (value === null) {
    return null;
  }

  return (
    <span className="rounded-md border px-2 py-1" key={label}>
      {label}: {formatMetricValue(value, locale, suffix)}
    </span>
  );
}

function formatMetricValue(value: number, locale: Locale, suffix: string) {
  if (suffix === "%") {
    return `${formatNumber(value * 100, locale)}${suffix}`;
  }

  return formatNumber(value, locale);
}
