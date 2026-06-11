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
      <ProductAnalyticsTracker
        enabled
        pageViewEvent="admin_dashboard_view"
        pageViewMetadata={{ module: "admin" }}
        events={[]}
      />
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
            <CardTitle>
              {locale === "es" ? "Analítica de producto" : "Product Analytics"}
            </CardTitle>
            <CardDescription>
              {locale === "es"
                ? "Uso real de modulos por cuentas autenticadas de la beta privada."
                : "Real module usage from authenticated private beta accounts."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productAnalytics ? (
              <section className="space-y-4">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InlineMetric
                    label="DAU"
                    value={productAnalytics.dau}
                  />
                  <InlineMetric
                    label="WAU"
                    value={productAnalytics.wau}
                  />
                  <InlineMetric
                    label="MAU"
                    value={productAnalytics.mau}
                  />
                  <InlineMetric
                    label={locale === "es" ? "Activos 7 dias" : "Active 7 days"}
                    value={productAnalytics.activeUsers7d}
                  />
                  <InlineMetric
                    label={locale === "es" ? "Sesiones / usuario" : "Sessions / user"}
                    value={formatMetric(productAnalytics.sessionsPerUser)}
                  />
                  <InlineMetric
                    label={locale === "es" ? "Dias entre visitas" : "Days between visits"}
                    value={formatMetric(productAnalytics.avgDaysBetweenVisits)}
                  />
                  <InlineMetric
                    label={locale === "es" ? "Primer login" : "First login"}
                    value={productAnalytics.funnel.firstLogin}
                  />
                  <InlineMetric
                    label={locale === "es" ? "Recurrentes" : "Recurrent"}
                    value={productAnalytics.funnel.recurrent}
                  />
                </section>
                <section className="grid gap-4 xl:grid-cols-3">
                  <ProductFunnelTable
                    title={locale === "es" ? "Embudo real" : "Real funnel"}
                    label={locale === "es" ? "Etapa" : "Stage"}
                    rows={[
                      {
                        name: locale === "es" ? "Invitados" : "Invited",
                        count: productAnalytics.funnel.invited,
                      },
                      {
                        name: locale === "es" ? "Aprobados" : "Approved",
                        count: productAnalytics.funnel.approved,
                      },
                      {
                        name: locale === "es" ? "Primer login" : "First login",
                        count: productAnalytics.funnel.firstLogin,
                      },
                      {
                        name: locale === "es" ? "Segundo login" : "Second login",
                        count: productAnalytics.funnel.secondLogin,
                      },
                      {
                        name: locale === "es" ? "Recurrentes" : "Recurrent",
                        count: productAnalytics.funnel.recurrent,
                      },
                    ]}
                  />
                  <ProductUsageTable
                    title={locale === "es" ? "Modulos mas usados" : "Top modules used"}
                    label={locale === "es" ? "Modulo" : "Module"}
                    rows={productAnalytics.topModules.map((row) => ({
                      name: row.module,
                      count: row.count,
                    }))}
                  />
                  <ProductUsageTable
                    title={locale === "es" ? "Simbolos mas vistos" : "Top symbols viewed"}
                    label={locale === "es" ? "Simbolo" : "Symbol"}
                    rows={productAnalytics.topSymbols.map((row) => ({
                      name: row.symbol,
                      count: row.count,
                    }))}
                  />
                </section>
              </section>
            ) : (
              <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                {locale === "es"
                  ? "El backend de analitica de producto aun no esta disponible. No se crearon tablas nuevas en el frontend."
                  : "The product analytics backend is not available yet. No new frontend-owned tables were created."}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "es" ? "Feedback Intelligence" : "Feedback Intelligence"}
            </CardTitle>
            <CardDescription>
              {locale === "es"
                ? "Valor percibido por usuarios autenticados de la beta privada."
                : "Perceived value from authenticated private beta users."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackAnalytics ? (
              <section className="space-y-4">
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InlineMetric
                    label={locale === "es" ? "Respuestas totales" : "Total responses"}
                    value={feedbackAnalytics.totalResponses}
                  />
                  <InlineMetric
                    label={locale === "es" ? "Utilidad: si" : "Usefulness: yes"}
                    value={formatFeedbackPercentage(feedbackAnalytics.moduleUsefulness, "yes")}
                  />
                  <InlineMetric
                    label={locale === "es" ? "Retencion semanal: si" : "Weekly retention: yes"}
                    value={formatFeedbackPercentage(feedbackAnalytics.weeklyRetention, "yes")}
                  />
                  <InlineMetric
                    label={locale === "es" ? "Retencion: inseguro" : "Retention: unsure"}
                    value={formatFeedbackPercentage(feedbackAnalytics.weeklyRetention, "unsure")}
                  />
                </section>
                <section className="grid gap-4 xl:grid-cols-4">
                  <FeedbackBreakdownTable
                    title={locale === "es" ? "Utilidad por modulo" : "Module usefulness"}
                    rows={feedbackAnalytics.moduleUsefulness}
                  />
                  <FeedbackBreakdownTable
                    title={locale === "es" ? "Valor de sesion" : "Session value"}
                    rows={feedbackAnalytics.sessionValue}
                  />
                  <FeedbackBreakdownTable
                    title={locale === "es" ? "Retencion semanal" : "Weekly retention"}
                    rows={feedbackAnalytics.weeklyRetention}
                  />
                  <TopUsefulModulesTable
                    title={locale === "es" ? "Top modulos utiles" : "Top useful modules"}
                    rows={feedbackAnalytics.topUsefulModules}
                  />
                </section>
              </section>
            ) : (
              <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                {locale === "es"
                  ? "El backend de feedback aun no esta disponible."
                  : "The feedback backend is not available yet."}
              </div>
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

function ProductUsageTable({
  title,
  label,
  rows,
}: {
  title: string;
  label: string;
  rows: Array<{ name: string; count: number }>;
}) {
  return (
    <div className="rounded-md border bg-muted/20 p-4">
      <p className="text-sm font-semibold">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">-</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{label}</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-right">{row.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function ProductFunnelTable({
  title,
  label,
  rows,
}: {
  title: string;
  label: string;
  rows: Array<{ name: string; count: number }>;
}) {
  return <ProductUsageTable title={title} label={label} rows={rows} />;
}

function FeedbackBreakdownTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ value: string; count: number; percentage: number }>;
}) {
  return (
    <div className="rounded-md border bg-muted/20 p-4">
      <p className="text-sm font-semibold">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">-</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Count</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.value}>
                <TableCell className="font-medium">{formatFeedbackValue(row.value)}</TableCell>
                <TableCell className="text-right">{row.count}</TableCell>
                <TableCell className="text-right">{formatRate(row.percentage)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function TopUsefulModulesTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ module: string; yes: number; no: number; yesRate: number; total: number }>;
}) {
  return (
    <div className="rounded-md border bg-muted/20 p-4">
      <p className="text-sm font-semibold">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">-</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead className="text-right">Yes</TableHead>
              <TableHead className="text-right">No</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.module}>
                <TableCell className="font-medium">{formatFeedbackValue(row.module)}</TableCell>
                <TableCell className="text-right">{row.yes}</TableCell>
                <TableCell className="text-right">{row.no}</TableCell>
                <TableCell className="text-right">{formatRate(row.yesRate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
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

function formatMetric(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "-";
}

function formatFeedbackPercentage(
  rows: Array<{ value: string; percentage: number }>,
  value: string,
) {
  const row = rows.find((item) => item.value === value);
  return row ? formatRate(row.percentage) : "0%";
}

function formatFeedbackValue(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAuditEventType(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
