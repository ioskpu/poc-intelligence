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
import type {
  PrivateBetaAdminSnapshot,
  PrivateBetaAnalytics,
} from "@/services/api/private-beta";

type PrivateBetaAdminPanelProps = {
  locale: Locale;
  snapshot: PrivateBetaAdminSnapshot;
  analytics: PrivateBetaAnalytics;
};

export function PrivateBetaAdminPanel({
  locale,
  snapshot,
  analytics,
}: PrivateBetaAdminPanelProps) {
  const copy = getPrivateBetaCopy(locale);
  const experienceLabels = new Map(
    getPrivateBetaExperienceOptions(locale).map((option) => [
      option.value,
      option.label,
    ]),
  );
  const pendingRequests = snapshot.requests.filter(
    (request) => request.status === "Pending",
  );
  const activeSessions = snapshot.sessions.filter((session) => !session.revokedAt);
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
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge tone="info" className="w-fit">
              {copy.admin.badge}
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {copy.admin.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {copy.admin.description}
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminMetric
            label={copy.admin.metrics.pendingRequests}
            value={pendingRequests.length}
          />
          <AdminMetric
            label={copy.admin.metrics.approvedAccounts}
            value={snapshot.accounts.length}
          />
          <AdminMetric
            label={copy.admin.metrics.invitationsSent}
            value={invitationsSent.length}
          />
          <AdminMetric
            label={copy.admin.metrics.invitationsUsed}
            value={invitationsUsed.length}
          />
          <AdminMetric
            label={copy.admin.metrics.firstLoginsCompleted}
            value={firstLoginsCompleted.length}
          />
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {locale === "es" ? "Salud de la beta" : "Beta Health"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {locale === "es"
                ? "Indicadores operativos actuales para cuentas, solicitudes y sesiones."
                : "Current operational indicators for accounts, requests, and sessions."}
            </p>
          </div>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminMetric
              label={locale === "es" ? "Usuarios totales" : "Total users"}
              value={analytics.overview.totalAccounts}
            />
            <AdminMetric
              label={locale === "es" ? "Usuarios activos" : "Active users"}
              value={analytics.overview.activeAccounts}
            />
            <AdminMetric
              label={copy.admin.metrics.pendingRequests}
              value={analytics.overview.pendingRequests}
            />
            <AdminMetric
              label={copy.admin.sections.activeSessions.title}
              value={analytics.overview.activeSessions}
            />
          </section>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "es" ? "Embudo de adopcion" : "Adoption Funnel"}
              </CardTitle>
              <CardDescription>
                {locale === "es"
                  ? "Progreso desde solicitud hasta primer login usando datos de operacion existentes."
                  : "Progress from request to first login using existing operations data."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {locale === "es" ? "Etapa" : "Stage"}
                    </TableHead>
                    <TableHead className="text-right">
                      {locale === "es" ? "Total" : "Total"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <FunnelRow
                    label={locale === "es" ? "Solicitudes" : "Requests"}
                    value={snapshot.counts.total}
                  />
                  <FunnelRow
                    label={locale === "es" ? "Aprobaciones" : "Approvals"}
                    value={analytics.overview.approvedRequests}
                  />
                  <FunnelRow
                    label={copy.admin.metrics.invitationsSent}
                    value={analytics.overview.invitationsSent}
                    note={formatRate(analytics.adoption.invitationOpenRate)}
                  />
                  <FunnelRow
                    label={locale === "es" ? "Invitaciones abiertas" : "Invitations opened"}
                    value={analytics.overview.invitationsOpened}
                    note={formatRate(analytics.adoption.invitationUseRate)}
                  />
                  <FunnelRow
                    label={copy.admin.metrics.firstLoginsCompleted}
                    value={analytics.overview.firstLogins}
                    note={formatRate(analytics.adoption.activationRate)}
                  />
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "es" ? "Crecimiento de cuentas" : "Account Growth"}
              </CardTitle>
              <CardDescription>
                {locale === "es"
                  ? "Altas recientes y actividad de login."
                  : "Recent account creation and login activity."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <InlineMetric
                  label={locale === "es" ? "Creadas en 7 dias" : "Created in 7 days"}
                  value={analytics.overview.accountsCreatedLast7Days}
                />
                <InlineMetric
                  label={locale === "es" ? "Creadas en 30 dias" : "Created in 30 days"}
                  value={analytics.overview.accountsCreatedLast30Days}
                />
                <InlineMetric
                  label={locale === "es" ? "Logins en 24h" : "Logins in 24h"}
                  value={analytics.overview.loginsLast24Hours}
                />
                <InlineMetric
                  label={locale === "es" ? "Logins en 30 dias" : "Logins in 30 days"}
                  value={analytics.overview.loginsLast30Days}
                  note={`${locale === "es" ? "Admin ratio" : "Admin ratio"} ${formatRate(analytics.adoption.adminRatio)}`}
                />
              </section>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "es" ? "Actividad reciente" : "Recent Activity"}
            </CardTitle>
            <CardDescription>
              {locale === "es"
                ? "Linea de tiempo derivada de eventos de auditoria."
                : "Timeline derived from audit events."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.activity.length === 0 ? (
              <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                {copy.admin.sections.auditEvents.empty}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.admin.table.event}</TableHead>
                    <TableHead>{copy.admin.table.actor}</TableHead>
                    <TableHead>{copy.admin.table.target}</TableHead>
                    <TableHead>{copy.admin.table.createdAt}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.activity.slice(0, 12).map((event, index) => (
                    <TableRow key={`${event.timestamp}-${event.eventType}-${index}`}>
                      <TableCell className="font-medium">
                        {formatAuditEventType(event.eventType)}
                      </TableCell>
                      <TableCell>{event.actorEmail ?? "-"}</TableCell>
                      <TableCell>{event.targetEmail ?? "-"}</TableCell>
                      <TableCell>
                        {event.timestamp ? formatDate(event.timestamp, locale) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.admin.sections.pendingRequests.title}</CardTitle>
            <CardDescription>
              {copy.admin.sections.pendingRequests.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                {copy.admin.sections.pendingRequests.empty}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.admin.table.name}</TableHead>
                    <TableHead>{copy.admin.table.email}</TableHead>
                    <TableHead>{copy.admin.table.requestedAt}</TableHead>
                    <TableHead>{copy.admin.table.status}</TableHead>
                    <TableHead>{copy.admin.table.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <p>{request.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{formatDate(request.createdAt, locale)}</TableCell>
                      <TableCell>
                        <Badge tone={toneForStatus(request.status)}>
                          {getPrivateBetaStatusLabel(request.status, locale)}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-64">
                        <div className="space-y-3">
                          <PrivateBetaRequestActions
                            locale={locale}
                            requestId={request.id}
                          />
                          <details className="group text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              {copy.admin.actions.viewDetails}
                            </summary>
                            <div className="mt-2 space-y-2 rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground">
                              <p>
                                <span className="font-medium text-foreground">
                                  {copy.admin.table.experience}:{" "}
                                </span>
                                {experienceLabels.get(request.experienceLevel) ??
                                  request.experienceLevel}
                              </p>
                              {request.interest ? (
                                <p className="leading-5">{request.interest}</p>
                              ) : null}
                            </div>
                          </details>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.admin.sections.approvedAccounts.title}</CardTitle>
            <CardDescription>
              {copy.admin.sections.approvedAccounts.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PrivateBetaAccountTable
              locale={locale}
              accounts={snapshot.accounts}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.admin.sections.activeSessions.title}</CardTitle>
            <CardDescription>
              {copy.admin.sections.activeSessions.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PrivateBetaSessionTable
              locale={locale}
              sessions={activeSessions}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.admin.sections.auditEvents.title}</CardTitle>
            <CardDescription>
              {copy.admin.sections.auditEvents.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {snapshot.auditEvents.length === 0 ? (
              <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                {copy.admin.sections.auditEvents.empty}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.admin.table.event}</TableHead>
                    <TableHead>{copy.admin.table.actor}</TableHead>
                    <TableHead>{copy.admin.table.target}</TableHead>
                    <TableHead>{copy.admin.table.createdAt}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshot.auditEvents.slice(0, 20).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {formatAuditEventType(event.eventType)}
                      </TableCell>
                      <TableCell>{event.actorEmail ?? "-"}</TableCell>
                      <TableCell>
                        {event.targetEmail ?? event.targetSessionId ?? "-"}
                      </TableCell>
                      <TableCell>
                        {event.createdAt ? formatDate(event.createdAt, locale) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function AdminMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note?: string;
}) {
  return (
    <Card>
      <CardHeader className="space-y-1 p-4">
        <CardDescription className="text-xs uppercase tracking-[0.16em]">
          {label}
        </CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
        {note ? (
          <p className="text-xs leading-5 text-muted-foreground">{note}</p>
        ) : null}
      </CardHeader>
    </Card>
  );
}

function InlineMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note?: string;
}) {
  return (
    <div className="rounded-md border bg-muted/20 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {note ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p>
      ) : null}
    </div>
  );
}

function FunnelRow({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note?: string;
}) {
  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell className="text-right">
        <span>{value}</span>
        {note ? (
          <span className="ml-2 text-xs text-muted-foreground">{note}</span>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

function toneForStatus(status: "Pending" | "Approved" | "Rejected") {
  if (status === "Approved") {
    return "positive";
  }

  if (status === "Rejected") {
    return "warning";
  }

  return "info";
}

function formatRate(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatAuditEventType(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
