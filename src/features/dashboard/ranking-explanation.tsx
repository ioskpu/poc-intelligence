import { Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RankingExplanationProps = {
  lastUpdatedAt: string;
};

export function RankingExplanation({ lastUpdatedAt }: RankingExplanationProps) {
  return (
    <Card>
      <CardHeader>
        <Info className="h-5 w-5 text-secondary" aria-hidden="true" />
        <CardTitle>Ranking Guide</CardTitle>
        <CardDescription>
          Futures Lab ranks active futures markets by current quantitative strength.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
        <p>Scores run from 0 to 100. Higher scores indicate stronger scanner evidence.</p>
        <p>Reasons and supporting metrics come directly from Futures Lab scanner output.</p>
        <div className="rounded-md border bg-background p-3">
          <p className="text-xs uppercase tracking-wide">Latest scan</p>
          <p className="mt-1 text-foreground">{formatDate(lastUpdatedAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
