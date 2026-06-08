import { cookies } from "next/headers";
import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { getIntelligenceSnapshot } from "@/services/api";
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

  return <DashboardShell locale={locale} snapshot={snapshot} />;
}
