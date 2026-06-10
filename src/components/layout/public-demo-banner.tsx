import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

type PublicDemoBannerProps = {
  locale: Locale;
  betaLive?: boolean;
};

export function PublicDemoBanner({ locale, betaLive = false }: PublicDemoBannerProps) {
  const copy = getCopy(locale);
  const banner = betaLive ? copy.banner.betaTitle : copy.banner.title;
  const message = betaLive ? copy.banner.betaMessage : copy.banner.message;

  return (
    <section className={betaLive ? "border-b border-secondary/20 bg-secondary/10 px-5 py-3" : "border-b border-primary/20 bg-primary/10 px-5 py-3"}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <Badge tone="info">{banner}</Badge>
        <p className="text-sm leading-6 text-foreground">{message}</p>
      </div>
    </section>
  );
}
