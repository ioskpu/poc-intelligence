import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SessionNavigation } from "@/components/layout/session-navigation";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { getCurrentBetaSession } from "@/services/api/beta-auth";
import { formatDate, LOCALE_COOKIE_NAME, resolveLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account | POC Intelligence",
  robots: {
    index: false,
    follow: false,
  },
};

type AccountPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }> | {
    lang?: string;
  };
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const locale = resolveLocale(
    resolvedSearchParams?.lang ?? cookieStore.get(LOCALE_COOKIE_NAME)?.value,
  );
  const session = await getCurrentBetaSession();

  if (!session) {
    redirect("/beta/login?next=/account");
  }

  const copy = getAccountCopy(locale);
  const isAdmin = session.account.role === "admin";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">POC Intelligence</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {copy.kicker}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <SessionNavigation locale={locale} session={session} compact />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div className="space-y-2">
          <Badge tone={isAdmin ? "warning" : "positive"} className="w-fit">
            {isAdmin ? copy.adminBadge : copy.betaBadge}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-normal">{copy.title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AccountField label={copy.email} value={session.account.email} />
          <AccountField label={copy.name} value={session.account.name} />
          <AccountField label={copy.role} value={formatRole(session.account.role, locale)} />
          <AccountField label={copy.status} value={formatStatus(session.account.status, locale)} />
          <AccountField
            label={copy.expiresAt}
            value={formatDate(session.expiresAt, locale)}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/dashboard">{copy.openObservatory}</ButtonLink>
          {isAdmin ? (
            <ButtonLink href="/admin/private-beta" variant="outline">
              {copy.openAdmin}
            </ButtonLink>
          ) : null}
          <SignOutButton label={copy.signOut} />
        </div>
      </section>
    </main>
  );
}

function AccountField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

function formatRole(role: string, locale: "es" | "en") {
  if (role === "admin") {
    return locale === "es" ? "Administrador" : "Admin";
  }

  return locale === "es" ? "Usuario beta" : "Beta user";
}

function formatStatus(status: string, locale: "es" | "en") {
  if (status === "Active") {
    return locale === "es" ? "Activo" : "Active";
  }

  return locale === "es" ? "Revocado" : "Revoked";
}

function getAccountCopy(locale: "es" | "en") {
  if (locale === "es") {
    return {
      kicker: "Cuenta",
      title: "Estado de acceso",
      description:
        "Resumen de la sesion activa y del nivel de acceso disponible para esta cuenta.",
      betaBadge: "Beta activa",
      adminBadge: "Admin",
      email: "Email",
      name: "Nombre",
      role: "Rol",
      status: "Estado",
      expiresAt: "Sesion expira",
      openObservatory: "Abrir observatorio",
      openAdmin: "Administracion",
      signOut: "Salir",
    };
  }

  return {
    kicker: "Account",
    title: "Access status",
    description:
      "Summary of the active session and access level available to this account.",
    betaBadge: "Beta Access Active",
    adminBadge: "Admin Access",
    email: "Email",
    name: "Name",
    role: "Role",
    status: "Status",
    expiresAt: "Session expires",
    openObservatory: "Open Observatory",
    openAdmin: "Administration",
    signOut: "Sign Out",
  };
}
