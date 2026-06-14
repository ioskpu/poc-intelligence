import type { Locale } from "@/lib/i18n";

type DashboardHumanization = {
  tooltips: {
    scanner: string;
    rankingLeader: string;
    rankingReason: string;
    regime: string;
    priceChange: string;
    trendStrength: string;
    funding: string;
    volatility: string;
    researchActivity: string;
    directionalBias: string;
    ghostTracking: string;
    freshnessScanner: string;
    freshnessDecisions: string;
    freshnessObservations: string;
    profitFactor: string;
    rewardRisk: string;
    maxFavorableExcursion: string;
    maxAdverseExcursion: string;
    healthScore: string;
  };
  insights: Record<string, string>;
};

const copy: Record<Locale, DashboardHumanization> = {
  es: {
    tooltips: {
      scanner: "El Scanner ordena los futuros activos por fortaleza cuantitativa observada.",
      rankingLeader: "El mercado que ocupa hoy la primera posición del ranking.",
      rankingReason: "La señal principal que explica por qué este mercado quedó arriba.",
      regime: "El contexto dominante del mercado: tendencia, rango o compresión.",
      priceChange: "Cuánto se movió el precio en la ventana observada.",
      trendStrength: "Qué tan fuerte fue el movimiento direccional observado.",
      funding: "Condición de funding en futuros; ayuda a ver si la posición está cargada.",
      volatility: "Cuánto se movió el precio en la ventana observada.",
      researchActivity: "La actividad reciente de investigación y decisión.",
      directionalBias:
        "Si el flujo observado se inclina hacia Long, Short o permanece balanceado.",
      ghostTracking:
        "Seguimiento de oportunidades rechazadas para ver qué ocurrió después.",
      freshnessScanner: "Qué tan reciente es la última lectura del Scanner.",
      freshnessDecisions: "Qué tan reciente es la actividad de decisiones.",
      freshnessObservations: "Estado de actividad automática del motor de investigación.",
      profitFactor: "Ganancia bruta dividida por pérdida bruta.",
      rewardRisk: "Relación entre la ganancia esperada y la pérdida estimada.",
      maxFavorableExcursion:
        "Máximo avance favorable observado después de que apareció el Setup.",
      maxAdverseExcursion:
        "Máximo retroceso adverso observado después de que apareció el Setup.",
      healthScore: "Señal resumida de la salud histórica del Setup.",
    },
    insights: {
      short_bias: "Presión bajista predominante",
      long_bias: "Presión alcista predominante",
      funding_flat: "El mercado no muestra desequilibrios relevantes",
      lab_disabled: "El motor descartó esta oportunidad",
      align_no_support: "No existe suficiente confirmación entre señales",
      neutral: "Condiciones mixtas",
      fragile: "Condiciones inestables",
      strong: "Condiciones favorables",
      "no historical memory": "Sin historial suficiente",
      "insufficient history": "Sin historial suficiente",
      "no observations recorded": "Sin observaciones registradas",
    },
  },
  en: {
    tooltips: {
      scanner: "The Scanner ranks active futures by observed quantitative strength.",
      rankingLeader: "The market that currently sits at the top of the ranking.",
      rankingReason: "The main signal that explains why this market sits higher.",
      regime: "The dominant market context: trend, range, or compression.",
      priceChange: "How far price moved during the evaluated window.",
      trendStrength: "How strong the observed directional move was.",
      funding: "Futures funding context; helps show whether positioning is crowded.",
      volatility: "How much price moved during the evaluated window.",
      researchActivity: "Recent research and decision activity.",
      directionalBias:
        "Whether the observed flow leans Long, Short, or stays balanced.",
      ghostTracking:
        "Rejected-opportunity tracking that shows what happened next.",
      freshnessScanner: "How recent the latest Scanner read is.",
      freshnessDecisions: "How recent the decision activity is.",
      freshnessObservations: "Activity status of the automated research engine.",
      profitFactor: "Gross profit divided by gross loss.",
      rewardRisk: "The ratio between expected gain and estimated loss.",
      maxFavorableExcursion:
        "The strongest favorable move seen after the Setup appeared.",
      maxAdverseExcursion:
        "The strongest adverse move seen after the Setup appeared.",
      healthScore: "A compact signal for the historical health of the Setup.",
    },
    insights: {
      short_bias: "Predominant bearish pressure",
      long_bias: "Predominant bullish pressure",
      funding_flat: "Market shows no relevant imbalances",
      lab_disabled: "Engine discarded this opportunity",
      align_no_support: "Insufficient confirmation between signals",
      neutral: "Mixed conditions",
      fragile: "Unstable conditions",
      strong: "Favorable conditions",
      "no historical memory": "Insufficient history",
      "insufficient history": "Insufficient history",
      "no observations recorded": "No observations recorded",
    },
  },
};

export function getDashboardHumanization(locale: Locale) {
  return copy[locale];
}

export function humanizeInsight(value: string, locale: Locale): string {
  const humanization = getDashboardHumanization(locale);
  const normalized = value.trim().toLowerCase();
  
  // Try exact match first
  if (humanization.insights[normalized]) {
    return humanization.insights[normalized];
  }

  // Handle common technical patterns
  let result = value;
  Object.entries(humanization.insights).forEach(([code, humanText]) => {
    const regex = new RegExp(`\\b${code}\\b`, "gi");
    result = result.replace(regex, humanText);
  });

  return result;
}
