import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCopy, type Locale } from "@/lib/i18n";

type BenefitKey = "changed" | "rankings" | "brief" | "ghosts";

type LandingVisualProps = {
  locale: Locale;
};

type LandingBenefitVisualProps = LandingVisualProps & {
  benefitKey: BenefitKey;
};

const heroRankings = [
  { rank: 1, symbol: "BTCUSDT", score: 96, direction: "Bullish" },
  { rank: 2, symbol: "ETHUSDT", score: 91, direction: "Bullish" },
  { rank: 3, symbol: "SOLUSDT", score: 87, direction: "Neutral" },
] as const;

const ghostHistory = [
  { period: "T-3", positiveRate: 0.52, profitFactor: 1.12 },
  { period: "T-2", positiveRate: 0.58, profitFactor: 1.24 },
  { period: "T-1", positiveRate: 0.61, profitFactor: 1.41 },
] as const;

export function LandingBrandSlot() {
  return (
    <div
      className="h-10 w-10 shrink-0 rounded-md border border-dashed bg-muted/35"
      aria-label="Reserved logo space"
    />
  );
}

export function LandingProductMockup({ locale }: LandingVisualProps) {
  const copy = getCopy(locale);
  const changeRows = getChangeRows(locale);
  const heroRows = heroRankings.slice(0, 2);

  return (
    <Card className="overflow-hidden border-muted/70 shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/25 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <LandingBrandSlot />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {copy.landing.eyebrow}
            </p>
            <p className="text-sm font-semibold">POC Intelligence</p>
          </div>
        </div>
        <Badge tone="info">{copy.banner.title}</Badge>
      </div>

      <CardContent className="space-y-3 p-3">
        <HeroBriefPanel locale={locale} />
        <HeroChangePanel locale={locale} changeRows={changeRows.slice(0, 2)} />
        <HeroRankingPanel locale={locale} rows={heroRows} />
      </CardContent>
    </Card>
  );
}

