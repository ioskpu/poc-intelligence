"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { postPrivateBetaFeedback, type PrivateBetaFeedbackType } from "@/services/api/private-beta-feedback";

type FeedbackOption = {
  label: string;
  value: string;
};

type FeedbackPromptProps = {
  feedbackType: PrivateBetaFeedbackType;
  question: string;
  options: FeedbackOption[];
  metadata?: Record<string, string>;
  storageKey: string;
  className?: string;
};

export function FeedbackPrompt({
  feedbackType,
  question,
  options,
  metadata,
  storageKey,
  className,
}: FeedbackPromptProps) {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(window.localStorage.getItem(storageKey) !== "submitted");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [storageKey]);

  if (!visible || submitted) {
    return null;
  }

  async function submit(value: string) {
    setSubmitted(true);
    window.localStorage.setItem(storageKey, "submitted");
    await postPrivateBetaFeedback({
      feedbackType,
      feedbackValue: value,
      metadata,
    }).catch(() => {
      window.localStorage.removeItem(storageKey);
      setSubmitted(false);
    });
  }

  return (
    <div className={className ?? "rounded-md border bg-muted/20 p-4"}>
      <p className="text-sm font-medium">{question}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void submit(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function BetaResearchFeedbackPrompt({ locale }: { locale: "es" | "en" }) {
  return (
    <FeedbackPrompt
      feedbackType="module_usefulness"
      question={
        locale === "es"
          ? "¿Te resultó útil esta investigación?"
          : "Was this research useful?"
      }
      options={[
        { label: locale === "es" ? "👍 Sí" : "👍 Yes", value: "yes" },
        { label: "👎 No", value: "no" },
      ]}
      metadata={{ module: "beta_research", source: "beta-research" }}
      storageKey="poc-feedback-beta-research-usefulness"
    />
  );
}

export function DashboardFeedbackController({ locale }: { locale: "es" | "en" }) {
  const [showSessionValue, setShowSessionValue] = useState(false);
  const [showWeeklyRetention, setShowWeeklyRetention] = useState(false);
  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    const days = readVisitDays();
    const nextDays = Array.from(new Set([...days, todayKey])).slice(-14);
    window.localStorage.setItem("poc-feedback-dashboard-visit-days", JSON.stringify(nextDays));
    const weeklyTimer = window.setTimeout(() => {
      setShowWeeklyRetention(nextDays.length >= 3);
    }, 0);

    const timer = window.setTimeout(() => {
      setShowSessionValue(true);
    }, 180000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setShowSessionValue(true);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(weeklyTimer);
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [todayKey]);

  if (!showSessionValue && !showWeeklyRetention) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[min(92vw,420px)] space-y-3">
      {showSessionValue ? (
        <FeedbackPrompt
          feedbackType="session_value"
          question={
            locale === "es"
              ? "¿Qué fue lo más valioso hoy?"
              : "What was most valuable today?"
          }
          options={[
            { label: "Rankings", value: "rankings" },
            { label: "Setup Memory", value: "setup_memory" },
            { label: "Awareness", value: "awareness" },
            { label: "Ghost Tracking", value: "ghost_tracking" },
            { label: "Research", value: "research" },
          ]}
          metadata={{ module: "dashboard", prompt: "session_value" }}
          storageKey={`poc-feedback-session-value-${todayKey}`}
          className="rounded-md border bg-card p-4 shadow-lg"
        />
      ) : null}
      {showWeeklyRetention ? (
        <FeedbackPrompt
          feedbackType="weekly_retention"
          question={
            locale === "es"
              ? "¿Seguirías utilizando esta plataforma semanalmente?"
              : "Would you keep using this platform weekly?"
          }
          options={[
            { label: locale === "es" ? "Sí" : "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: locale === "es" ? "No estoy seguro" : "Not sure", value: "unsure" },
          ]}
          metadata={{ module: "dashboard", prompt: "weekly_retention" }}
          storageKey="poc-feedback-weekly-retention"
          className="rounded-md border bg-card p-4 shadow-lg"
        />
      ) : null}
    </div>
  );
}

function readVisitDays() {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem("poc-feedback-dashboard-visit-days") ?? "[]",
    );
    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is string => typeof value === "string");
    }
  } catch {
    return [];
  }

  return [];
}
