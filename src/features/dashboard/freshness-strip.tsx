import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FreshnessStatus } from "@/types/intelligence";

type FreshnessStripProps = {
  freshness: FreshnessStatus[];
};

export function FreshnessStrip({ freshness }: FreshnessStripProps) {
  if (freshness.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="grid gap-2 p-3 md:grid-cols-3">
        {freshness.map((status) => (
          <div
            className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
            key={status.label}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium">{status.label}</div>
              <div className="truncate text-xs text-muted-foreground">
                {formatFreshness(status)}
              </div>
            </div>
            <Badge tone={getFreshnessTone(status.isFresh)}>
              {getFreshnessLabel(status.isFresh)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function getFreshnessTone(isFresh: boolean | null) {
  if (isFresh === true) {
    return "positive";
  }

  if (isFresh === false) {
    return "warning";
  }

  return "neutral";
}

function getFreshnessLabel(isFresh: boolean | null) {
  if (isFresh === true) {
    return "Fresh";
  }

  if (isFresh === false) {
    return "Stale";
  }

  return "Unknown";
}

function formatFreshness(status: FreshnessStatus) {
  const age =
    status.ageMinutes === null
      ? "age unavailable"
      : `${formatNumber(status.ageMinutes)} min old`;

  if (!status.timestamp) {
    return age;
  }

  return `${age} - ${formatDate(status.timestamp)}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
  }).format(value);
}
