import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChangeAwareness as ChangeAwarenessData } from "@/types/intelligence";

type ChangeAwarenessProps = {
  changeAwareness: ChangeAwarenessData;
};

export function ChangeAwareness({ changeAwareness }: ChangeAwarenessProps) {
  return (
    <Card id="change-awareness">
      <CardHeader>
        <CardTitle>What Changed</CardTitle>
        <CardDescription>
          {changeAwareness.currentWindow} compared with {changeAwareness.baselineWindow}.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-4">
        {changeAwareness.items.map((item) => (
          <article className="rounded-md border bg-background p-3" key={item.label}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {item.label}
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
