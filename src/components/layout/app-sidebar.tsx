import Link from "next/link";
import { BarChart3, Compass, Gauge, Layers, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard#markets", label: "Markets", icon: BarChart3 },
  { href: "/dashboard#opportunities", label: "Opportunities", icon: Compass },
  { href: "/dashboard#patterns", label: "Patterns", icon: Layers },
  { href: "/dashboard#regimes", label: "Regimes", icon: Gauge },
];

export function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-card px-4 py-5 lg:block">
      <Link href="/" className="block px-2">
        <p className="text-sm font-semibold text-foreground">POC Intelligence</p>
        <p className="mt-1 text-xs text-muted-foreground">ProofOfConsistency</p>
      </Link>
      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex h-10 items-center gap-3 rounded-md px-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
