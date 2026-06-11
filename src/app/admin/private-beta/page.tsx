import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SessionNavigation } from "@/components/layout/session-navigation";
import { PrivateBetaAdminPanel } from "@/features/private-beta/private-beta-admin-panel";
import {
  getPrivateBetaAdminDataWithSession,
  getPrivateBetaAnalyticsWithSession,
  getPrivateBetaProductAnalyticsWithSession,
} from "@/services/api/private-beta";
import {
  getCurrentBetaSessionToken,
  getCurrentBetaSession,
} from "@/services/api/beta-auth";
import { LOCALE_COOKIE_NAME, resolveLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private Beta Admin | POC Intelligence",
  robots: {
    index: false,
    follow: false,
  },
};

type PrivateBetaAdminPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }> | {
    lang?: string;
  };
};

export default async function PrivateBetaAdminPage({
  searchParams,
}: PrivateBetaAdminPageProps) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const locale = resolveLocale(
    resolvedSearchParams?.lang ?? cookieStore.get(LOCALE_COOKIE_NAME)?.value,
  );
  const session = await getCurrentBetaSession();
  if (!session) {
    redirect("/beta/login?next=/admin/private-beta");
  }
  if (session.account.role !== "admin") {
    redirect("/dashboard");
  }
  const sessionToken = await getCurrentBetaSessionToken();
  if (!sessionToken) {
    throw new Error("Admin session is required");
  }
  const [snapshot, analytics, productAnalytics] = await Promise.all([
    getPrivateBetaAdminDataWithSession(sessionToken),
    getPrivateBetaAnalyticsWithSession(sessionToken),
    getPrivateBetaProductAnalyticsWithSession(sessionToken),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">POC Intelligence</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Private beta admin
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <SessionNavigation locale={locale} session={session} compact />
          </div>
        </div>
      </header>

      <PrivateBetaAdminPanel
        locale={locale}
        snapshot={snapshot}
        analytics={analytics}
        productAnalytics={productAnalytics}
      />
    </div>
  );
}
