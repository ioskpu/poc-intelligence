export type Locale = "es" | "en";

export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE_NAME = "poc-intelligence-locale";
export const LOCALE_STORAGE_KEY = "poc-intelligence-locale";

const localeLabels: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

const copy = {
  es: {
    banner: {
      title: "Demostración pública",
      message:
        "Esta es una demostración pública que utiliza datos de ejemplo para evaluación del producto.",
    },
    topBar: {
      snapshot: "Resumen de inteligencia",
      generated: "Generado",
      publicDemo: "Demostración pública",
      overview: "Inicio",
      language: "Idioma",
    },
    sidebar: {
      dashboard: "Panel",
      markets: "Mercados",
      opportunities: "Oportunidades",
      patterns: "Patrones",
      regimes: "Regímenes",
    },
    landing: {
      eyebrow: "Inteligencia cuantitativa",
      title: "ProofOfConsistency Intelligence Platform",
      description:
        "Una interfaz SaaS liviana para ranking de mercados, ranking de oportunidades, descubrimiento de patrones y análisis de regímenes generados por el backend existente de Futures Lab.",
      primaryAction: "Ver inteligencia",
      secondaryAction: "Revisar ranking",
      disclaimer:
        "Esta plataforma no ejecuta operaciones y no ofrece asesoría financiera.",
      metrics: {
        consistency: "Puntaje de consistencia",
        regimes: "Regímenes activos",
        patterns: "Patrones encontrados",
        markets: "Mercados rankeados",
        topSignal: "Señal principal actual",
        topSignalDetail:
          "Instantánea de demostración para la validación pública del producto.",
      },
      pillars: {
        markets: {
          title: "Ranking de mercados",
          description:
            "Ordena mercados de futuros por consistencia, régimen y contexto direccional.",
        },
        patterns: {
          title: "Descubrimiento de patrones",
          description:
            "Superpone patrones estadísticos recurrentes generados por Futures Lab.",
        },
        regimes: {
          title: "Análisis de régimen",
          description:
            "Resume el estado del mercado sin ejecución de operaciones ni asesoría financiera.",
        },
      },
    },
    dashboard: {
      intelligenceBrief: {
        title: "Resumen Ejecutivo",
        description:
          "Observaciones actuales de Futures Lab resumidas en una síntesis breve.",
      },
      changeAwareness: {
        title: "Qué Cambió",
        description: "Ventana actual vs. ventana base.",
      },
      marketSummary: {
        marketsShown: "Mercados mostrados",
        topSymbol: "Símbolo líder",
        topScore: "Puntaje superior",
        lastUpdated: "Actualizado",
      },
      rankingGuide: {
        title: "Guía del Ranking",
        description:
          "Futures Lab rankea los mercados de futuros activos por fortaleza cuantitativa actual.",
        scoreNote:
          "Los puntajes van de 0 a 100. Un valor más alto indica evidencia de scanner más fuerte.",
        sourceNote:
          "Las razones y métricas de apoyo provienen directamente de la salida del scanner de Futures Lab.",
        latestScan: "Último escaneo",
      },
      marketRankings: {
        title: "Ranking de Mercados",
        description:
          "Salida real del scanner de Futures Lab ordenada por ranking.",
        empty:
          "Todavía no hay ranking de mercados disponible. Futures Lab puede estar esperando su siguiente corrida.",
        headers: {
          rank: "Posición",
          context: "Contexto",
          direction: "Dirección",
          regime: "Régimen",
          metrics: "Métricas de apoyo",
          score: "Puntaje",
        },
        metrics: {
          change: "Cambio",
          trend: "Tendencia",
          volatility: "Volatilidad",
          funding: "Funding",
        },
      },
      recentDecisions: {
        title: "Decisiones Recientes",
        description:
          "Actividad reciente de investigación de Futures Lab a partir de registros de decisión existentes.",
        empty: "No hay registros recientes de decisiones de laboratorio.",
        fields: {
          type: "Tipo",
          rr: "R/R",
          setup: "Setup",
        },
      },
      setupMemory: {
        title: "Memoria de Setups",
        description:
          "Observaciones históricas de Futures Lab sobre patrones de setup recurrentes.",
        empty: "No hay registros de memoria de setups disponibles.",
        metrics: {
          trades: "Operaciones",
          winRate: "Tasa de acierto",
          health: "Salud",
          pnl: "PnL",
          averagePnl: "PnL promedio",
        },
      },
      ghostTracking: {
        title: "Seguimiento Fantasma",
        description:
          "Observaciones post-evaluación de oportunidades rechazadas por Futures Lab.",
        empty: "No hay registros de ghost tracking disponibles.",
        metrics: {
          settled: "Liquidados",
          pending: "Pendientes",
          positiveRate: "Tasa positiva",
          averageHypotheticalPnl: "PnL hipotético promedio",
          total: "Total",
          positive: "Positivos",
        },
        lastSettled: "Último ghost liquidado",
      },
      opportunityRankings: {
        title: "Ranking de Oportunidades",
        description:
          "Oportunidades estadísticas rankeadas por la capa de API mock.",
        horizon: "Horizonte",
        confidence: "Confianza",
      },
      patternDiscovery: {
        title: "Descubrimiento de Patrones",
        description:
          "Resultados recurrentes observados en datos históricos de Futures Lab.",
        occurrences: "ocurrencias",
      },
      regimeAnalysis: {
        title: "Análisis de Régimen",
        description:
          "Estimaciones actuales del estado de mercado con contexto de probabilidad y volatilidad.",
        probability: "Probabilidad",
      },
    },
  },
  en: {
    banner: {
      title: "Public demo",
      message:
        "This public demonstration uses sample research data for product evaluation.",
    },
    topBar: {
      snapshot: "Intelligence snapshot",
      generated: "Generated",
      publicDemo: "Public demo",
      overview: "Overview",
      language: "Language",
    },
    sidebar: {
      dashboard: "Dashboard",
      markets: "Markets",
      opportunities: "Opportunities",
      patterns: "Patterns",
      regimes: "Regimes",
    },
    landing: {
      eyebrow: "Quantitative market intelligence",
      title: "ProofOfConsistency Intelligence Platform",
      description:
        "A lightweight SaaS interface for market rankings, opportunity rankings, pattern discovery and regime analysis generated by the existing Futures Lab backend.",
      primaryAction: "View intelligence",
      secondaryAction: "Review rankings",
      disclaimer:
        "This platform does not execute trades and does not provide financial advice.",
      metrics: {
        consistency: "Consistency score",
        regimes: "Active regimes",
        patterns: "Patterns found",
        markets: "Markets ranked",
        topSignal: "Current top signal",
        topSignalDetail:
          "Mock snapshot for public product validation.",
      },
      pillars: {
        markets: {
          title: "Market rankings",
          description:
            "Rank futures markets by consistency, regime and directional context.",
        },
        patterns: {
          title: "Pattern discovery",
          description:
            "Surface recurring statistical patterns generated by Futures Lab.",
        },
        regimes: {
          title: "Regime analysis",
          description:
            "Summarize market state without trade execution or financial advice.",
        },
      },
    },
    dashboard: {
      intelligenceBrief: {
        title: "Intelligence Brief",
        description:
          "Current Futures Lab observations, summarized as a concise brief.",
      },
      changeAwareness: {
        title: "What Changed",
        description: "Current window vs. baseline window.",
      },
      marketSummary: {
        marketsShown: "Markets shown",
        topSymbol: "Top ranked symbol",
        topScore: "Top score",
        lastUpdated: "Last updated",
      },
      rankingGuide: {
        title: "Ranking Guide",
        description:
          "Futures Lab ranks active futures markets by current quantitative strength.",
        scoreNote:
          "Scores run from 0 to 100. Higher scores indicate stronger scanner evidence.",
        sourceNote:
          "Reasons and supporting metrics come directly from Futures Lab scanner output.",
        latestScan: "Latest scan",
      },
      marketRankings: {
        title: "Market Rankings",
        description: "Real Futures Lab scanner output ordered by rank.",
        empty:
          "No market rankings are available yet. Futures Lab may still be waiting for its next scanner run.",
        headers: {
          rank: "Rank",
          context: "Market context",
          direction: "Direction",
          regime: "Regime",
          metrics: "Supporting metrics",
          score: "Score",
        },
        metrics: {
          change: "Change",
          trend: "Trend",
          volatility: "Volatility",
          funding: "Funding",
        },
      },
      recentDecisions: {
        title: "Recent Lab Decisions",
        description:
          "Recent Futures Lab research activity from existing decision records.",
        empty: "No recent lab decision records are available from Futures Lab.",
        fields: {
          type: "Type",
          rr: "R/R",
          setup: "Setup",
        },
      },
      setupMemory: {
        title: "Setup Memory",
        description:
          "Historical Futures Lab observations for recurring setup patterns.",
        empty: "No setup memory records are available from Futures Lab.",
        metrics: {
          trades: "Trades",
          winRate: "Win rate",
          health: "Health",
          pnl: "PnL",
          averagePnl: "Avg PnL",
        },
      },
      ghostTracking: {
        title: "Ghost Tracking",
        description:
          "Post-evaluation observations from rejected Futures Lab opportunities.",
        empty: "No ghost tracking records are available from Futures Lab.",
        metrics: {
          settled: "Settled",
          pending: "Pending",
          positiveRate: "Positive rate",
          averageHypotheticalPnl: "Avg hypothetical PnL",
          total: "Total",
          positive: "Positive",
        },
        lastSettled: "Last settled ghost",
      },
      opportunityRankings: {
        title: "Opportunity rankings",
        description: "Ranked statistical opportunities from the mock API layer.",
        horizon: "Horizon",
        confidence: "Confidence",
      },
      patternDiscovery: {
        title: "Pattern discovery",
        description:
          "Recurring outcomes discovered across historical Futures Lab data.",
        occurrences: "occurrences",
      },
      regimeAnalysis: {
        title: "Regime analysis",
        description:
          "Current market state estimates with probability and volatility context.",
        probability: "Probability",
      },
    },
  },
} as const;

