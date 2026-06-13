import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Activity, 
  AlertTriangle, 
  BarChart3,
  Search,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipLabel } from "@/components/ui/tooltip-label";
import {
  formatNumber,
  getCopy,
  translateDirection,
  type Locale,
} from "@/lib/i18n";
import { getDashboardHumanization } from "@/lib/dashboard-humanization";
import {
  formatDisplayText,
  insufficientDataLabel,
  pendingClassificationLabel,
} from "@/lib/observatory-empty-states";
import type { MarketRanking } from "@/types/intelligence";
import { cn } from "@/lib/utils";

type MarketRankingsProps = {
  rankings: MarketRanking[];
  locale: Locale;
};

export function MarketRankings({ rankings, locale }: MarketRankingsProps) {
  const copy = getCopy(locale);
  const humanization = getDashboardHumanization(locale);

  if (rankings.length === 0) {
    return (
      <Card id="markets" className="border-muted bg-muted/5">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{copy.dashboard.marketRankings.title}</h3>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {locale === "es" 
              ? "El motor de análisis está procesando los datos de mercado. Los rankings aparecerán aquí en breve." 
              : "The analysis engine is processing market data. Rankings will appear here shortly."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="markets" className="border-muted shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-muted/10 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary/70" />
          <CardTitle>{copy.dashboard.marketRankings.title}</CardTitle>
        </div>
        <CardDescription>{copy.dashboard.marketRankings.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[80px] py-4 pl-6">{copy.dashboard.marketRankings.headers.rank}</TableHead>
                <TableHead className="py-4">{copy.dashboard.marketRankings.headers.context}</TableHead>
                <TableHead className="py-4">
                  <TooltipLabel
                    label={copy.dashboard.marketRankings.headers.direction}
                    tooltip={humanization.tooltips.directionalBias}
                    className="text-inherit"
                    labelClassName="text-inherit font-medium"
                  />
                </TableHead>
                <TableHead className="py-4">
                   <TooltipLabel
                    label={locale === "es" ? "Estado" : "Status"}
                    tooltip={humanization.tooltips.regime}
                    className="text-inherit"
                    labelClassName="text-inherit font-medium"
                  />
                </TableHead>
                <TableHead className="py-4 text-right pr-6">
                  {copy.dashboard.marketRankings.headers.score}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((ranking) => (
                <TableRow key={ranking.symbol} className="group border-b border-muted/40 transition-colors hover:bg-muted/5">
                  <TableCell className="py-5 pl-6 font-mono text-muted-foreground">
                    {ranking.rank > 0 ? (
                      <span className="flex items-center gap-1.5 font-bold text-foreground/70">
                        <span className="text-xs text-muted-foreground">#</span>
                        {ranking.rank}
                      </span>
                    ) : (
                      <span className="text-xs italic">{pendingClassificationLabel(locale)}</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="py-5 max-w-[300px]">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tracking-tight text-lg">{ranking.symbol}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 bg-muted px-1.5 rounded">
                          {ranking.market}
                        </span>
                      </div>
                      
                      {ranking.rankingReason ? (
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-1 group-hover:line-clamp-none transition-all">
                          {formatDisplayText(ranking.rankingReason, locale, insufficientDataLabel(locale))}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      {getDirectionIcon(ranking.direction)}
                      <span className={cn(
                        "text-sm font-medium",
                        ranking.direction === "Bullish" ? "text-emerald-600 dark:text-emerald-400" :
                        ranking.direction === "Bearish" ? "text-amber-600 dark:text-amber-400" : 
                        "text-muted-foreground"
                      )}>
                        {translateDirection(ranking.direction, locale)}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-5">
                    <div className="flex flex-col gap-2">
                      <Badge 
                        tone={getDirectionTone(ranking.direction)}
                        className="w-fit shadow-none border-transparent py-0.5 px-2.5"
                      >
                        {ranking.regime}
                      </Badge>
                      
                      <div className="flex gap-3">
                         {ranking.priceChangePct !== null && (
                            <TooltipLabel
                              label={
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                  <BarChart3 className="h-3 w-3" />
                                  {formatNumber(ranking.priceChangePct, locale)}%
                                </div>
                              }
                              tooltip={humanization.tooltips.priceChange}
                            />
                         )}
                         {ranking.realizedVolatilityPct !== null && (
                            <TooltipLabel
                              label={
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                  <Activity className="h-3 w-3" />
                                  {formatNumber(ranking.realizedVolatilityPct, locale)}%
                                </div>
                              }
                              tooltip={humanization.tooltips.volatility}
                            />
                         )}
                         {ranking.fundingRate !== null && (
                            <TooltipLabel
                              label={
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                  <Zap className="h-3 w-3" />
                                  {formatNumber(ranking.fundingRate, locale)}
                                </div>
                              }
                              tooltip={locale === "es" 
                                ? "Costo de mantener la posición. Si es muy alto, el mercado podría corregir." 
                                : "Cost to hold the position. If very high, market might correct."}
                            />
                         )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-5 text-right pr-6">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-black tracking-tighter text-foreground">
                        {formatNumber(ranking.consistencyScore, locale, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-bold">
                        {locale === "es" ? "Puntaje" : "Score"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function getDirectionIcon(direction: MarketRanking["direction"]) {
  switch (direction) {
    case "Bullish":
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    case "Bearish":
      return <TrendingDown className="h-4 w-4 text-amber-500" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
}

function getDirectionTone(direction: MarketRanking["direction"]) {
  if (direction === "Bullish") {
    return "positive";
  }
  if (direction === "Bearish") {
    return "warning";
  }
  return "neutral";
}
