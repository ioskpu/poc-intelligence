import { cookies } from "next/headers";
import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { getCurrentBetaSession } from "@/services/api/beta-auth";
import { getIntelligenceSnapshot } from "@/services/api";
import { BETA_ONBOARDING_COOKIE_NAME } from "@/lib/beta-auth";
import { LOCALE_COOKIE_NAME, resolveLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }> | {
    lang?: string;
  };
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const snapshot = await getIntelligenceSnapshot();
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const locale = resolveLocale(
    resolvedSearchParams?.lang ?? cookieStore.get(LOCALE_COOKIE_NAME)?.value,
  );
  const betaSession = await getCurrentBetaSession();
  const betaResearchEnabled = betaSession?.account.status === "Active";
  const showOnboarding =
    betaResearchEnabled &&
    cookieStore.get(BETA_ONBOARDING_COOKIE_NAME)?.value === "1";

  return (
    <>
      {showOnboarding ? <BetaOnboardingBanner locale={locale} /> : null}
      <DashboardShell
        locale={locale}
        snapshot={snapshot}
        betaResearchEnabled={betaResearchEnabled}
      />
    </>
  );
}

function BetaOnboardingBanner({ locale }: { locale: "es" | "en" }) {
  const copy =
    locale === "es"
      ? {
          title: "Bienvenido a la beta privada",
          body:
            "Observatory resume el estado publico del mercado. Beta Research agrega profundidad operativa, senales en vivo y contexto experimental mientras validamos esta capa con usuarios privados.",
        }
      : {
          title: "Welcome to the private beta",
          body:
            "Observatory summarizes the public market state. Beta Research adds operational depth, live signals, and experimental context while this layer is validated with private users.",
        };

  return (
    <section className="border-b bg-emerald-50 px-6 py-4 text-emerald-950">
      <div className="mx-auto max-w-7xl space-y-1">
        <p className="text-sm font-semibold">{copy.title}</p>
        <p className="max-w-4xl text-sm leading-6">{copy.body}</p>
      </div>
    </section>
  );
}
