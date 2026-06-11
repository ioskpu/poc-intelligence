import { ShieldCheck, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { SignOutButton } from "@/components/layout/sign-out-button";
import type { Locale } from "@/lib/i18n";
import type { BetaSession } from "@/lib/beta-auth";

type SessionNavigationProps = {
  locale: Locale;
  session: BetaSession | null;
  compact?: boolean;
};

export function SessionNavigation({
  locale,
  session,
  compact = false,
}: SessionNavigationProps) {
  const copy = getSessionNavigationCopy(locale);
  const isAdmin = session?.account.role === "admin";

  if (!session) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <ButtonLink href="/dashboard" variant="ghost" size="sm">
          {copy.observatory}
        </ButtonLink>
        <ButtonLink href="/beta/login" variant="outline" size="sm">
          {copy.signIn}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone={isAdmin ? "warning" : "positive"} className={compact ? "hidden sm:inline-flex" : undefined}>
        {isAdmin ? (
          <ShieldCheck className="mr-1 h-3 w-3" aria-hidden="true" />
        ) : (
          <UserCircle className="mr-1 h-3 w-3" aria-hidden="true" />
        )}
        {isAdmin ? copy.adminAccess : copy.betaAccess}
      </Badge>
      <ButtonLink href="/dashboard" variant="ghost" size="sm">
        {copy.observatory}
      </ButtonLink>
      {isAdmin ? (
        <ButtonLink href="/admin/private-beta" variant="ghost" size="sm">
          {copy.administration}
        </ButtonLink>
      ) : null}
      <ButtonLink href="/account" variant="outline" size="sm">
        {copy.account}
      </ButtonLink>
      <SignOutButton label={copy.signOut} />
    </div>
  );
}

function getSessionNavigationCopy(locale: Locale) {
  if (locale === "es") {
    return {
      observatory: "Observatorio",
      signIn: "Ingresar",
      signOut: "Salir",
      account: "Cuenta",
      administration: "Administracion",
      betaAccess: "Beta activa",
      adminAccess: "Admin",
    };
  }

  return {
    observatory: "Observatory",
    signIn: "Sign In",
    signOut: "Sign Out",
    account: "Account",
    administration: "Administration",
    betaAccess: "Beta Access Active",
    adminAccess: "Admin Access",
  };
}
