export const PRODUCT_ANALYTICS_EVENTS = [
  "session_started",
  "dashboard_view",
  "ranking_view",
  "ranking_symbol_clicked",
  "awareness_view",
  "ghost_tracking_view",
  "setup_memory_view",
  "beta_research_view",
  "admin_dashboard_view",
] as const;

export type ProductAnalyticsEventType = (typeof PRODUCT_ANALYTICS_EVENTS)[number];

export type ProductAnalyticsEventInput = {
  eventType: ProductAnalyticsEventType;
  metadata?: Record<string, unknown>;
};

export type ProductAnalyticsSummary = {
  dau: number;
  wau: number;
  mau: number;
  activeUsers7d: number;
  sessionsPerUser: number;
  avgDaysBetweenVisits: number;
  topModules: ProductAnalyticsTopModule[];
  topSymbols: ProductAnalyticsTopSymbol[];
  funnel: {
    invited: number;
    approved: number;
    firstLogin: number;
    secondLogin: number;
    recurrent: number;
  };
};

export type ProductAnalyticsTopModule = {
  module: string;
  count: number;
};

export type ProductAnalyticsTopSymbol = {
  symbol: string;
  count: number;
};

export function isProductAnalyticsEventType(
  value: unknown,
): value is ProductAnalyticsEventType {
  return (
    typeof value === "string" &&
    PRODUCT_ANALYTICS_EVENTS.includes(value as ProductAnalyticsEventType)
  );
}

export function sanitizeProductAnalyticsMetadata(
  value: unknown,
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const allowed: Record<string, unknown> = {};
  const source = value as Record<string, unknown>;

  for (const key of [
    "module",
    "symbol",
    "ranking",
    "reportId",
    "source",
  ]) {
    const raw = source[key];
    if (typeof raw === "string" && raw.trim()) {
      allowed[key] = raw.trim().slice(0, 120);
    }
  }

  return allowed;
}
