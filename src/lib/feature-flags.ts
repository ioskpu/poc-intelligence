export function isBetaResearchEnabled() {
  const value = process.env.POC_INTELLIGENCE_BETA_RESEARCH_ENABLED?.trim().toLowerCase();

  return value === "true" || value === "1" || value === "yes";
}
