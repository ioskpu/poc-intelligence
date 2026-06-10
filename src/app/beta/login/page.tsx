import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { BetaLoginForm } from "@/features/private-beta/beta-login-form";
import { LOCALE_COOKIE_NAME, resolveLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beta Access | POC Intelligence",
  robots: {
    index: false,
    follow: false,
  },
};

type BetaLoginPageProps = {
  searchParams?: Promise<{
    lang?: string;
    next?: string;
    error?: string;
  }> | {
    lang?: string;
    next?: string;
    error?: string;
  };
};

export default async function BetaLoginPage({ searchParams }: BetaLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const locale = resolveLocale(
    resolvedSearchParams?.lang ?? cookieStore.get(LOCALE_COOKIE_NAME)?.value,
  );
  const nextPath = readSafeNextPath(resolvedSearchParams?.next);

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground">
      <section className="mx-auto max-w-lg space-y-5">
        <div className="flex justify-end">
          <LanguageSwitcher locale={locale} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "es" ? "Acceso Beta Research" : "Beta Research Access"}
            </CardTitle>
            <CardDescription>
              {locale === "es"
                ? "Ingresa con el email aprobado para recibir un magic link."
                : "Sign in with an approved email to receive a magic link."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resolvedSearchParams?.error ? (
              <p className="rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
                {locale === "es"
                  ? "El enlace no es valido o ya expiro. Solicita uno nuevo."
                  : "The link is invalid or expired. Request a new one."}
              </p>
            ) : null}
            <BetaLoginForm locale={locale} nextPath={nextPath} />
            <p className="text-xs leading-5 text-muted-foreground">
              {locale === "es"
                ? "Solo los usuarios aprobados manualmente pueden activar Beta Research."
                : "Only manually approved users can activate Beta Research."}
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function readSafeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}
