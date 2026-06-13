import { 
  Eye, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Target, 
  TrendingUp,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipLabel } from "@/components/ui/tooltip-label";
import { formatDate, formatNumber, formatUtcDate, getCopy, type Locale } from "@/lib/i18n";
import { getDashboardHumanization } from "@/lib/dashboard-humanization";
import { insufficientDataLabel } from "@/lib/observatory-empty-states";
import type { GhostTracking as GhostTrackingData } from "@/types/intelligence";
import { cn } from "@/lib/utils";

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

  const title = locale === "es" ? "Señales en Observación" : "Signals Under Observation";
  const subtitle = locale === "es" 
    ? "Patrones que el motor detectó pero que no cumplieron todos los criterios de entrada. Los monitoreamos para refinar la estrategia." 
    : "Patterns detected by the engine that did not meet all entry criteria. We monitor them to refine the strategy.";

  if (!hasGhostHistory && ghostTracking.records.length === 0) {
    return (
      <Card id="ghost-tracking" className="border-muted bg-muted/5">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-emerald-500/10 p-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {locale === "es" 
              ? "¡Todo claro! No hay señales ambiguas en observación en este momento." 
              : "All clear! There are no ambiguous signals under observation at this time."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="ghost-tracking" className="border-muted shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/5 pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary/70" />
            <CardTitle className="text-lg font-bold">
              <TooltipLabel
                label={title}
                tooltip={humanization.tooltips.ghostTracking}
                className="text-inherit"
                labelClassName="text-inherit"
              />
            </CardTitle>
          </div>
          <TooltipLabel
            label={<Info className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />}
            tooltip={subtitle}
          />
        </div>
        <CardDescription className="mt-1.5 text-xs leading-relaxed">
          {copy.dashboard.ghostTracking.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 border-b border-muted/40">
          {toSummaryMetric(copy.dashboard.ghostTracking.metrics.settled, hasGhostHistory ? ghostTracking.settledCount : null, locale, "", <CheckCircle2 className="h-3.5 w-3.5" />)}
          {toSummaryMetric(copy.dashboard.ghostTracking.metrics.pending, hasGhostHistory ? ghostTracking.pendingCount : null, locale, "", <Clock className="h-3.5 w-3.5" />)}
          {toSummaryMetric(copy.dashboard.ghostTracking.metrics.positiveRate, hasGhostHistory ? ghostTracking.positiveRate : null, locale, "%", <Target className="h-3.5 w-3.5" />)}
          {toSummaryMetric(
            copy.dashboard.ghostTracking.metrics.averageHypotheticalPnl,
            hasGhostHistory ? ghostTracking.averageHypotheticalPnlPct : null,
            locale,
            "%",
            <TrendingUp className="h-3.5 w-3.5" />
          )}
        </div>

        <div className="p-4 space-y-3">
          {ghostTracking.records.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-muted p-4 bg-muted/5 text-sm text-muted-foreground justify-center">
              <ShieldAlert className="h-4 w-4" />
              {copy.dashboard.ghostTracking.empty}
            </div>
          ) : (
            <div className="grid gap-3 xl:grid-cols-2">
              {ghostTracking.records.map((record) => (
                <article
                  className="group relative rounded-xl border border-muted bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
                  key={record.rejectionReason}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground/50" />
                        <h4 className="text-sm font-bold tracking-tight">
                          {record.rejectionReasonLabel}
                        </h4>
                      </div>
                      <p className="mt-1 truncate text-[11px] font-mono text-muted-foreground/70 bg-muted/30 w-fit px-1.5 rounded">
                        {record.rejectionReason}
                      </p>
                    </div>
                    {record.profitFactor !== null ? (
                      <Badge 
                        tone="neutral" 
                        className="shadow-none border-transparent py-0.5 px-2 bg-muted/50 text-[10px]"
                      >
                        <TooltipLabel
                          label="PF"
                          tooltip={humanization.tooltips.profitFactor}
                          className="text-inherit"
                          labelClassName="text-inherit font-bold"
                        />{" "}
                        {formatNumber(record.profitFactor, locale)}
                      </Badge>
                    ) : null}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {toRecordMetric(copy.dashboard.ghostTracking.metrics.total, record.totalCount, locale)}
                    {toRecordMetric(copy.dashboard.ghostTracking.metrics.settled, record.settledCount, locale)}
                    {toRecordMetric(copy.dashboard.ghostTracking.metrics.positive, record.settledPositiveCount, locale)}
                    {toRecordMetric(
                      copy.dashboard.ghostTracking.metrics.averageHypotheticalPnl,
                      record.averageHypotheticalPnlPct,
                      locale,
                      "%",
                      true
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {ghostTracking.lastSettledAt ? (
            <div className="flex items-center gap-1.5 pt-2 text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">
              <Clock className="h-3 w-3" />
              <span title={formatUtcDate(ghostTracking.lastSettledAt, locale)}>
                {copy.dashboard.ghostTracking.lastSettled}: {formatDate(ghostTracking.lastSettledAt, locale)}
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function toSummaryMetric(label: string, value: number | null, locale: Locale, suffix = "", icon?: React.ReactNode) {
  return (
    <div className="flex flex-col gap-1 p-4 bg-card/50" key={label}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        {icon}
        {label}
      </div>
      <p className="text-lg font-black tracking-tighter">
        {value === null ? (
          <span className="text-sm font-medium text-muted-foreground/50">{insufficientDataLabel(locale)}</span>
        ) : (
          formatMetricValue(value, locale, suffix)
        )}
      </p>
    </div>
  );
}

function toRecordMetric(label: string, value: number | null, locale: Locale, suffix = "", highlight = false) {
  if (value === null) {
    return null;
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-muted/50 px-2 py-1 text-[10px] font-medium transition-colors",
        highlight ? "bg-primary/5 border-primary/10 text-primary/80" : "bg-muted/10 text-muted-foreground/80"
      )} 
      key={label}
    >
      <span className="opacity-60">{label}:</span>
      <span className="font-bold">{formatMetricValue(value, locale, suffix)}</span>
    </div>
  );
}

function formatMetricValue(value: number, locale: Locale, suffix: string) {
  if (suffix === "%") {
    return `${formatNumber(value * 100, locale)}${suffix}`;
  }

  return formatNumber(value, locale);
}
