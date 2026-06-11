export const PRIVATE_BETA_FEEDBACK_TYPES = [
  "module_usefulness",
  "session_value",
  "weekly_retention",
  "freeform",
] as const;

export type PrivateBetaFeedbackType = (typeof PRIVATE_BETA_FEEDBACK_TYPES)[number];

export type PrivateBetaFeedbackInput = {
  feedbackType: PrivateBetaFeedbackType;
  feedbackValue: string;
  metadata?: Record<string, unknown>;
};

export type PrivateBetaFeedbackBreakdown = {
  value: string;
  count: number;
  percentage: number;
};

export type PrivateBetaTopUsefulModule = {
  module: string;
  yes: number;
  no: number;
  yesRate: number;
  total: number;
};

export type PrivateBetaFeedbackAnalytics = {
  totalResponses: number;
  moduleUsefulness: PrivateBetaFeedbackBreakdown[];
  sessionValue: PrivateBetaFeedbackBreakdown[];
  weeklyRetention: PrivateBetaFeedbackBreakdown[];
  topUsefulModules: PrivateBetaTopUsefulModule[];
};

export function isPrivateBetaFeedbackType(
  value: unknown,
): value is PrivateBetaFeedbackType {
  return (
    typeof value === "string" &&
    PRIVATE_BETA_FEEDBACK_TYPES.includes(value as PrivateBetaFeedbackType)
  );
}

export function sanitizePrivateBetaFeedbackMetadata(
  value: unknown,
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const allowed: Record<string, unknown> = {};
  const source = value as Record<string, unknown>;

  for (const key of ["module", "source", "prompt"]) {
    const raw = source[key];
    if (typeof raw === "string" && raw.trim()) {
      allowed[key] = raw.trim().slice(0, 120);
    }
  }

  return allowed;
}

export async function postPrivateBetaFeedback(input: PrivateBetaFeedbackInput) {
  await fetch("/api/private-beta/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      feedbackType: input.feedbackType,
      feedbackValue: input.feedbackValue,
      metadata: sanitizePrivateBetaFeedbackMetadata(input.metadata),
    }),
    keepalive: true,
  });
}
