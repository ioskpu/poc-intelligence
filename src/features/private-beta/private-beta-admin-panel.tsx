"use client";

import { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Unlock, 
  LogIn, 
  Activity, 
  BarChart3, 
  PieChart, 
  ShieldAlert,
  ArrowUpRight,
  MousePointer2,
  Clock,
  Heart,
  TrendingUp,
  Layout
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, type Locale } from "@/lib/i18n";
import {
  getPrivateBetaCopy,
  getPrivateBetaExperienceOptions,
  getPrivateBetaStatusLabel,
} from "@/lib/private-beta-content";
import { PrivateBetaAccountTable } from "@/features/private-beta/private-beta-account-table";
import { PrivateBetaRequestActions } from "@/features/private-beta/private-beta-request-actions";
import { PrivateBetaSessionTable } from "@/features/private-beta/private-beta-session-table";
import { ProductAnalyticsTracker } from "@/features/product-analytics/product-analytics-tracker";
import { cn } from "@/lib/utils";
import type {
  PrivateBetaAdminSnapshot,
  PrivateBetaAnalytics,
  PrivateBetaFeedbackAnalyticsSummary,
  PrivateBetaProductAnalytics,
} from "@/services/api/private-beta";

type PrivateBetaAdminPanelProps = {
  locale: Locale;
  snapshot: PrivateBetaAdminSnapshot;
  analytics: PrivateBetaAnalytics;
  productAnalytics: PrivateBetaProductAnalytics | null;
  feedbackAnalytics: PrivateBetaFeedbackAnalyticsSummary | null;
};

