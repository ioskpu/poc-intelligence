import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Search, 
  Eye,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipLabel } from "@/components/ui/tooltip-label";
import { type Locale } from "@/lib/i18n";
import { getDashboardHumanization } from "@/lib/dashboard-humanization";
import type { ChangeAwareness as ChangeAwarenessData } from "@/types/intelligence";

type ChangeAwarenessProps = {
  changeAwareness: ChangeAwarenessData;
  locale: Locale;
};

export function ChangeAwareness({ changeAwareness, locale }: ChangeAwarenessProps) {
  const humanization = getDashboardHumanization(locale);

  const title = locale === "es" ? "Novedades del Mercado" : "Market Updates";
  const subtitle = locale === "es" 
    ? "Cambios significativos detectados en el comportamiento reciente del mercado." 
    : "Significant changes detected in recent market behavior.";

  return (
    <Card id="change-awareness" className="border-muted shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/5 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary/70" />
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </div>
        <CardDescription className="mt-1 text-xs">
          {subtitle} <span className="text-muted-foreground italic font-medium">({changeAwareness.currentWindow} vs {changeAwareness.baselineWindow})</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {changeAwareness.items.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-muted">
            <CheckCircle2 className="mx-auto h-10 w-10 mb-3 opacity-20 text-emerald-500" />
            <p className="text-sm font-medium">
              {locale === "es" 
                ? "El mercado se mantiene estable. No hay cambios significativos que reportar en este momento." 
                : "The market remains stable. No significant changes to report at this time."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {changeAwareness.items.map((item) => {
              const icon = getChangeIcon(item.label, item.statement);
              return (
                <article 
                  className="group relative flex flex-col rounded-xl border border-muted bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md" 
                  key={item.label}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-muted/50 p-1.5">
                        {icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                        <TooltipLabel
                          label={translateChangeLabel(item.label, locale)}
                          tooltip={getChangeTooltip(item.label, humanization.tooltips)}
                          className="text-inherit"
                          labelClassName="text-inherit"
                        />
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-bold leading-snug text-foreground/90 group-hover:text-primary transition-colors">
                    {item.statement}
                  </p>
                  
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground italic line-clamp-2">
                    {item.detail}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getChangeIcon(label: string, statement: string) {
  const s = statement.toLowerCase();
  
  if (s.includes("increased") || s.includes("up") || s.includes("subió") || s.includes("incrementó")) {
    return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500/70" />;
  }
  
  if (s.includes("decreased") || s.includes("down") || s.includes("bajó") || s.includes("disminuyó")) {
    return <ArrowDownRight className="h-3.5 w-3.5 text-amber-500/70" />;
  }

  if (label === "Ranking leader") return <Sparkles className="h-3.5 w-3.5 text-blue-500/70" />;
  if (label === "Research activity") return <Search className="h-3.5 w-3.5 text-purple-500/70" />;
  if (label === "Ghost tracking") return <Eye className="h-3.5 w-3.5 text-slate-500/70" />;
  
  return <Activity className="h-3.5 w-3.5 text-muted-foreground/70" />;
}

function translateChangeLabel(label: string, locale: Locale) {
  if (label === "Ranking leader") {
    return locale === "es" ? "Líder del ranking" : "Ranking leader";
  }

  if (label === "Directional bias") {
    return locale === "es" ? "Sesgo direccional" : "Directional bias";
  }

  if (label === "Research activity") {
    return locale === "es" ? "Actividad de investigación" : "Research activity";
  }

  if (label === "Ghost tracking") {
    return "Ghost Tracking";
  }

  return label;
}

function getChangeTooltip(
  label: string,
  tooltips: ReturnType<typeof getDashboardHumanization>["tooltips"],
) {
  if (label === "Ranking leader") {
    return tooltips.rankingLeader;
  }

  if (label === "Directional bias") {
    return tooltips.directionalBias;
  }

  if (label === "Research activity") {
    return tooltips.researchActivity;
  }

  return tooltips.ghostTracking;
}
