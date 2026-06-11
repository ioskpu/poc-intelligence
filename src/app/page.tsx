import { cookies } from "next/headers";
import { LandingPage } from "@/features/landing/landing-page";
import { getCurrentBetaSession } from "@/services/api/beta-auth";
import { LOCALE_COOKIE_NAME, resolveLocale } from "@/lib/i18n";

type HomeProps = {
  searchParams?: Promise<{
    lang?: string;
  }> | {
    lang?: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const locale = resolveLocale(
    resolvedSearchParams?.lang ?? cookieStore.get(LOCALE_COOKIE_NAME)?.value,
  );
  const session = await getCurrentBetaSession();

  return <LandingPage locale={locale} session={session} />;
}