export function resolveLocale(value?: string | null): Locale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

export function getAvailableLocaleLabel(locale: Locale) {
  return localeLabels[locale];
}

export function getCopy(locale: Locale) {
  return copy[locale];
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(locale === "es" ? "es-CO" : "en-US", {
    maximumFractionDigits: 4,
    ...options,
  }).format(value);
}

export function translateDirection(value: string, locale: Locale) {
  if (locale === "en") {
    return value;
  }

  if (value === "Bullish") {
    return "Alcista";
  }

  if (value === "Bearish") {
    return "Bajista";
  }

  return "Neutral";
}

export function translateSignalStatus(value: string, locale: Locale) {
  if (locale === "en") {
    return value;
  }

  if (value === "Signal OK") {
    return "Señal válida";
  }

  if (value === "Signal not OK") {
    return "Señal no válida";
  }

  return value;
}

export function translateSide(value: string, locale: Locale) {
  if (locale === "en") {
    return value;
  }

  if (value === "Long") {
    return "Largo";
  }

  if (value === "Short") {
    return "Corto";
  }

  if (value === "Neutral") {
    return "Neutral";
  }

  return value;
}

export function translateVolatility(value: string, locale: Locale) {
  if (locale === "en") {
    return value;
  }

  if (value === "High") {
    return "Alta";
  }

  if (value === "Medium") {
    return "Media";
  }

  if (value === "Low") {
    return "Baja";
  }

  return value;
}

export function translateFreshnessLabel(value: string, locale: Locale) {
  if (locale === "en") {
    return value;
  }

  if (value === "Scanner freshness") {
    return "Frescura del scanner";
  }

  if (value === "Decision freshness") {
    return "Frescura de decisiones";
  }

  if (value === "Observations freshness") {
    return "Frescura de observaciones";
  }

  return value;
}

