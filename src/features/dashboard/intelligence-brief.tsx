import { Brain, Sparkles, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCopy, type Locale } from "@/lib/i18n";
import {
  insufficientDataLabel,
  pendingEvaluationLabel,
  pendingClassificationLabel,
} from "@/lib/observatory-empty-states";
import type { IntelligenceBrief as IntelligenceBriefData } from "@/types/intelligence";

type IntelligenceBriefProps = {
  brief: IntelligenceBriefData | null | undefined;
  locale: Locale;
};

export function IntelligenceBrief({ brief, locale }: IntelligenceBriefProps) {
  const copy = getCopy(locale);

  if (!brief || !brief.items || brief.items.length === 0) {
    return (
      <Card id="intelligence-brief" className="border-muted bg-muted/10">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Brain className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{copy.dashboard.intelligenceBrief.title}</h3>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {locale === "es" 
              ? "El motor de inteligencia está analizando el mercado. Volveremos con un resumen en breve." 
              : "The intelligence engine is analyzing the market. We'll be back with a summary shortly."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="intelligence-brief" className="border-muted shadow-sm">
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <Sparkles className="h-5 w-5 text-primary/80" />
        <div className="space-y-1">
          <CardTitle className="text-xl">
            {locale === "es" ? "Perspectiva del Mercado" : "Market Perspective"}
          </CardTitle>
          <CardDescription>{copy.dashboard.intelligenceBrief.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
          <p className="text-base font-medium leading-relaxed text-foreground/90">
            {brief.headline}
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {brief.items.map((item) => {
            const isWarning = /unknown|pending/i.test(item.value) || /0 times/i.test(item.detail);
            
            return (
              <li 
                key={item.label}
                className="group relative flex flex-col rounded-xl border border-muted bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                    {item.label}
                  </span>
                  {isWarning ? (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500/70" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70" />
                  )}
                </div>
                
                <div className="mb-2">
                  <Badge tone="neutral" className="font-semibold text-xs py-0.5 px-2">
                    {formatBriefValue(item.value, item.detail, locale)}
                  </Badge>
                </div>

                <p className="text-xs leading-5 text-muted-foreground line-clamp-2 italic">
                  {formatBriefDetail(item.detail, locale)}
                </p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function formatBriefValue(value: string, detail: string, locale: Locale) {
  if (/observed 0 times/i.test(detail)) {
    return pendingEvaluationLabel(locale);
  }
  return formatBriefDetail(value, locale);
}

function formatBriefDetail(value: string, locale: Locale) {
  if (!value.trim()) {
    return insufficientDataLabel(locale);
  }

  return value
    .replace(/\bunknown\b/gi, pendingClassificationLabel(locale))
    .replace(/observed 0 times/gi, locale === "es" ? "sin observaciones registradas" : "no observations recorded");
}
