import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipLabel } from "@/components/ui/tooltip-label";
import {
  formatDate,
  formatNumber,
  translateFreshnessLabel,
  type Locale,
} from "@/lib/i18n";
import { getDashboardHumanization } from "@/lib/dashboard-humanization";
import type { FreshnessStatus } from "@/types/intelligence";

type FreshnessStripProps = {
  freshness: FreshnessStatus[];
  locale: Locale;
};

export function FreshnessStrip({ freshness, locale }: FreshnessStripProps) {
  if (freshness.length === 0) {
    return null;
  }

  const humanization = getDashboardHumanization(locale);

  return (
    <Card>
      <CardContent className="grid gap-2 p-3 md:grid-cols-3">
        {freshness.map((status) => (
          <div
            className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
            key={status.label}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium">
                <TooltipLabel
                  label={translateFreshnessLabel(status.label, locale)}
                  tooltip={getFreshnessTooltip(status.label, humanization.tooltips)}
                  className="text-inherit"
                  labelClassName="text-inherit"
                />
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {formatFreshness(status, locale)}
              </div>
            </div>
            <Badge tone={getFreshnessTone(status.isFresh)}>
              {getFreshnessLabel(status.isFresh, locale)}
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

function getFreshnessLabel(isFresh: boolean | null, locale: Locale) {
  if (isFresh === true) {
    return locale === "es" ? "Reciente" : "Fresh";
  }

  if (isFresh === false) {
    return locale === "es" ? "Antiguo" : "Stale";
  }

  return locale === "es" ? "Sin estado" : "No status";
}

function formatFreshness(status: FreshnessStatus, locale: Locale) {
  const age =
    status.ageMinutes === null
      ? locale === "es"
        ? "edad no disponible"
        : "age unavailable"
      : `${formatNumber(status.ageMinutes, locale)} ${locale === "es" ? "min de antigüedad" : "min old"}`;

  if (!status.timestamp) {
    return age;
  }

  return `${age} - ${formatDate(status.timestamp, locale)}`;
}

function getFreshnessTooltip(label: string, tooltips: ReturnType<typeof getDashboardHumanization>["tooltips"]) {
  if (label === "Scanner") {
    return tooltips.freshnessScanner;
  }

  if (label === "Decisions") {
    return tooltips.freshnessDecisions;
  }

  return tooltips.freshnessObservations;
}
