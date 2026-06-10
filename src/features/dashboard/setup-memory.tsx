import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipLabel } from "@/components/ui/tooltip-label";
import { formatDate, formatNumber, getCopy, translateSide, type Locale } from "@/lib/i18n";
import { getDashboardHumanization } from "@/lib/dashboard-humanization";
import type { SetupMemory as SetupMemoryRecord } from "@/types/intelligence";

type SetupMemoryProps = {
  records: SetupMemoryRecord[];
  locale: Locale;
};

export function SetupMemory({ records, locale }: SetupMemoryProps) {
  const copy = getCopy(locale);
  const humanization = getDashboardHumanization(locale);

  return (
    <Card id="setup-memory">
      <CardHeader>
        <CardTitle>{copy.dashboard.setupMemory.title}</CardTitle>
        <CardDescription>{copy.dashboard.setupMemory.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {records.length === 0 ? (
          <div className="rounded-md border bg-background p-3 text-sm text-muted-foreground">
            {copy.dashboard.setupMemory.empty}
          </div>
        ) : (
          records.map((record) => (
            <article
              className="rounded-md border bg-background p-3"
              key={`${record.setupKey}-${record.symbol}-${record.side}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{record.symbol}</p>
                    <Badge tone="info">{translateSide(record.side, locale)}</Badge>
                    <Badge tone={getHealthTone(record.healthLabel)}>
                      {record.healthLabel}
                    </Badge>
                  </div>
                  <p className="mt-2 truncate text-xs text-muted-foreground">
                    {record.setupKey}
                  </p>
                  {record.summaryText ? (
                    <p className="mt-2 text-sm leading-5 text-foreground">
                      {record.summaryText}
                    </p>
                  ) : null}
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {formatDate(record.lastSeenAt, locale)}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {toMetric(copy.dashboard.setupMemory.metrics.trades, record.tradeCount, locale)}
                {toMetric(copy.dashboard.setupMemory.metrics.winRate, record.winRate, locale, "%")}
                {toMetric(
                  copy.dashboard.setupMemory.metrics.health,
                  record.healthScore,
                  locale,
                  "",
                  humanization.tooltips.healthScore,
                )}
                {toMetric(copy.dashboard.setupMemory.metrics.pnl, record.pnlTotal, locale)}
                {toMetric(copy.dashboard.setupMemory.metrics.averagePnl, record.averagePnl, locale)}
              </div>
            </article>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function getHealthTone(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("salud") || normalized.includes("fuerte")) {
    return "positive";
  }

  if (normalized.includes("fr") || normalized.includes("frag")) {
    return "warning";
  }

  return "neutral";
}

function toMetric(
  label: string,
  value: number | null,
  locale: Locale,
  suffix = "",
  tooltip?: string,
) {
  if (value === null) {
    return null;
  }

  const displayValue =
    suffix === "%" ? `${formatNumber(value * 100, locale)}${suffix}` : formatNumber(value, locale);

  return (
    <span className="rounded-md border px-2 py-1" key={label}>
      {tooltip ? (
        <TooltipLabel
          label={label}
          tooltip={tooltip}
          className="text-inherit"
          labelClassName="text-muted-foreground"
        />
      ) : (
        <span className="text-muted-foreground">{label}</span>
      )}{" "}
      {displayValue}
    </span>
  );
}
