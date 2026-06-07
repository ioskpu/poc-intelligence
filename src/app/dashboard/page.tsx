import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { getIntelligenceSnapshot } from "@/services/api";

export default async function DashboardPage() {
  const snapshot = await getIntelligenceSnapshot();

  return <DashboardShell snapshot={snapshot} />;
}
