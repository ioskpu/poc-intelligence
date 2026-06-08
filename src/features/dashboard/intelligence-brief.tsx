import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { IntelligenceBrief as IntelligenceBriefData } from "@/types/intelligence";

type IntelligenceBriefProps = {
  brief: IntelligenceBriefData;
};

export function IntelligenceBrief({ brief }: IntelligenceBriefProps) {
  return (
    <Card id="intelligence-brief">
      <CardHeader>
        <CardTitle>Intelligence Brief</CardTitle>
        <CardDescription>
          Current Futures Lab observations, summarized without recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base font-semibold leading-6">{brief.headline}</p>
        <div className="grid gap-3 lg:grid-cols-5">
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
