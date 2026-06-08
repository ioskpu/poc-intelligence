import { Badge } from "@/components/ui/badge";
import type { Locale } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";

type PublicDemoBannerProps = {
  locale: Locale;
};

export function PublicDemoBanner({ locale }: PublicDemoBannerProps) {
  const copy = getCopy(locale);

  return (
    <section className="border-b border-primary/20 bg-primary/10 px-5 py-3">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <Badge tone="info">{copy.banner.title}</Badge>
        <p className="text-sm leading-6 text-foreground">{copy.banner.message}</p>
      </div>
    </section>
  );
}
