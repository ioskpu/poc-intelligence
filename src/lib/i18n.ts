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
      betaTitle: "Beta Research",
      betaMessage:
        "Este panel agrega profundidad real de investigación para validar la experiencia con usuarios aprobados.",
    },
    topBar: {
      snapshot: "Resumen de inteligencia",
      generated: "Generado",
      publicDemo: "Demostración pública",
      betaLive: "Beta Research",
      overview: "Inicio",
      language: "Idioma",
    },
    sidebar: {
      dashboard: "Panel",
      markets: "Mercados",
      opportunities: "Oportunidades",
      betaLiveDepth: "Beta Research",
      patterns: "Patrones",
      regimes: "Regímenes",
    },
    landing: {
      eyebrow: "Market Intelligence Observatory",
      title: "Lo que cambió en el mercado desde la última vez que lo miraste.",
      description:
        "Diseñado para traders discrecionales, investigadores cuantitativos y mesas pequeñas que necesitan una lectura rápida del mercado: qué cambió, qué destaca y qué merece otra mirada.",
      primaryAction: "Entrar a la demo",
      secondaryAction: "Ver beta privada",
      disclaimer:
        "No es un scanner, una plataforma de señales, un broker ni un terminal de trading.",
      audienceNote:
        "Pensado para personas que quieren entender el mercado con claridad, no operar desde la interfaz.",
      benefits: {
        title: "Beneficios para el usuario",
        description:
          "Cada bloque responde a una pregunta humana antes de entrar al detalle.",
        items: {
          changed: {
            title: "Qué Cambió",
            description: "Saber qué cambió desde la última visita.",
          },
          rankings: {
            title: "Ranking de Mercados",
            description: "Descubrir qué mercados están destacando ahora.",
          },
          brief: {
            title: "Resumen Ejecutivo",
            description: "Obtener un resumen rápido de los cambios más importantes.",
          },
          ghosts: {
            title: "Seguimiento Fantasma",
            description:
              "Revisar qué ocurrió con oportunidades observadas anteriormente.",
          },
        },
      },
      terminology: {
        title: "Terminología que permanece en inglés",
        description:
          "Estos términos se mantienen en inglés para conservar consistencia operativa y preparar tooltips futuros.",
        note: "La interfaz seguirá traduciendo la narrativa, pero estos nombres no cambian.",
      },
    },
    dashboard: {
      intelligenceBrief: {
        title: "Resumen Ejecutivo",
        description: "Lectura rápida de lo que importa ahora.",
      },
      changeAwareness: {
        title: "Qué Cambió",
        description: "Lo que cambió desde la última revisión.",
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
          "Cómo leer por qué un mercado quedó arriba y qué significa su puntaje.",
        scoreNote:
          "Los puntajes van de 0 a 100. Un valor más alto indica evidencia de scanner más fuerte.",
        sourceNote:
          "Las razones y métricas de apoyo provienen directamente de la salida del scanner de Futures Lab.",
        latestScan: "Último escaneo",
      },
      marketRankings: {
        title: "Ranking de Mercados",
        description: "Mercados que destacan ahora, con la razón visible junto a cada símbolo.",
        empty:
          "Todavía no hay ranking de mercados disponible. Futures Lab puede estar esperando su siguiente corrida.",
        reasonLabel: "Por qué rankea",
        headers: {
          rank: "Posición",
          context: "Contexto",
          direction: "Sesgo direccional",
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
        description: "Lo que este Setup ha mostrado con el tiempo.",
        empty: "No hay registros de memoria de setups disponibles.",
        metrics: {
          trades: "Operaciones",
          winRate: "Tasa de acierto",
          health: "Puntaje de salud",
          pnl: "PnL",
          averagePnl: "PnL promedio",
        },
      },
      ghostTracking: {
        title: "Seguimiento Fantasma",
        description: "Qué pasó después de oportunidades rechazadas.",
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
      betaResearch: {
        badge: "Beta Research",
        description:
          "Capa adicional para usuarios aprobados que necesitan más profundidad de investigación.",
      },
      opportunityRankings: {
        title: "Ranking de Oportunidades",
        description:
          "Oportunidades estadísticas rankeadas por un módulo de investigación experimental.",
        badge: "Módulo de Investigación Experimental",
        note:
          "Esta sección aparece en la demo pública como superficie de evaluación y puede cambiar antes de la beta.",
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
      betaTitle: "Beta Research",
      betaMessage:
        "This panel adds real research depth to validate the approved user experience.",
    },
    topBar: {
      snapshot: "Intelligence snapshot",
      generated: "Generated",
      publicDemo: "Public demo",
      betaLive: "Beta Research",
      overview: "Overview",
      language: "Language",
    },
    sidebar: {
      dashboard: "Dashboard",
      markets: "Markets",
      opportunities: "Opportunities",
      betaLiveDepth: "Beta Research",
      patterns: "Patterns",
      regimes: "Regimes",
    },
    landing: {
      eyebrow: "Market Intelligence Observatory",
      title: "What changed in the market since the last time you looked.",
      description:
        "Built for discretionary traders, quant researchers, and small desks that need a fast read on the market: what changed, what is standing out, and what deserves another look.",
      primaryAction: "Enter the demo",
      secondaryAction: "Explore Private Beta",
      disclaimer:
        "Not a scanner, signal platform, broker, or trading terminal.",
      audienceNote:
        "Made for people who want a clear market read, not execution from the interface.",
      benefits: {
        title: "User benefits",
        description:
          "Each block answers a human question before the detail starts.",
        items: {
          changed: {
            title: "What Changed",
            description: "See what moved since the last visit.",
          },
          rankings: {
            title: "Market Rankings",
            description: "Spot which markets are standing out now.",
          },
          brief: {
            title: "Intelligence Brief",
            description: "Read the most important changes in one quick scan.",
          },
          ghosts: {
            title: "Ghost Tracking",
            description:
              "Review what happened to previously observed opportunities.",
          },
        },
      },
      terminology: {
        title: "Terminology that stays in English",
        description:
          "These terms stay in English to preserve operational consistency and prepare future tooltips.",
        note: "The interface will translate the narrative, but these names stay unchanged.",
      },
    },
    dashboard: {
      intelligenceBrief: {
        title: "Intelligence Brief",
        description: "A quick read on what matters now.",
      },
      changeAwareness: {
        title: "What Changed",
        description: "What moved since the last review.",
      },
      marketSummary: {
        marketsShown: "Markets shown",
        topSymbol: "Top ranked symbol",
        topScore: "Top score",
        lastUpdated: "Last updated",
      },
      rankingGuide: {
        title: "Ranking Guide",
        description: "How to read why a market ranks higher and what its score means.",
        scoreNote:
          "Scores run from 0 to 100. Higher scores indicate stronger scanner evidence.",
        sourceNote:
          "Reasons and supporting metrics come directly from Futures Lab scanner output.",
        latestScan: "Latest scan",
      },
      marketRankings: {
        title: "Market Rankings",
        description: "Markets standing out now, with the reason visible beside each symbol.",
        empty:
          "No market rankings are available yet. Futures Lab may still be waiting for its next scanner run.",
        reasonLabel: "Why ranked",
        headers: {
          rank: "Rank",
          context: "Market context",
          direction: "Directional Bias",
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
        description: "What this Setup has shown over time.",
        empty: "No setup memory records are available from Futures Lab.",
        metrics: {
          trades: "Trades",
          winRate: "Win rate",
          health: "Health Score",
          pnl: "PnL",
          averagePnl: "Avg PnL",
        },
      },
      ghostTracking: {
        title: "Ghost Tracking",
        description: "What happened after rejected opportunities.",
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
      betaResearch: {
        badge: "Beta Research",
        description:
          "Additional depth for approved users who need more research context.",
      },
      opportunityRankings: {
        title: "Opportunity rankings",
        description:
          "Ranked statistical opportunities from an experimental research module.",
        badge: "Experimental Research Module",
        note:
          "This section remains visible in the public demo as an evaluation surface and may change before beta release.",
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
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (locale === "es") {
    if (normalized === "long" || normalized === "long_bias") {
      return "Largo";
    }

    if (normalized === "short" || normalized === "short_bias") {
      return "Corto";
    }

    if (normalized === "neutral") {
      return "Neutral";
    }

    return value;
  }

  if (normalized === "long" || normalized === "long_bias") {
    return "Long";
  }

  if (normalized === "short" || normalized === "short_bias") {
    return "Short";
  }

  if (normalized === "neutral") {
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
