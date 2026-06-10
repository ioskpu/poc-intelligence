import { CircleHelp, ChevronDown, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { formatNumber, type Locale } from "@/lib/i18n";

type MetricOptions = {
  suffix?: string;
  multiplyPercent?: boolean;
  tooltip?: string;
  advanced?: boolean;
  advancedView?: boolean;
};

export function BetaAdvancedToggle({
  advancedView,
  locale,
  onToggle,
}: {
  advancedView: boolean;
  locale: Locale;
  onToggle: () => void;
}) {
  return (
    <Button variant={advancedView ? "default" : "outline"} size="sm" onClick={onToggle}>
      {locale === "es" ? "Vista avanzada" : "Advanced View"}
      <span className="text-xs opacity-80">{advancedView ? (locale === "es" ? "On" : "On") : (locale === "es" ? "Off" : "Off")}</span>
    </Button>
  );
}

export function BetaDetailsCard({
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
    <details open={defaultOpen} className="group rounded-lg border bg-card shadow-sm">
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

export function MetricList({
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
        <p className="mt-2 text-sm text-muted-foreground">{locale === "es" ? "Sin datos" : "No data"}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {items.slice(0, 5).map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-muted-foreground">{item.label}</span>
              <span className="font-medium">
                {formatNumber(item.count, locale, { maximumFractionDigits: 0 })}
                {typeof item.share === "number"
                  ? ` · ${formatNumber(item.share * 100, locale, { maximumFractionDigits: 1 })}%`
                  : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export function EmptyState({ locale }: { locale: Locale }) {
  return (
    <div className="rounded-md border bg-background p-4 text-sm text-muted-foreground">
      {locale === "es" ? "No hay datos beta live disponibles." : "No beta live data is available."}
    </div>
  );
}

export function renderMetric(
  label: string,
  value: number | null,
  locale: Locale,
  options: MetricOptions = {},
) {
  if (value === null) {
    return null;
  }

  if (options.advanced && !options.advancedView) {
    return null;
  }

  const suffix = options.suffix ?? "";
  const multiplyPercent = options.multiplyPercent ?? suffix === "%";
  const formatted =
    suffix === "%"
      ? multiplyPercent
        ? `${formatNumber(value * 100, locale, { maximumFractionDigits: 2 })}%`
        : `${formatNumber(value, locale, { maximumFractionDigits: 2 })}%`
      : formatNumber(value, locale, { maximumFractionDigits: 4 });

  return (
    <FieldPill key={label} label={label} tooltip={options.tooltip} value={formatted} />
  );
}

export function renderTextMetric(
  label: string,
  value: string | null,
  options: MetricOptions = {},
) {
  if (!value) {
    return null;
  }

  if (options.advanced && !options.advancedView) {
    return null;
  }

  return <FieldPill key={label} label={label} tooltip={options.tooltip} value={value} />;
}

export function renderBooleanMetric(
  label: string,
  value: boolean | null,
  locale: Locale,
  options: MetricOptions = {},
) {
  if (value === null) {
    return null;
  }

  if (options.advanced && !options.advancedView) {
    return null;
  }

  return (
    <FieldPill
      key={label}
      label={label}
      tooltip={options.tooltip}
      value={value ? (locale === "es" ? "Sí" : "Yes") : locale === "es" ? "No" : "No"}
    />
  );
}

export function getHealthTone(label: string, locale: Locale) {
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

export function humanizeDecisionType(value: string, locale: Locale) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (normalized === "auto entry disabled") {
    return locale === "es" ? "No elegible" : "Not eligible";
  }

  if (normalized === "candidate ready") {
    return locale === "es" ? "Listo para evaluar" : "Candidate ready";
  }

  if (normalized === "context watch") {
    return locale === "es" ? "En observación" : "Context watch";
  }

  if (normalized === "rejected") {
    return locale === "es" ? "Rechazado" : "Rejected";
  }

  return value;
}

export function humanizeSignalStatus(value: string, locale: Locale) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (normalized === "signal ok") {
    return locale === "es" ? "Lista" : "Ready";
  }

  if (normalized === "signal not ok") {
    return locale === "es" ? "No lista" : "Not ready";
  }

  return value;
}


function FieldPill({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: string;
  tooltip?: string;
}) {
  return (
    <div className="rounded-md border bg-background px-2 py-1 text-xs">
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        {label}
        {tooltip ? <TooltipBadge tooltip={tooltip} /> : null}
      </span>{" "}
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function TooltipBadge({ tooltip }: { tooltip: string }) {
  return (
    <button
      type="button"
      title={tooltip}
      aria-label={tooltip}
      className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/30 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <CircleHelp className="h-3 w-3" aria-hidden="true" />
    </button>
  );
}
