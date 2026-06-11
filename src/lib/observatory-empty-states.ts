import { formatDate, formatNumber, type Locale } from "@/lib/i18n";

export function emptyHistoryLabel(locale: Locale) {
  return locale === "es" ? "Sin historial suficiente" : "Insufficient history";
}

export function noObservationsLabel(locale: Locale) {
  return locale === "es" ? "Sin observaciones registradas" : "No observations recorded";
}

export function insufficientDataLabel(locale: Locale) {
  return locale === "es" ? "Datos insuficientes" : "Insufficient data";
}

export function pendingEvaluationLabel(locale: Locale) {
  return locale === "es" ? "Pendiente de evaluación" : "Pending evaluation";
}

export function pendingClassificationLabel(locale: Locale) {
  return locale === "es" ? "Clasificación pendiente" : "Classification pending";
}

export function hasObservations(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function hasValidDate(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "" || value === 0) {
    return false;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getUTCFullYear() > 1970;
}

export function formatObservatoryDate(
  value: string | number | null | undefined,
  locale: Locale,
  fallback?: string,
) {
  if (!hasValidDate(value)) {
    return fallback ?? emptyHistoryLabel(locale);
  }

  return formatDate(value, locale);
}

export function formatDisplayText(
  value: string | null | undefined,
  locale: Locale,
  fallback?: string,
) {
  const normalized = (value ?? "").trim();
  if (!normalized || normalized.toLowerCase() === "unknown") {
    return fallback ?? pendingClassificationLabel(locale);
  }

  return normalized;
}

export function formatObservedMetric(
  value: number | null | undefined,
  locale: Locale,
  options?: Intl.NumberFormatOptions & { suffix?: string; multiplyPercent?: boolean },
) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return insufficientDataLabel(locale);
  }

  const suffix = options?.suffix ?? "";
  const multiplyPercent = options?.multiplyPercent ?? suffix === "%";
  const displayValue = suffix === "%" && multiplyPercent ? value * 100 : value;

  return `${formatNumber(displayValue, locale, options)}${suffix}`;
}
