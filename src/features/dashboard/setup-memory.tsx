import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SetupMemory as SetupMemoryRecord } from "@/types/intelligence";

type SetupMemoryProps = {
  records: SetupMemoryRecord[];
};

export function SetupMemory({ records }: SetupMemoryProps) {
  return (
    <Card id="setup-memory">
      <CardHeader>
        <CardTitle>Setup Memory</CardTitle>
        <CardDescription>
          Historical Futures Lab observations for recurring setup patterns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {records.length === 0 ? (
          <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
            No setup memory records are available from Futures Lab.
          </div>
        ) : (
          records.map((record) => (
            <article
              className="rounded-md border bg-background p-4"
              key={`${record.setupKey}-${record.symbol}-${record.side}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{record.symbol}</p>
                    <Badge tone="info">{record.side}</Badge>
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
                  {formatDate(record.lastSeenAt)}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {toMetric("Trades", record.tradeCount)}
                {toMetric("Win rate", record.winRate, "%")}
                {toMetric("Health", record.healthScore)}
                {toMetric("PnL", record.pnlTotal)}
                {toMetric("Avg PnL", record.averagePnl)}
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

function toMetric(label: string, value: number | null, suffix = "") {
  if (value === null) {
    return null;
  }

  const displayValue =
    suffix === "%" ? `${formatNumber(value * 100)}${suffix}` : formatNumber(value);

  return (
    <span className="rounded-md border px-2 py-1" key={label}>
      {label}: {displayValue}
    </span>
  );
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
