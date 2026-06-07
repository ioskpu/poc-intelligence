import { Activity, CircleHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

type TopBarProps = {
  generatedAt: string;
};

export function TopBar({ generatedAt }: TopBarProps) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(generatedAt));

  return (
    <header className="flex min-h-16 items-center justify-between border-b bg-background px-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Intelligence snapshot
        </p>
        <p className="text-sm text-foreground">Generated {formattedDate}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone="positive">
          <Activity className="mr-1 h-3 w-3" aria-hidden="true" />
          Mock API online
        </Badge>
        <ButtonLink href="/" variant="ghost" size="sm">
          <CircleHelp className="h-4 w-4" aria-hidden="true" />
          Overview
        </ButtonLink>
      </div>
    </header>
  );
}
