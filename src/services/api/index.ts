import { resolveObservatorySnapshot } from "@/services/api/observatory-client";

export async function getIntelligenceSnapshot() {
  const resolution = await resolveObservatorySnapshot();

  if (resolution.source === "gateway") {
    console.info("[observatory] snapshot source=gateway");
    return resolution.snapshot;
  }

  console.info(
    `[observatory] snapshot source=demo fallback=${resolution.fallbackReason ?? "unknown"}`,
  );

  if (resolution.gatewayError) {
    console.warn(`[observatory] gateway error=${resolution.gatewayError}`);
  }

  return resolution.snapshot;
}
