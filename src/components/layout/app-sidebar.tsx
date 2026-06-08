import Link from "next/link";
import { BarChart3, Compass, Gauge, Layers, LayoutDashboard } from "lucide-react";
import { getCopy, type Locale } from "@/lib/i18n";

const navItems = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard#markets", key: "markets", icon: BarChart3 },
  { href: "/dashboard#opportunities", key: "opportunities", icon: Compass },
  { href: "/dashboard#patterns", key: "patterns", icon: Layers },
  { href: "/dashboard#regimes", key: "regimes", icon: Gauge },
] as const;

type AppSidebarProps = {
  locale: Locale;
};

export function AppSidebar({ locale }: AppSidebarProps) {
  const copy = getCopy(locale);

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
