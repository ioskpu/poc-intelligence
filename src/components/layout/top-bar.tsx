import { Activity, CircleHelp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { formatDate, getCopy, type Locale } from "@/lib/i18n";

type TopBarProps = {
  generatedAt: string;
  locale: Locale;
  betaLive?: boolean;
};

export function TopBar({ generatedAt, locale, betaLive = false }: TopBarProps) {
  const copy = getCopy(locale);
  const formattedDate = formatDate(generatedAt, locale);

  return (
    <header className="flex min-h-16 items-center justify-between border-b bg-background px-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {copy.topBar.snapshot}
        </p>
        <p className="text-sm text-foreground">
          {copy.topBar.generated} {formattedDate}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={betaLive ? "warning" : "info"}>
          <Activity className="mr-1 h-3 w-3" aria-hidden="true" />
          {betaLive ? copy.topBar.betaLive : copy.topBar.publicDemo}
        </Badge>
        <LanguageSwitcher locale={locale} />
        <ButtonLink href="/" variant="ghost" size="sm">
          <CircleHelp className="h-4 w-4" aria-hidden="true" />
          {copy.topBar.overview}
        </ButtonLink>
      </div>
    </header>
  );
}
