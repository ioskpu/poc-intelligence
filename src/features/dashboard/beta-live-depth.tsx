import { ChevronDown, ChevronRight, Database } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber, type Locale, translateSide } from "@/lib/i18n";
import { getBetaLiveCopy } from "@/lib/beta-live-copy";
import type { BetaLiveInsights } from "@/types/intelligence";

type BetaLiveDepthProps = {
  betaLive: BetaLiveInsights;
  locale: Locale;
};

export function BetaLiveDepth({ betaLive, locale }: BetaLiveDepthProps) {
  const copy = getBetaLiveCopy(locale);

  if (!betaLive) {
    return null;
  }

  return (
    <section id="beta-live-depth" className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="info">
          <Database className="mr-1 h-3 w-3" aria-hidden="true" />
          {copy.title}
        </Badge>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>

      <div className="space-y-3">
        <BetaDetailsCard
          defaultOpen
          title={copy.sections.scanner.title}
          description={copy.sections.scanner.description}
        >
          {betaLive.scannerDetails.length === 0 ? (
            <EmptyState locale={locale} />
          ) : (
            <div className="space-y-3">
              {betaLive.scannerDetails.map((item) => (
                <article key={`${item.scanBatchId ?? "batch"}-${item.symbol}`} className="rounded-md border bg-background p-3">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        #{item.rank} {item.symbol}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {copy.fields.scanBatchId}: {item.scanBatchId ?? "-"}
                      </p>
                    </div>
                    <Badge tone={item.orderValid === false ? "warning" : item.orderValid === true ? "positive" : "neutral"}>
                      {item.orderValid === false
                        ? locale === "es"
                          ? "No válida"
                          : "Invalid"
                        : item.orderValid === true
                          ? locale === "es"
                            ? "Válida"
                            : "Valid"
                          : locale === "es"
                            ? "Desconocida"
                            : "Unknown"}
                    </Badge>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                    {renderMetric(copy.fields.lastPrice, item.lastPrice, locale)}
                    {renderMetric(copy.fields.quoteVolume, item.quoteVolume, locale)}
                    {renderMetric(copy.fields.rangePct, item.rangePct, locale, "%", false)}
                    {renderMetric(copy.fields.longShortBalance, item.longShortBalance, locale)}
                    {renderMetric(copy.fields.priceChangePct, item.priceChangePct, locale, "%", false)}
                    {renderMetric(copy.fields.trendStrengthPct, item.trendStrengthPct, locale, "%", false)}
                    {renderMetric(copy.fields.realizedVolatilityPct, item.realizedVolatilityPct, locale, "%", false)}
                    {renderMetric(copy.fields.fundingRate, item.fundingRate, locale)}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground">
                    {copy.fields.rankingReason}: {item.rankingReason || "-"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </BetaDetailsCard>

        <BetaDetailsCard
          defaultOpen
          title={copy.sections.decisions.title}
          description={copy.sections.decisions.description}
        >
          {betaLive.decisionContext.length === 0 ? (
            <EmptyState locale={locale} />
          ) : (
            <div className="space-y-3">
              {betaLive.decisionContext.map((item) => (
                <article key={`${item.symbol}-${item.observedAt}-${item.setupKey}`} className="rounded-md border bg-background p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.observedAt, locale)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="info">{translateSide(item.selectedSide, locale)}</Badge>
                      <Badge tone={item.signalStatus === "Signal OK" ? "positive" : item.signalStatus === "Signal not OK" ? "warning" : "neutral"}>
                        {item.signalStatus}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {item.reason}
                  </p>
                  <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {renderTextMetric(copy.fields.decisionType, item.decisionType)}
                    {renderTextMetric(copy.fields.environment, item.environment)}
                    {renderTextMetric(copy.fields.directionHint, item.directionHint)}
                    {renderTextMetric(copy.fields.setupKey, item.setupKey)}
                    {renderTextMetric(copy.fields.setupKeyVersion, item.setupKeyVersion)}
                    {renderTextMetric(copy.fields.capitalProfile, item.capitalProfile)}
                    {renderMetric(copy.fields.operatingCapital, item.operatingCapital, locale)}
                    {renderBooleanMetric(copy.fields.autoEntryEnabled, item.autoEntryEnabled, locale)}
                    {renderBooleanMetric(copy.fields.autoExitEnabled, item.autoExitEnabled, locale)}
                    {renderMetric(copy.fields.leverage, item.leverage, locale)}
                    {renderMetric(copy.fields.takeProfitPct, item.takeProfitPct, locale, "%", false)}
                    {renderMetric(copy.fields.stopLossPct, item.stopLossPct, locale, "%", false)}
                    {renderMetric(copy.fields.takeProfitUsdt, item.takeProfitUsdt, locale)}
                    {renderMetric(copy.fields.stopLossUsdt, item.stopLossUsdt, locale)}
                    {renderMetric(copy.fields.estimatedRrRatio, item.rewardRisk, locale)}
                    {renderTextMetric(copy.fields.scanBatchId, item.scanBatchId)}
                    {renderTextMetric(copy.fields.oracleRecommendation, item.oracleRecommendation)}
                    {renderTextMetric(copy.fields.trendAlignmentLabel, item.trendAlignmentLabel)}
                    {renderBooleanMetric(copy.fields.trendSupportsDirection, item.trendSupportsDirection, locale)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </BetaDetailsCard>

        <BetaDetailsCard
          defaultOpen
          title={copy.sections.setups.title}
          description={copy.sections.setups.description}
        >
          {betaLive.setupDepth.length === 0 ? (
            <EmptyState locale={locale} />
          ) : (
            <div className="grid gap-3 xl:grid-cols-2">
              {betaLive.setupDepth.map((item) => (
                <article key={`${item.setupKey}-${item.symbol}-${item.side}`} className="rounded-md border bg-background p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">{item.setupKey}</p>
                    </div>
                    <Badge tone={getHealthTone(item.healthLabel, locale)}>
                      {item.healthLabel}
                    </Badge>
                  </div>
                  {item.summaryText ? (
                    <p className="mt-2 text-sm leading-6 text-foreground">{item.summaryText}</p>
                  ) : null}
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {renderTextMetric(copy.fields.environment, item.environment)}
                    {renderTextMetric(copy.fields.capitalProfile, item.capitalProfile)}
                    {renderTextMetric(copy.fields.lane, item.lane)}
                    {renderMetric(copy.fields.tradeCount, item.tradeCount, locale)}
                    {renderMetric(copy.fields.winCount, item.winCount, locale)}
                    {renderMetric(copy.fields.winRate, item.winRate, locale, "%")}
                    {renderMetric(copy.fields.pnlTotal, item.pnlTotal, locale)}
                    {renderMetric(copy.fields.averagePnl, item.averagePnl, locale)}
                    {renderMetric(copy.fields.averagePnlPct, item.averagePnlPct, locale, "%")}
                    {renderMetric(copy.fields.averageCapitalReference, item.averageCapitalReference, locale)}
                    {renderMetric(copy.fields.averageHoldTicks, item.averageHoldTicks, locale)}
                    {renderMetric(copy.fields.averageWinPnl, item.averageWinPnl, locale)}
                    {renderMetric(copy.fields.averageLossAbs, item.averageLossAbs, locale)}
                    {renderMetric(copy.fields.lastRealizedPnl, item.lastRealizedPnl, locale)}
                    {renderMetric(copy.fields.lastRealizedPnlPct, item.lastRealizedPnlPct, locale, "%")}
                    {renderMetric(copy.fields.cooldownMultiplier, item.cooldownMultiplier, locale)}
                    {renderMetric(copy.fields.suggestedTakeProfitUsdt, item.suggestedTakeProfitUsdt, locale)}
                    {renderMetric(copy.fields.suggestedStopLossUsdt, item.suggestedStopLossUsdt, locale)}
                    {renderMetric(copy.fields.healthScore, item.healthScore, locale)}
                    {renderTextMetric(copy.fields.lastCloseReason, item.lastCloseReason)}
                    {renderTextMetric(copy.fields.lastObservedAt, formatDate(item.lastObservedAt, locale))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </BetaDetailsCard>

        <BetaDetailsCard
          title={copy.sections.ghosts.title}
          description={copy.sections.ghosts.description}
        >
          <div className="space-y-4">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {renderMetric(copy.fields.pendingCount, betaLive.ghostOutcomes.pendingCount, locale)}
              {renderMetric(copy.fields.settledCount, betaLive.ghostOutcomes.settledCount, locale)}
              {renderMetric(copy.fields.positiveRate, betaLive.ghostOutcomes.positiveRate, locale, "%")}
              {renderMetric(copy.fields.averageHypotheticalPnlPct, betaLive.ghostOutcomes.averageHypotheticalPnlPct, locale, "%")}
              {renderMetric(copy.fields.averageMfePct, betaLive.ghostOutcomes.averageMfePct, locale, "%")}
              {renderMetric(copy.fields.averageMaePct, betaLive.ghostOutcomes.averageMaePct, locale, "%")}
              {renderTextMetric(
                copy.fields.lastSettledAt,
                betaLive.ghostOutcomes.lastSettledAt
                  ? formatDate(betaLive.ghostOutcomes.lastSettledAt, locale)
                  : null,
              )}
            </div>
            {betaLive.ghostOutcomes.records.length === 0 ? (
              <EmptyState locale={locale} />
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {betaLive.ghostOutcomes.records.map((record) => (
                  <article key={record.rejectionReason} className="rounded-md border bg-background p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{record.rejectionReasonLabel}</p>
                        <p className="text-xs text-muted-foreground">{record.rejectionReason}</p>
                      </div>
                      {record.profitFactor !== null ? (
                        <Badge tone={record.profitFactor >= 1 ? "positive" : "warning"}>
                          PF {formatNumber(record.profitFactor, locale)}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {renderMetric(copy.fields.reasonBreakdown, record.totalCount, locale)}
                      {renderMetric(copy.fields.profitFactorByReason, record.profitFactor, locale)}
                      {renderMetric(copy.fields.averageHypotheticalPnlPct, record.averageHypotheticalPnlPct, locale, "%")}
                      {renderMetric(copy.fields.positiveCount, record.settledPositiveCount, locale)}
                    </div>
                  </article>
                ))}
              </div>
            )}
            {betaLive.ghostOutcomes.rrThresholdSimulation.length > 0 ? (
              <div className="overflow-x-auto rounded-md border bg-background">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="px-3 py-2">{copy.fields.threshold}</th>
                      <th className="px-3 py-2">{copy.fields.includedCount}</th>
                      <th className="px-3 py-2">{copy.fields.positiveCount}</th>
                      <th className="px-3 py-2">{copy.fields.positiveRate}</th>
                      <th className="px-3 py-2">{copy.fields.profitFactor}</th>
                      <th className="px-3 py-2">{copy.fields.maxDrawdownPct}</th>
                      <th className="px-3 py-2">{copy.fields.variance}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betaLive.ghostOutcomes.rrThresholdSimulation.map((row) => (
                      <tr key={row.threshold} className="border-b last:border-0">
                        <td className="px-3 py-2">{formatNumber(row.threshold, locale)}</td>
                        <td className="px-3 py-2">{formatNumber(row.includedCount, locale, { maximumFractionDigits: 0 })}</td>
                        <td className="px-3 py-2">{formatNumber(row.positiveCount, locale, { maximumFractionDigits: 0 })}</td>
                        <td className="px-3 py-2">{formatNumber(row.positiveRate * 100, locale, { maximumFractionDigits: 1 })}%</td>
                        <td className="px-3 py-2">{formatNumber(row.profitFactor, locale, { maximumFractionDigits: 2 })}</td>
                        <td className="px-3 py-2">{formatNumber(row.maxDrawdownPct, locale, { maximumFractionDigits: 2 })}%</td>
                        <td className="px-3 py-2">{formatNumber(row.variance, locale, { maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </BetaDetailsCard>

        <BetaDetailsCard
          title={copy.sections.diagnostics.title}
          description={copy.sections.diagnostics.description}
        >
          <div className="space-y-4">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {renderMetric(copy.fields.windowCycles, betaLive.diagnostics.windowCycles, locale, "", false)}
              {renderMetric(copy.fields.windowHours, betaLive.diagnostics.windowHours, locale, "", false)}
              {renderMetric(copy.fields.totalCandidates, betaLive.diagnostics.totalCandidates, locale, "", false)}
              {renderMetric(copy.fields.totalEligible, betaLive.diagnostics.totalEligible, locale, "", false)}
              {renderMetric(copy.fields.candidateReadyCycleRate, betaLive.diagnostics.candidateReadyCycleRate, locale, "%")}
              {renderMetric(copy.fields.eligibleCycleRate, betaLive.diagnostics.eligibleCycleRate, locale, "%")}
              {renderMetric(copy.fields.expectedCandidateReadyPerDay, betaLive.diagnostics.expectedCandidateReadyPerDay, locale, "", false)}
              {renderMetric(copy.fields.expectedEligibleCyclesPerDay, betaLive.diagnostics.expectedEligibleCyclesPerDay, locale, "", false)}
              {renderMetric(copy.fields.opportunityStarvation, betaLive.diagnostics.opportunityStarvation.hoursSinceEligibleSetup, locale)}
              {renderTextMetric(copy.fields.dominantRejectionReason, betaLive.diagnostics.dominantRejectionReason || "-")}
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <MetricList
                title={copy.fields.filterSurvival}
                items={[
                  { label: "post_time_context", count: betaLive.diagnostics.filterSurvival.postTimeContext },
                  { label: "post_ema", count: betaLive.diagnostics.filterSurvival.postEma },
                  { label: "post_rr", count: betaLive.diagnostics.filterSurvival.postRr },
                  { label: "eligible", count: betaLive.diagnostics.filterSurvival.eligible },
                ]}
                locale={locale}
              />
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <MetricList
                title={copy.fields.regimeDistribution}
                items={betaLive.diagnostics.regimeDistribution.trendAlignment}
                locale={locale}
              />
              <MetricList
                title={`${copy.fields.regimeDistribution} · Regime`}
                items={betaLive.diagnostics.regimeDistribution.regimeBias}
                locale={locale}
              />
              <MetricList
                title={`${copy.fields.regimeDistribution} · Session`}
                items={betaLive.diagnostics.regimeDistribution.timeSession}
                locale={locale}
              />
              <MetricList
                title={`${copy.fields.regimeDistribution} · Confidence`}
                items={betaLive.diagnostics.regimeDistribution.contextConfidence}
                locale={locale}
              />
            </div>
            {betaLive.diagnostics.funnelIncrementalSurvival.length > 0 ? (
              <div className="overflow-x-auto rounded-md border bg-background">
                <table className="min-w-[720px] w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="px-3 py-2">Stage</th>
                      <th className="px-3 py-2">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betaLive.diagnostics.funnelIncrementalSurvival.map((row) => (
                      <tr key={row.label} className="border-b last:border-0">
                        <td className="px-3 py-2">{row.label}</td>
                        <td className="px-3 py-2">{formatNumber(row.count, locale, { maximumFractionDigits: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </BetaDetailsCard>
      </div>
    </section>
  );
}

function BetaDetailsCard({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-lg border bg-card shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:hidden" aria-hidden="true" />
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground group-open:block" aria-hidden="true" />
            {title}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
      </summary>
      <div className="border-t px-4 py-4">{children}</div>
    </details>
  );
}

function MetricList({
  title,
  items,
  locale,
}: {
  title: string;
  items: Array<{ label: string; count: number; share?: number }>;
  locale: Locale;
}) {
  return (
    <article className="rounded-md border bg-background p-3">
      <p className="text-sm font-semibold">{title}</p>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {locale === "es" ? "Sin datos" : "No data"}
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {items.slice(0, 5).map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-muted-foreground">{item.label}</span>
              <span className="font-medium">
                {formatNumber(item.count, locale, { maximumFractionDigits: 0 })}
                {typeof item.share === "number" ? ` · ${formatNumber(item.share * 100, locale, { maximumFractionDigits: 1 })}%` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function EmptyState({ locale }: { locale: Locale }) {
  return (
    <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
      {locale === "es" ? "No hay datos beta live disponibles." : "No beta live data is available."}
    </div>
  );
}

function renderMetric(
  label: string,
  value: number | null,
  locale: Locale,
  suffix = "",
  multiplyPercent = suffix === "%",
) {
  if (value === null) {
    return null;
  }

  const formatted =
    suffix === "%"
      ? multiplyPercent
        ? `${formatNumber(value * 100, locale, { maximumFractionDigits: 2 })}%`
        : `${formatNumber(value, locale, { maximumFractionDigits: 2 })}%`
      : formatNumber(value, locale, { maximumFractionDigits: 4 });

  return (
    <div className="rounded-md border bg-background px-2 py-1 text-xs" key={label}>
      <span className="text-muted-foreground">{label}</span>{" "}
      <span className="font-medium text-foreground">{formatted}</span>
    </div>
  );
}

function renderTextMetric(label: string, value: string | null) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-md border bg-background px-2 py-1 text-xs" key={label}>
      <span className="text-muted-foreground">{label}</span>{" "}
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function renderBooleanMetric(label: string, value: boolean | null, locale: Locale) {
  if (value === null) {
    return null;
  }

  return (
    <div className="rounded-md border bg-background px-2 py-1 text-xs" key={label}>
      <span className="text-muted-foreground">{label}</span>{" "}
      <span className="font-medium text-foreground">
        {value ? (locale === "es" ? "Sí" : "Yes") : locale === "es" ? "No" : "No"}
      </span>
    </div>
  );
}

function getHealthTone(label: string, locale: Locale) {
  const normalized = label.toLowerCase();
  const healthy = locale === "es"
    ? normalized.includes("salud") || normalized.includes("fuerte")
    : normalized.includes("health") || normalized.includes("strong");

  if (healthy) {
    return "positive";
  }

  if (normalized.includes("fr") || normalized.includes("frag") || normalized.includes("watch")) {
    return "warning";
  }

  return "neutral";
}