export function PrivateBetaAdminPanel({
  locale,
  snapshot,
  analytics,
  productAnalytics,
  feedbackAnalytics,
}: PrivateBetaAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "analytics" | "perception">("activity");
  const copy = getPrivateBetaCopy(locale);
  
  const pendingRequests = snapshot.requests.filter(
    (request) => request.status === "Pending",
  );
  const invitationsSent = snapshot.accounts.filter(
    (account) => account.invitationSentAt,
  );
  const invitationsUsed = snapshot.accounts.filter(
    (account) => account.invitationUsedAt,
  );
  const firstLoginsCompleted = snapshot.accounts.filter(
    (account) => account.firstLoginCompletedAt,
  );

  return (
    <main className="mx-auto max-w-[1600px] p-4 space-y-4 bg-background text-foreground min-h-screen">
      <ProductAnalyticsTracker
        enabled
        pageViewEvent="admin_dashboard_view"
        pageViewMetadata={{ module: "admin" }}
        events={[]}
      />

      {/* FILA 1: KPIs Compactos */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPICard 
          label={copy.admin.metrics.pendingRequests} 
          value={pendingRequests.length} 
          icon={<UserPlus className="h-4 w-4" />} 
          color="text-amber-500"
        />
        <KPICard 
          label={copy.admin.metrics.approvedAccounts} 
          value={snapshot.accounts.length} 
          icon={<Users className="h-4 w-4" />} 
          color="text-blue-500"
        />
        <KPICard 
          label={copy.admin.metrics.invitationsSent} 
          value={invitationsSent.length} 
          icon={<Mail className="h-4 w-4" />} 
          color="text-purple-500"
        />
        <KPICard 
          label={copy.admin.metrics.invitationsUsed} 
          value={invitationsUsed.length} 
          icon={<Unlock className="h-4 w-4" />} 
          color="text-emerald-500"
        />
        <KPICard 
          label={copy.admin.metrics.firstLoginsCompleted} 
          value={firstLoginsCompleted.length} 
          icon={<LogIn className="h-4 w-4" />} 
          color="text-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* FILA 2 - Salud de la Beta */}
        <Card className="shadow-none border-muted/60">
          <CardHeader className="py-3 px-4 border-b bg-muted/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">{locale === "es" ? "Salud de la Beta" : "Beta Health"}</CardTitle>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground/50" />
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <HealthMetric label={locale === "es" ? "Usuarios totales" : "Total users"} value={analytics.overview.totalAccounts} />
            <HealthMetric label={locale === "es" ? "Usuarios activos" : "Active users"} value={analytics.overview.activeAccounts} />
            <HealthMetric label={copy.admin.metrics.pendingRequests} value={analytics.overview.pendingRequests} />
            <HealthMetric label={copy.admin.sections.activeSessions.title} value={analytics.overview.activeSessions} />
          </CardContent>
        </Card>

        {/* FILA 2 - Embudo de Adopción Unificado */}
        <Card className="shadow-none border-muted/60">
          <CardHeader className="py-3 px-4 border-b bg-muted/5 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">{locale === "es" ? "Embudo de Adopción" : "Adoption Funnel"}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-9 py-0 pl-4">{locale === "es" ? "Etapa" : "Stage"}</TableHead>
                  <TableHead className="h-9 py-0 text-right">{locale === "es" ? "Total" : "Total"}</TableHead>
                  <TableHead className="h-9 py-0 text-right pr-4">% Conv.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <FunnelRow label={locale === "es" ? "Solicitudes" : "Requests"} value={snapshot.counts.total} />
                <FunnelRow label={locale === "es" ? "Aprobaciones" : "Approvals"} value={analytics.overview.approvedRequests} />
                <FunnelRow label={copy.admin.metrics.invitationsSent} value={analytics.overview.invitationsSent} rate={analytics.adoption.invitationOpenRate} />
                <FunnelRow label={locale === "es" ? "Invitaciones abiertas" : "Opened"} value={analytics.overview.invitationsOpened} rate={analytics.adoption.invitationUseRate} />
                <FunnelRow label={copy.admin.metrics.firstLoginsCompleted} value={analytics.overview.firstLogins} rate={analytics.adoption.activationRate} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.6fr_0.4fr] gap-4">
        {/* FILA 3 - Solicitudes Pendientes */}
        <Card className="shadow-none border-muted/60 flex flex-col min-h-[400px]">
          <CardHeader className="py-3 px-4 border-b bg-muted/5 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">{copy.admin.sections.pendingRequests.title}</CardTitle>
            <Badge tone="info" className="font-bold">{pendingRequests.length}</Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="overflow-y-auto max-h-[500px]">
              <Table>
                <TableHeader className="bg-muted/10 sticky top-0 z-10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-9 py-0 pl-4">{copy.admin.table.email}</TableHead>
                    <TableHead className="h-9 py-0">{copy.admin.table.requestedAt}</TableHead>
                    <TableHead className="h-9 py-0 text-right pr-4">{copy.admin.table.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                        {copy.admin.sections.pendingRequests.empty}
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingRequests.map((request) => (
                      <TableRow key={request.id} className="group py-0">
                        <TableCell className="py-2 pl-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{request.email}</span>
                            <span className="text-[10px] text-muted-foreground">{request.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-xs">{formatDate(request.createdAt, locale)}</TableCell>
                        <TableCell className="py-2 text-right pr-4">
                          <PrivateBetaRequestActions locale={locale} requestId={request.id} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* FILA 3 - Tabs de Detalles */}
        <Card className="shadow-none border-muted/60 flex flex-col min-h-[400px]">
          <CardHeader className="p-0 border-b">
            <div className="flex bg-muted/5">
              <TabButton active={activeTab === "activity"} onClick={() => setActiveTab("activity")} icon={<Activity className="h-3.5 w-3.5" />}>
                {locale === "es" ? "Actividad" : "Activity"}
              </TabButton>
              <TabButton active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} icon={<BarChart3 className="h-3.5 w-3.5" />}>
                {locale === "es" ? "Analítica" : "Analytics"}
              </TabButton>
              <TabButton active={activeTab === "perception"} onClick={() => setActiveTab("perception")} icon={<Heart className="h-3.5 w-3.5" />}>
                {locale === "es" ? "Percepción" : "Perception"}
              </TabButton>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden bg-card">
            <div className="p-4 overflow-y-auto max-h-[500px]">
              {activeTab === "activity" && (
                <div className="space-y-4">
                  {analytics.activity.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground italic text-sm">{copy.admin.sections.auditEvents.empty}</div>
                  ) : (
                    <div className="space-y-2">
                      {analytics.activity.slice(0, 10).map((event, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-2 rounded-lg border bg-muted/5 text-xs">
                          <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                            <Clock className="h-3 w-3 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground capitalize">{formatAuditEventType(event.eventType)}</p>
                            <p className="text-muted-foreground truncate">{event.actorEmail || "-"}</p>
                            <p className="mt-1 text-[10px] opacity-60 font-mono">{event.timestamp ? formatDate(event.timestamp, locale) : "-"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-4">
                  {productAnalytics ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <SmallMetric label="DAU" value={productAnalytics.dau} />
                        <SmallMetric label="WAU" value={productAnalytics.wau} />
                        <SmallMetric label="MAU" value={productAnalytics.mau} />
                        <SmallMetric label={locale === "es" ? "Ses./User" : "Ses./User"} value={formatMetric(productAnalytics.sessionsPerUser)} />
                      </div>
                      <div className="rounded-xl border bg-muted/5 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{locale === "es" ? "Módulos más usados" : "Top Modules"}</p>
                        <div className="space-y-2">
                          {productAnalytics.topModules.slice(0, 5).map((m) => (
                            <div key={m.module} className="flex items-center justify-between text-xs">
                              <span className="font-medium">{m.module}</span>
                              <Badge tone="neutral" className="h-4 text-[9px]">{m.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground text-xs">{locale === "es" ? "Sin datos de analítica" : "No analytics data"}</div>
                  )}
                </div>
              )}

              {activeTab === "perception" && (
                <div className="space-y-4">
                  {feedbackAnalytics ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <SmallMetric label={locale === "es" ? "Respuestas" : "Responses"} value={feedbackAnalytics.totalResponses} />
                        <SmallMetric label={locale === "es" ? "Utilidad" : "Utility"} value={formatFeedbackPercentage(feedbackAnalytics.moduleUsefulness, "yes")} />
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{locale === "es" ? "Retención Semanal" : "Weekly Retention"}</p>
                         {feedbackAnalytics.weeklyRetention.map(row => (
                           <div key={row.value} className="flex items-center justify-between text-xs p-2 rounded-lg border bg-muted/5">
                             <span className="capitalize">{formatFeedbackValue(row.value)}</span>
                             <span className="font-bold">{formatRate(row.percentage)}</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground text-xs">{locale === "es" ? "Sin datos de feedback" : "No feedback data"}</div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* SECCIÓN OCULTA O COMPACTA: Usuarios Aprobados y Sesiones (Solo si es necesario para mantener funcionalidad) */}
      <details className="text-xs text-muted-foreground group">
        <summary className="cursor-pointer hover:text-foreground p-2 border rounded-md transition-colors inline-flex items-center gap-2">
          <Layout className="h-3 w-3" />
          {locale === "es" ? "Ver tablas de gestión avanzadas (Cuentas y Sesiones)" : "View advanced management tables (Accounts & Sessions)"}
        </summary>
        <div className="mt-4 space-y-6">
          <Card>
            <CardHeader><CardTitle>{copy.admin.sections.approvedAccounts.title}</CardTitle></CardHeader>
            <CardContent><PrivateBetaAccountTable locale={locale} accounts={snapshot.accounts} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{copy.admin.sections.activeSessions.title}</CardTitle></CardHeader>
            <CardContent><PrivateBetaSessionTable locale={locale} sessions={snapshot.sessions.filter(s => !s.revokedAt)} /></CardContent>
          </Card>
        </div>
      </details>
    </main>
  );
}

function KPICard({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <Card className="shadow-none border-muted/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground leading-none">{label}</p>
          <p className="text-xl font-bold tracking-tighter leading-none mt-1">{value}</p>
        </div>
        <div className={cn("p-1.5 rounded-full bg-muted/50", color)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function HealthMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col border-l-2 border-primary/20 pl-3 py-1">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function FunnelRow({ label, value, rate }: { label: string; value: number; rate?: number }) {
  return (
    <TableRow className="hover:bg-muted/5 group h-8">
      <TableCell className="py-1.5 pl-4 text-xs font-medium text-foreground/80">{label}</TableCell>
      <TableCell className="py-1.5 text-right font-mono text-xs">{value}</TableCell>
      <TableCell className="py-1.5 text-right pr-4">
        {rate !== undefined ? (
          <Badge tone="neutral" className="h-4 text-[9px] font-bold px-1.5">{Math.round(rate * 100)}%</Badge>
        ) : (
          <span className="text-muted-foreground/30">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2",
        active 
          ? "border-primary bg-card text-primary shadow-sm" 
          : "border-transparent text-muted-foreground hover:bg-muted/10 hover:text-foreground"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function SmallMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-muted/5 p-2 flex flex-col items-center justify-center">
      <span className="text-[9px] font-black uppercase text-muted-foreground/60">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function formatRate(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatMetric(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "-";
}

function formatFeedbackPercentage(rows: Array<{ value: string; percentage: number }>, value: string) {
  const row = rows.find((item) => item.value === value);
  return row ? formatRate(row.percentage) : "0%";
}

function formatFeedbackValue(value: string) {
  return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatAuditEventType(value: string) {
  return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
