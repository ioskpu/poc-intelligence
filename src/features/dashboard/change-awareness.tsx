import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipLabel } from "@/components/ui/tooltip-label";
import { getCopy, type Locale } from "@/lib/i18n";
import { getDashboardHumanization } from "@/lib/dashboard-humanization";
import type { ChangeAwareness as ChangeAwarenessData } from "@/types/intelligence";

type ChangeAwarenessProps = {
  changeAwareness: ChangeAwarenessData;
  locale: Locale;
};

export function ChangeAwareness({ changeAwareness, locale }: ChangeAwarenessProps) {
  const copy = getCopy(locale);
  const humanization = getDashboardHumanization(locale);

  return (
    <Card id="change-awareness">
      <CardHeader>
        <CardTitle>{copy.dashboard.changeAwareness.title}</CardTitle>
        <CardDescription>
          {changeAwareness.currentWindow} vs {changeAwareness.baselineWindow}.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {changeAwareness.items.map((item) => (
          <article className="rounded-md border bg-background p-3" key={item.label}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              <TooltipLabel
                label={translateChangeLabel(item.label, locale)}
                tooltip={getChangeTooltip(item.label, humanization.tooltips)}
                className="text-inherit"
                labelClassName="text-inherit"
              />
            </p>
            <p className="mt-2 text-sm font-semibold leading-5">
              {item.statement}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.detail}
            </p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
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