export function LandingBenefitVisual({
  locale,
  benefitKey,
}: LandingBenefitVisualProps) {
  const copy = getCopy(locale);
  const changeRows = getChangeRows(locale);

  const content = {
    changed: (
      <section className="space-y-3">
        {changeRows.map((row) => (
          <div
            key={row.symbol}
            className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
          >
            <div>
              <p className="text-sm font-semibold">{row.symbol}</p>
              <p className="text-xs text-muted-foreground">{row.note}</p>
            </div>
            <div className="flex items-center gap-2">
              {row.movement.startsWith("+") ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-500" aria-hidden="true" />
              )}
              <span className="text-sm font-semibold">{row.movement}</span>
            </div>
          </div>
        ))}
      </section>
    ),
    rankings: (
      <section className="overflow-hidden rounded-md border bg-background">
        <div className="grid grid-cols-[0.7fr_1fr_0.6fr] border-b px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <span>{copy.dashboard.marketRankings.headers.rank}</span>
          <span>{locale === "es" ? "Símbolo" : "Symbol"}</span>
          <span>{copy.dashboard.marketRankings.headers.score}</span>
        </div>
        <div className="divide-y">
          {heroRankings.map((row) => (
            <div
              key={row.symbol}
              className="grid grid-cols-[0.7fr_1fr_0.6fr] items-center px-3 py-2 text-sm"
            >
              <span className="font-semibold">{row.rank}</span>
              <span>{row.symbol}</span>
              <span>{row.score}</span>
            </div>
          ))}
        </div>
      </section>
    ),
    brief: (
      <section className="rounded-md border bg-background p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {copy.dashboard.intelligenceBrief.title}
            </p>
            <p className="mt-1 text-sm font-semibold">
              {locale === "es"
                ? "La lectura de hoy es concentrada"
                : "Today’s read is concentrated"}
            </p>
          </div>
          <TrendingUp className="h-4 w-4 text-secondary" aria-hidden="true" />
        </div>
        <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
          <p>
            {locale === "es"
              ? "Los mercados líderes siguen dominando el top de ranking."
              : "Leader markets continue to dominate the top of the ranking."}
          </p>
          <p>
            {locale === "es"
              ? "La bias direccional sigue inclinada al alza."
              : "Directional bias remains tilted higher."}
          </p>
          <p>
            {locale === "es"
              ? "Ghost Tracking mantiene evidencia útil sobre oportunidades rechazadas."
              : "Ghost Tracking still provides useful evidence on rejected opportunities."}
          </p>
        </div>
      </section>
    ),
    ghosts: (
      <section className="space-y-3">
        {ghostHistory.map((row) => (
          <div
            key={row.period}
            className="rounded-md border bg-background px-3 py-2"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{row.period}</p>
              <Badge tone="info">
                {copy.dashboard.ghostTracking.metrics.positiveRate}
              </Badge>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <HistoryMetric
                label={copy.dashboard.ghostTracking.metrics.positiveRate}
                value={`${Math.round(row.positiveRate * 100)}%`}
              />
              <HistoryMetric
                label={locale === "es" ? "Factor" : "PF"}
                value={row.profitFactor.toFixed(2)}
              />
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${Math.round(row.positiveRate * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </section>
    ),
  }[benefitKey];

  const benefitCopy = copy.landing.benefits.items[benefitKey];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2">
        <CardTitle className="text-base">{benefitCopy.title}</CardTitle>
        <CardDescription className="leading-6">{benefitCopy.description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function HistoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/25 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function HeroBriefPanel({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);

  return (
    <section className="rounded-lg border bg-background p-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {copy.dashboard.intelligenceBrief.title}
          </p>
          <h3 className="mt-2 text-base font-semibold leading-tight">
            {locale === "es"
              ? "BTCUSDT mantiene el liderato"
              : "BTCUSDT keeps the lead"}
          </h3>
        </div>
        <Badge tone="info">{locale === "es" ? "En vivo" : "Live"}</Badge>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {locale === "es"
          ? "El liderazgo se mantiene mientras la presión direccional se concentra en los mismos mercados."
          : "Leadership holds while directional pressure stays concentrated in the same markets."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <MetricPill label={copy.dashboard.marketSummary.topSymbol} value="BTCUSDT" />
        <MetricPill label={copy.dashboard.marketSummary.topScore} value="96" />
        <MetricPill
          label={copy.dashboard.marketSummary.lastUpdated}
          value={locale === "es" ? "hace 4 min" : "4m ago"}
        />
      </div>
    </section>
  );
}

function HeroChangePanel({
  locale,
  changeRows,
}: {
  locale: Locale;
  changeRows: readonly {
    symbol: string;
    movement: string;
    note: string;
  }[];
}) {
  const copy = getCopy(locale);

  return (
    <section className="rounded-lg border bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {copy.dashboard.changeAwareness.title}
          </p>
          <h4 className="mt-1 text-xs font-semibold">
            {locale === "es" ? "Movimientos de ranking" : "Ranking moves"}
          </h4>
        </div>
        <Badge tone="info">{locale === "es" ? "Cambio" : "Change"}</Badge>
      </div>
      <div className="mt-3 space-y-2">
        {changeRows.map((row) => (
          <div
            key={row.symbol}
            className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
          >
            <div>
              <p className="text-sm font-semibold">{row.symbol}</p>
              <p className="text-xs text-muted-foreground">{row.note}</p>
            </div>
            <div className="flex items-center gap-2">
              {row.movement.startsWith("+") ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" aria-hidden="true" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-rose-500" aria-hidden="true" />
              )}
              <span className="text-sm font-semibold">{row.movement}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroRankingPanel({
  locale,
  rows,
}: {
  locale: Locale;
  rows: readonly {
    rank: number;
    symbol: string;
    score: number;
  }[];
}) {
  const copy = getCopy(locale);

  return (
    <section className="rounded-lg border bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {copy.dashboard.marketRankings.title}
          </p>
          <h4 className="mt-1 text-xs font-semibold">
            {locale === "es" ? "Tabla simplificada" : "Simplified table"}
          </h4>
        </div>
        <Badge tone="info">{copy.dashboard.marketRankings.headers.score}</Badge>
      </div>
      <div className="mt-3 overflow-hidden rounded-md border bg-background">
        <div className="grid grid-cols-[0.6fr_1.3fr_0.7fr] border-b px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <span>{copy.dashboard.marketRankings.headers.rank}</span>
          <span>{locale === "es" ? "Símbolo" : "Symbol"}</span>
          <span>{copy.dashboard.marketRankings.headers.score}</span>
        </div>
        <div className="divide-y">
          {rows.map((row) => (
            <div
              key={row.symbol}
              className="grid grid-cols-[0.6fr_1.3fr_0.7fr] items-center px-3 py-2 text-sm"
            >
              <span className="font-semibold">{row.rank}</span>
              <span>{row.symbol}</span>
              <span>{row.score}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getChangeRows(locale: Locale) {
  if (locale === "es") {
    return [
      { symbol: "BTCUSDT", movement: "+2", note: "El líder se mantuvo" },
      { symbol: "ETHUSDT", movement: "-1", note: "Perdió una posición" },
      { symbol: "AVAXUSDT", movement: "+4", note: "Entró al top 5" },
    ] as const;
  }

  return [
    { symbol: "BTCUSDT", movement: "+2", note: "Leader held" },
    { symbol: "ETHUSDT", movement: "-1", note: "Moved lower" },
    { symbol: "AVAXUSDT", movement: "+4", note: "Entered top 5" },
  ] as const;
}
