"use client";

import { useEffect } from "react";
import type { ProductAnalyticsEventType } from "@/services/api/product-analytics";

type ProductAnalyticsTrackerProps = {
  enabled: boolean;
  events: ProductAnalyticsDescriptor[];
  pageViewEvent?: ProductAnalyticsEventType;
  pageViewMetadata?: Record<string, string>;
};

export type ProductAnalyticsDescriptor = {
  eventType: ProductAnalyticsEventType;
  metadata?: Record<string, string>;
  selector?: string;
};

export function ProductAnalyticsTracker({
  enabled,
  events,
  pageViewEvent = "dashboard_view",
  pageViewMetadata = { module: "dashboard" },
}: ProductAnalyticsTrackerProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    void postProductEvent("session_started", { module: "session" });
    void postProductEvent(pageViewEvent, pageViewMetadata);
  }, [enabled, pageViewEvent, pageViewMetadata]);

  useEffect(() => {
    if (!enabled || events.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const target = entry.target as HTMLElement;
          const eventType = target.dataset.analyticsEvent as ProductAnalyticsEventType | undefined;
          const key = `${eventType}:${target.dataset.analyticsModule ?? ""}:${target.dataset.analyticsRanking ?? ""}`;
          if (!eventType || seen.has(key)) {
            continue;
          }
          seen.add(key);
          void postProductEvent(eventType, {
            module: target.dataset.analyticsModule ?? "",
            ranking: target.dataset.analyticsRanking ?? "",
          });
        }
      },
      { threshold: 0.45 },
    );

    for (const descriptor of events) {
      if (!descriptor.selector) {
        continue;
      }
      document.querySelectorAll(descriptor.selector).forEach((element) => {
        if (element instanceof HTMLElement) {
          element.dataset.analyticsEvent = descriptor.eventType;
          if (descriptor.metadata?.module) {
            element.dataset.analyticsModule = descriptor.metadata.module;
          }
          if (descriptor.metadata?.ranking) {
            element.dataset.analyticsRanking = descriptor.metadata.ranking;
          }
          observer.observe(element);
        }
      });
    }

    return () => observer.disconnect();
  }, [enabled, events]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest("[data-analytics-symbol]");
      if (!(target instanceof HTMLElement)) {
        return;
      }
      const symbol = target.dataset.analyticsSymbol;
      if (!symbol) {
        return;
      }
      void postProductEvent("ranking_symbol_clicked", {
        module: target.dataset.analyticsModule ?? "rankings",
        ranking: target.dataset.analyticsRanking ?? "",
        symbol,
      });
    };

    document.addEventListener("click", onClick);

    return () => document.removeEventListener("click", onClick);
  }, [enabled]);

  return null;
}

async function postProductEvent(
  eventType: ProductAnalyticsEventType,
  metadata: Record<string, string> = {},
) {
  await fetch("/api/private-beta/product-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, metadata }),
    keepalive: true,
  });
}
