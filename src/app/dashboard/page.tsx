import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { getIntelligenceSnapshot } from "@/services/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const snapshot = await getIntelligenceSnapshot();

  return <DashboardShell snapshot={snapshot} />;
}
