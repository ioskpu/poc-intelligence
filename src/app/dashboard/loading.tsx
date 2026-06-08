import { AppSidebar } from "@/components/layout/app-sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, resolveLocale } from "@/lib/i18n";

export default async function DashboardLoading() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar locale={locale} />
      <div className="min-w-0 flex-1">
        <header className="min-h-16 border-b bg-background px-5 py-4">
          <div className="h-3 w-36 rounded bg-muted" />
          <div className="mt-2 h-4 w-52 rounded bg-muted" />
        </header>
        <div className="space-y-6 p-5">
          <section className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="pt-5">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="mt-3 h-8 w-16 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </section>
          <Card>
            <CardHeader>
              <div className="h-5 w-40 rounded bg-muted" />
              <div className="h-4 w-72 rounded bg-muted" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-10 rounded bg-muted" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
