import { 
  Flame, 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  Brain
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";
import type { IntelligenceSnapshot } from "@/types/intelligence";
import { cn } from "@/lib/utils";

type InsightCardsProps = {
  snapshot: IntelligenceSnapshot;
  locale: Locale;
};

export function InsightCards({ snapshot, locale }: InsightCardsProps) {
  const topMarket = snapshot.marketRankings[0];
  const labDecisions = snapshot.labDecisions;
  const recentRejection = labDecisions.find(d => d.decisionType.toLowerCase().includes("rejected") || d.reason.toLowerCase().includes("discarded") || d.reason.toLowerCase().includes("align"));
  
  const bearishMarkets = snapshot.marketRankings.filter(r => r.direction === "Bearish").length;
  const bullishMarkets = snapshot.marketRankings.filter(r => r.direction === "Bullish").length;
  
  const cards = [
    topMarket ? {
      title: locale === "es" ? "Mercado más fuerte" : "Strongest market",
      value: topMarket.symbol,
      description: locale === "es" ? "Máximo puntaje en scanner" : "Highest scanner score",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    } : null,
    bearishMarkets > bullishMarkets ? {
      title: locale === "es" ? "Sesgo predominante" : "Predominant bias",
      value: locale === "es" ? "Presión bajista" : "Bearish pressure",
      description: locale === "es" ? "Mayoría de señales cortas" : "Majority of short signals",
      icon: TrendingDown,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    } : {
      title: locale === "es" ? "Sesgo predominante" : "Predominant bias",
      value: locale === "es" ? "Presión alcista" : "Bullish pressure",
      description: locale === "es" ? "Mayoría de señales largas" : "Majority of long signals",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    labDecisions.length > 0 ? {
      title: locale === "es" ? "Actividad reciente" : "Recent activity",
      value: `${labDecisions.length} ${locale === "es" ? "decisiones" : "decisions"}`,
      description: locale === "es" ? "Investigación activa" : "Active research",
      icon: Zap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    } : null,
    recentRejection ? {
      title: locale === "es" ? "Oportunidad descartada" : "Opportunity discarded",
      value: recentRejection.symbol,
      description: locale === "es" ? "Conflicto de señales" : "Signal conflict",
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    } : null,
    snapshot.setupMemory.length === 0 ? {
      title: locale === "es" ? "Memoria de setups" : "Setup memory",
      value: locale === "es" ? "Datos limitados" : "Limited data",
      description: locale === "es" ? "Sin historial suficiente" : "Insufficient history",
      icon: Brain,
      color: "text-muted-foreground",
      bg: "bg-muted",
    } : null,
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => card && (
        <Card key={i} className="overflow-hidden border-muted/60 transition-all hover:border-primary/30 hover:shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-stretch">
              <div className={cn("flex w-12 items-center justify-center", card.bg)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
              <div className="flex-1 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {card.title}
                </p>
                <p className="mt-0.5 text-base font-bold text-foreground">
                  {card.value}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">
                  {card.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
