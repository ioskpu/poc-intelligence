import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
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
  const copy = getLoginCopy(locale);

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground">
      <section className="mx-auto max-w-lg space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ButtonLink href="/dashboard" variant="ghost" size="sm">
            {copy.openObservatory}
          </ButtonLink>
          <LanguageSwitcher locale={locale} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{copy.title}</CardTitle>
            <CardDescription>{copy.description}</CardDescription>
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
              {copy.approvedOnly}
            </p>
            <div className="grid gap-2 rounded-md border bg-muted/20 p-3 text-xs leading-5 text-muted-foreground">
              <p>{copy.emailAccess}</p>
              <p>{copy.magicLink}</p>
              <p>{copy.noPassword}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function getLoginCopy(locale: "es" | "en") {
  if (locale === "es") {
    return {
      openObservatory: "Abrir observatorio",
      title: "Ingresar a Beta Research",
      description:
        "Usa el email aprobado para recibir un enlace seguro de acceso.",
      approvedOnly:
        "Solo las cuentas aprobadas pueden activar Beta Research; el Observatorio publico sigue disponible sin iniciar sesion.",
      emailAccess:
        "Si tu cuenta fue aprobada, enviaremos el enlace al email registrado.",
      magicLink:
        "El acceso usa magic link seguro y expira automaticamente.",
      noPassword: "No necesitas crear ni recordar una contrasena.",
    };
  }

  return {
    openObservatory: "Open Observatory",
    title: "Sign in to Beta Research",
    description:
      "Use your approved email to receive a secure access link.",
    approvedOnly:
      "Only approved accounts can activate Beta Research; the public Observatory remains available without signing in.",
    emailAccess:
      "If your account has been approved, the link will be sent to your registered email.",
    magicLink:
      "Access uses a secure magic link and expires automatically.",
    noPassword: "No password is required or stored.",
  };
}

function readSafeNextPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}
