"use client";

import { Database } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { type Locale, formatDate, formatNumber, translateSide } from "@/lib/i18n";
import { getBetaLiveCopy } from "@/lib/beta-live-copy";
import {
  formatDisplayText,
  hasObservations,
  insufficientDataLabel,
  pendingEvaluationLabel,
} from "@/lib/observatory-empty-states";
import {
  BetaAdvancedToggle,
  BetaDetailsCard,
  EmptyState,
  MetricList,
  getHealthTone,
  humanizeDecisionType,
  humanizeSignalStatus,
  renderBooleanMetric,
  renderMetric,
  renderTextMetric,
} from "@/features/dashboard/beta-live-rendering";
import type { BetaLiveInsights } from "@/types/intelligence";

type BetaLiveDepthProps = {
  betaLive: BetaLiveInsights;
  locale: Locale;
};

export function BetaLiveDepth({ betaLive, locale }: BetaLiveDepthProps) {
  const [advancedView, setAdvancedView] = useState(false);
  const copy = getBetaLiveCopy(locale);
  const tooltips = copy.tooltips;

  if (!betaLive) {
    return null;
  }

  return (
    <section id="beta-live-depth" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="info">
            <Database className="mr-1 h-3 w-3" aria-hidden="true" />
            {copy.title}
          </Badge>
          <p className="text-sm text-muted-foreground">{copy.description}</p>
        </div>
        <BetaAdvancedToggle
          advancedView={advancedView}
          locale={locale}
          onToggle={() => setAdvancedView((current) => !current)}
        />
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
                      <p
                        className="text-sm font-semibold"
                        data-analytics-module="beta-research"
                        data-analytics-ranking="beta-scanner"
                        data-analytics-symbol={item.symbol}
                      >
                        #{item.rank} {item.symbol}
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
                          : pendingEvaluationLabel(locale)}
                    </Badge>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                    {renderMetric(copy.fields.lastPrice, item.lastPrice, locale)}
                    {renderMetric(copy.fields.quoteVolume, item.quoteVolume, locale, { tooltip: tooltips.quoteVolume })}
                    {renderMetric(copy.fields.rangePct, item.rangePct, locale, { suffix: "%", multiplyPercent: false, tooltip: tooltips.rangePct })}
                    {renderMetric(copy.fields.longShortBalance, item.longShortBalance, locale, { tooltip: tooltips.longShortBalance })}
                    {renderMetric(copy.fields.priceChangePct, item.priceChangePct, locale, { suffix: "%", multiplyPercent: false, tooltip: tooltips.priceChangePct })}
                    {renderMetric(copy.fields.trendStrengthPct, item.trendStrengthPct, locale, { suffix: "%", multiplyPercent: false, tooltip: tooltips.trendStrengthPct })}
                    {renderMetric(copy.fields.realizedVolatilityPct, item.realizedVolatilityPct, locale, { suffix: "%", multiplyPercent: false, tooltip: tooltips.realizedVolatilityPct })}
                    {renderMetric(copy.fields.fundingRate, item.fundingRate, locale, { tooltip: tooltips.fundingRate })}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground">
                    {copy.fields.rankingReason}: {formatDisplayText(item.rankingReason, locale, insufficientDataLabel(locale))}
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
                      <p
                        className="text-sm font-semibold"
                        data-analytics-module="beta-research"
                        data-analytics-ranking="beta-decisions"
                        data-analytics-symbol={item.symbol}
                      >
                        {item.symbol}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(item.observedAt, locale)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="info">{translateSide(item.selectedSide, locale)}</Badge>
                      <Badge tone={item.signalStatus === "Signal OK" ? "positive" : item.signalStatus === "Signal not OK" ? "warning" : "neutral"}>
                        {humanizeSignalStatus(item.signalStatus, locale)}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {item.reason}
                  </p>
                  <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {renderTextMetric(copy.fields.decisionType, humanizeDecisionType(item.decisionType, locale), { locale })}
                    {renderTextMetric(copy.fields.selectedSide, item.selectedSide, { locale })}
                    {renderTextMetric(copy.fields.signalOk, humanizeSignalStatus(item.signalStatus, locale), { locale })}
                    {renderMetric(copy.fields.estimatedRrRatio, item.rewardRisk, locale, { tooltip: tooltips.estimatedRrRatio })}
                    {renderTextMetric(copy.fields.trendAlignmentLabel, item.trendAlignmentLabel, { tooltip: tooltips.trendAlignmentLabel, locale })}
                    {renderBooleanMetric(copy.fields.trendSupportsDirection, item.trendSupportsDirection, locale, { tooltip: tooltips.trendSupportsDirection })}
                    {renderTextMetric(copy.fields.setupKey, item.setupKey, { advanced: true, advancedView, locale })}
                    {renderTextMetric(copy.fields.setupKeyVersion, item.setupKeyVersion, { advanced: true, advancedView, locale })}
                    {renderTextMetric(copy.fields.environment, item.environment, { advanced: true, advancedView, locale })}
                    {renderTextMetric(copy.fields.directionHint, item.directionHint, { advanced: true, advancedView, locale })}
                    {renderTextMetric(copy.fields.capitalProfile, item.capitalProfile, { advanced: true, advancedView, locale })}
                    {renderMetric(copy.fields.operatingCapital, item.operatingCapital, locale, { advanced: true, advancedView })}
                    {renderBooleanMetric(copy.fields.autoEntryEnabled, item.autoEntryEnabled, locale, { advanced: true, advancedView })}
                    {renderBooleanMetric(copy.fields.autoExitEnabled, item.autoExitEnabled, locale, { advanced: true, advancedView })}
                    {renderMetric(copy.fields.leverage, item.leverage, locale, { advanced: true, advancedView })}
                    {renderMetric(copy.fields.takeProfitPct, item.takeProfitPct, locale, { suffix: "%", multiplyPercent: false, advanced: true, advancedView })}
                    {renderMetric(copy.fields.stopLossPct, item.stopLossPct, locale, { suffix: "%", multiplyPercent: false, advanced: true, advancedView })}
                    {renderMetric(copy.fields.takeProfitUsdt, item.takeProfitUsdt, locale, { advanced: true, advancedView })}
                    {renderMetric(copy.fields.stopLossUsdt, item.stopLossUsdt, locale, { advanced: true, advancedView })}
                    {renderTextMetric(copy.fields.oracleRecommendation, item.oracleRecommendation, { advanced: true, advancedView, locale })}
                    {renderTextMetric(copy.fields.scanBatchId, item.scanBatchId, { advanced: true, advancedView, locale })}
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
              {betaLive.setupDepth.map((item) => {
                const hasHistory = hasObservations(item.tradeCount);

                return (
                <article key={`${item.symbol}-${item.side}-${item.lastSeenAt}-${item.lastObservedAt}`} className="rounded-md border bg-background p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className="text-sm font-semibold"
                        data-analytics-module="beta-research"
                        data-analytics-ranking="beta-setup-depth"
                        data-analytics-symbol={item.symbol}
                      >
                        {item.symbol}
                      </p>
                      <p className="text-xs text-muted-foreground">{translateSide(item.side, locale)} {locale === "es" ? "Setup" : "Setup"}</p>
                    </div>
                    <Badge tone={hasHistory ? getHealthTone(item.healthLabel, locale) : "neutral"}>
                      {hasHistory ? formatDisplayText(item.healthLabel, locale) : pendingEvaluationLabel(locale)}
                    </Badge>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {hasHistory ? (
                      <>
                        {renderMetric(copy.fields.tradeCount, item.tradeCount, locale)}
                        {renderMetric(copy.fields.winRate, item.winRate, locale, { suffix: "%" })}
                        {renderMetric(copy.fields.pnlTotal, item.pnlTotal, locale, { tooltip: tooltips.pnlTotal })}
                        {renderMetric(copy.fields.averagePnlPct, item.averagePnlPct, locale, { suffix: "%", tooltip: tooltips.averagePnlPct })}
                        {renderMetric(copy.fields.healthScore, item.healthScore, locale, { tooltip: tooltips.healthScore })}
                        {renderTextMetric(copy.fields.lastCloseReason, item.lastCloseReason, { tooltip: tooltips.lastCloseReason, locale })}
                        {renderTextMetric(copy.fields.lastObservedAt, formatDate(item.lastObservedAt, locale), { locale })}
                        {renderMetric(copy.fields.winCount, item.winCount, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.averagePnl, item.averagePnl, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.averageCapitalReference, item.averageCapitalReference, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.averageHoldTicks, item.averageHoldTicks, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.averageWinPnl, item.averageWinPnl, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.averageLossAbs, item.averageLossAbs, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.lastRealizedPnl, item.lastRealizedPnl, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.lastRealizedPnlPct, item.lastRealizedPnlPct, locale, { suffix: "%", advanced: true, advancedView })}
                        {renderMetric(copy.fields.cooldownMultiplier, item.cooldownMultiplier, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.suggestedTakeProfitUsdt, item.suggestedTakeProfitUsdt, locale, { advanced: true, advancedView })}
                        {renderMetric(copy.fields.suggestedStopLossUsdt, item.suggestedStopLossUsdt, locale, { advanced: true, advancedView })}
                        {renderTextMetric(copy.fields.environment, item.environment, { advanced: true, advancedView, locale })}
                        {renderTextMetric(copy.fields.capitalProfile, item.capitalProfile, { advanced: true, advancedView, locale })}
                        {renderTextMetric(copy.fields.lane, item.lane, { advanced: true, advancedView, locale })}
                      </>
                    ) : (
                      <div className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground">
                        {insufficientDataLabel(locale)}
                      </div>
                    )}
                  </div>
                </article>
                );
              })}
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
              {renderMetric(copy.fields.positiveRate, betaLive.ghostOutcomes.positiveRate, locale, { suffix: "%", tooltip: tooltips.positiveRate })}
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
                      </div>
                      {record.profitFactor !== null ? (
                        <Badge tone={record.profitFactor >= 1 ? "positive" : "warning"}>
                          PF {formatNumber(record.profitFactor, locale)}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {renderMetric(copy.fields.reasonBreakdown, record.totalCount, locale)}
                      {renderMetric(copy.fields.profitFactorByReason, record.profitFactor, locale, { tooltip: tooltips.profitFactor })}
                      {renderMetric(copy.fields.averageHypotheticalPnlPct, record.averageHypotheticalPnlPct, locale, { suffix: "%", tooltip: tooltips.averageHypotheticalPnlPct })}
                      {renderMetric(copy.fields.positiveCount, record.settledPositiveCount, locale)}
                    </div>
                </article>
              ))}
            </div>
            )}
            {advancedView && betaLive.ghostOutcomes.rrThresholdSimulation.length > 0 ? (
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
              {renderMetric(copy.fields.opportunityStarvation, betaLive.diagnostics.opportunityStarvation.hoursSinceEligibleSetup, locale, { tooltip: tooltips.opportunityStarvation })}
              {renderTextMetric(copy.fields.dominantRejectionReason, betaLive.diagnostics.dominantRejectionReason, { tooltip: tooltips.dominantRejectionReason, locale })}
            </div>
            {advancedView ? (
              <>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {renderMetric(copy.fields.windowCycles, betaLive.diagnostics.windowCycles, locale, { advanced: true, advancedView })}
                  {renderMetric(copy.fields.windowHours, betaLive.diagnostics.windowHours, locale, { advanced: true, advancedView })}
                  {renderMetric(copy.fields.totalCandidates, betaLive.diagnostics.totalCandidates, locale, { advanced: true, advancedView })}
                  {renderMetric(copy.fields.totalEligible, betaLive.diagnostics.totalEligible, locale, { advanced: true, advancedView })}
                  {renderMetric(copy.fields.candidateReadyCycleRate, betaLive.diagnostics.candidateReadyCycleRate, locale, { suffix: "%", advanced: true, advancedView })}
                  {renderMetric(copy.fields.eligibleCycleRate, betaLive.diagnostics.eligibleCycleRate, locale, { suffix: "%", advanced: true, advancedView })}
                  {renderMetric(copy.fields.expectedCandidateReadyPerDay, betaLive.diagnostics.expectedCandidateReadyPerDay, locale, { advanced: true, advancedView })}
                  {renderMetric(copy.fields.expectedEligibleCyclesPerDay, betaLive.diagnostics.expectedEligibleCyclesPerDay, locale, { advanced: true, advancedView })}
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  <MetricList
                    title={copy.fields.filterSurvival}
                    items={[
                      { label: locale === "es" ? "Post time context" : "Post time context", count: betaLive.diagnostics.filterSurvival.postTimeContext },
                      { label: locale === "es" ? "Post EMA" : "Post EMA", count: betaLive.diagnostics.filterSurvival.postEma },
                      { label: locale === "es" ? "Post RR" : "Post RR", count: betaLive.diagnostics.filterSurvival.postRr },
                      { label: locale === "es" ? "Eligible" : "Eligible", count: betaLive.diagnostics.filterSurvival.eligible },
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
              </>
            ) : null}
          </div>
        </BetaDetailsCard>
      </div>
    </section>
  );
}
