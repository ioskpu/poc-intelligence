import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { PublicDemoBanner } from "@/components/layout/public-demo-banner";
import { getCopy, type Locale } from "@/lib/i18n";
import { getTerminologyEntries } from "@/lib/terminology";
import { LandingBenefitVisual, LandingBrandSlot, LandingProductMockup } from "@/features/landing/landing-visuals";

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

      <section
        id="private-beta"
        className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <Card className="h-full">
          <CardHeader className="space-y-3">
            <Badge tone="info" className="w-fit">
              {copy.landing.privateBeta.badge}
            </Badge>
            <CardTitle>{copy.landing.privateBeta.title}</CardTitle>
            <CardDescription className="leading-6">
              {copy.landing.privateBeta.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <BetaBullet>{copy.landing.privateBeta.bullets.limited}</BetaBullet>
            <BetaBullet>{copy.landing.privateBeta.bullets.gradual}</BetaBullet>
            <BetaBullet>{copy.landing.privateBeta.bullets.reviewed}</BetaBullet>
            <BetaBullet>{copy.landing.privateBeta.bullets.next}</BetaBullet>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>{copy.landing.privateBeta.processTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <ProcessStep index="01" text={copy.landing.privateBeta.bullets.limited} />
            <ProcessStep index="02" text={copy.landing.privateBeta.bullets.reviewed} />
            <ProcessStep index="03" text={copy.landing.privateBeta.bullets.next} />
            <p>{copy.landing.privateBeta.bullets.gradual}</p>
          </CardContent>
        </Card>
      </section>

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

function BetaBullet({ children }: { children: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

function ProcessStep({ index, text }: { index: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-md border bg-muted/40 p-3">
      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border bg-background text-xs font-semibold text-foreground">
        {index}
      </span>
      <p className="pt-1">{text}</p>
    </div>
  );
}
