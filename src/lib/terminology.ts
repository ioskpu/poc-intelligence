import type { Locale } from "@/lib/i18n";

export type TerminologyEntry = {
  key: string;
  label: string;
  tooltip: Record<Locale, string>;
};

const terminologyEntries: readonly TerminologyEntry[] = [
  {
    key: "setup",
    label: "Setup",
    tooltip: {
      es: "Setup se mantiene en inglés para conservar el lenguaje operativo de investigación.",
      en: "Setup stays in English to preserve the research workflow vocabulary.",
    },
  },
  {
    key: "ranking",
    label: "Ranking",
    tooltip: {
      es: "Ranking se mantiene en inglés porque describe la jerarquía del observatorio.",
      en: "Ranking stays in English because it names the observatory's ordering layer.",
    },
  },
  {
    key: "scanner",
    label: "Scanner",
    tooltip: {
      es: "Scanner se mantiene en inglés para coincidir con el lenguaje del laboratorio.",
      en: "Scanner stays in English to match the lab's research language.",
    },
  },
  {
    key: "ghost-tracking",
    label: "Ghost Tracking",
    tooltip: {
      es: "Ghost Tracking se mantiene en inglés como nombre del módulo de observaciones rechazadas.",
      en: "Ghost Tracking stays in English as the name of the rejected-opportunity observation layer.",
    },
  },
  {
    key: "futures",
    label: "Futures",
    tooltip: {
      es: "Futures se mantiene en inglés porque es el dominio operativo del producto.",
      en: "Futures stays in English because it is the product's operating domain.",
    },
  },
  {
    key: "long",
    label: "Long",
    tooltip: {
      es: "Long se mantiene en inglés para conservar el lenguaje de mercado.",
      en: "Long stays in English to preserve market terminology.",
    },
  },
  {
    key: "short",
    label: "Short",
    tooltip: {
      es: "Short se mantiene en inglés para conservar el lenguaje de mercado.",
      en: "Short stays in English to preserve market terminology.",
    },
  },
] as const;

export function getTerminologyEntries(locale: Locale) {
  return terminologyEntries.map((entry) => ({
    key: entry.key,
    label: entry.label,
    tooltip: entry.tooltip[locale],
  }));
}
