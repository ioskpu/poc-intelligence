import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCopy, type Locale } from "@/lib/i18n";
import type { IntelligenceBrief as IntelligenceBriefData } from "@/types/intelligence";

type IntelligenceBriefProps = {
  brief: IntelligenceBriefData;
  locale: Locale;
};

export function IntelligenceBrief({ brief, locale }: IntelligenceBriefProps) {
  const copy = getCopy(locale);

  return (
    <Card id="intelligence-brief">
      <CardHeader>
        <CardTitle>{copy.dashboard.intelligenceBrief.title}</CardTitle>
        <CardDescription>{copy.dashboard.intelligenceBrief.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-base font-semibold leading-6">{brief.headline}</p>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          {brief.items.map((item) => (
            <article className="rounded-md border bg-background p-3" key={item.label}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-semibold">{item.value}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
