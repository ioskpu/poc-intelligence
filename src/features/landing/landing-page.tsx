import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { PublicDemoBanner } from "@/components/layout/public-demo-banner";
import { getCopy, type Locale } from "@/lib/i18n";
import { getTerminologyEntries } from "@/lib/terminology";
import { LandingBenefitVisual, LandingBrandSlot, LandingProductMockup } from "@/features/landing/landing-visuals";
import { PrivateBetaSection } from "@/features/private-beta/private-beta-section";

type LandingPageProps = {
  locale: Locale;
};

export function LandingPage({ locale }: LandingPageProps) {
  const copy = getCopy(locale);
  const terminologyEntries = getTerminologyEntries(locale);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicDemoBanner locale={locale} />

      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <LandingBrandSlot />
            <p className="text-sm font-semibold">POC Intelligence</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {copy.banner.title}
            </div>
            <LanguageSwitcher locale={locale} />
            <ButtonLink href="/dashboard" size="sm">
              {copy.landing.primaryAction}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <p className="text-sm font-medium text-primary">{copy.landing.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight tracking-normal">
            {copy.landing.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {copy.landing.description}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            {copy.landing.audienceNote}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/dashboard" size="lg">
              {copy.landing.primaryAction}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#private-beta" variant="outline" size="lg">
              {copy.landing.secondaryAction}
            </ButtonLink>
          </div>

          <p className="mt-6 max-w-xl text-sm text-muted-foreground">
            {copy.landing.disclaimer}
          </p>
        </div>

        <LandingProductMockup locale={locale} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{copy.landing.benefits.title}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {copy.landing.benefits.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <LandingBenefitVisual locale={locale} benefitKey="changed" />
          <LandingBenefitVisual locale={locale} benefitKey="rankings" />
          <LandingBenefitVisual locale={locale} benefitKey="brief" />
          <LandingBenefitVisual locale={locale} benefitKey="ghosts" />
        </div>
      </section>

      <PrivateBetaSection locale={locale} />

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Card>
          <CardHeader>
            <CardTitle>{copy.landing.terminology.title}</CardTitle>
            <CardDescription className="leading-6">{copy.landing.terminology.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {terminologyEntries.map((entry) => (
                <Badge key={entry.key} tone="info">
                  {entry.label}
                </Badge>
              ))}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{copy.landing.terminology.note}</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
