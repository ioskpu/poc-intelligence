import Link from "next/link";
import { BarChart3, Compass, LayoutDashboard, type LucideIcon } from "lucide-react";
import { getCopy, type Locale } from "@/lib/i18n";

type SidebarKey = "dashboard" | "markets" | "opportunities" | "betaLiveDepth";

type AppSidebarProps = {
  locale: Locale;
  betaLive?: boolean;
};

function getNavItems(betaLive: boolean) {
  return [
    { href: "/dashboard", key: "dashboard" as const, icon: LayoutDashboard },
    { href: "/dashboard#markets", key: "markets" as const, icon: BarChart3 },
    betaLive
      ? { href: "/dashboard#beta-live-depth", key: "betaLiveDepth" as const, icon: Compass }
      : { href: "/dashboard#opportunities", key: "opportunities" as const, icon: Compass },
  ] as Array<{ href: string; key: SidebarKey; icon: LucideIcon }>;
}

export function AppSidebar({ locale, betaLive = false }: AppSidebarProps) {
  const copy = getCopy(locale);
  const navItems = getNavItems(betaLive);

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-card px-4 py-5 lg:block">
      <Link href="/" className="block px-2">
        <p className="text-sm font-semibold text-foreground">POC Intelligence</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {locale === "es" ? "Observatorio de investigación" : "Research Observatory"}
        </p>
      </Link>
      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="flex h-10 items-center gap-3 rounded-md px-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {copy.sidebar[item.key]}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
