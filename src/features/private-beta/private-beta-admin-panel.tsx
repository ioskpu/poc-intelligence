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
import { PrivateBetaRequestActions } from "@/features/private-beta/private-beta-request-actions";
import type { PrivateBetaAdminSnapshot } from "@/services/api/private-beta";

type PrivateBetaAdminPanelProps = {
  locale: Locale;
  snapshot: PrivateBetaAdminSnapshot;
};

export function PrivateBetaAdminPanel({
  locale,
  snapshot,
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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetric
            label={copy.admin.metrics.pendingRequests}
            value={pendingRequests.length}
          />
          <AdminMetric
            label={copy.admin.metrics.approvedAccounts}
            value={snapshot.counts.approved}
            note={copy.admin.gaps.approvedAccountsDerived}
          />
          <AdminMetric
            label={copy.admin.metrics.activeSessions}
            value="N/A"
            note={copy.admin.gaps.sessionsApiMissing}
          />
          <AdminMetric
            label={copy.admin.metrics.revokedAccounts}
            value="N/A"
            note={copy.admin.gaps.accountsApiMissing}
          />
        </section>

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
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{copy.admin.table.name}</TableHead>
                  <TableHead>{copy.admin.table.email}</TableHead>
                  <TableHead>{copy.admin.table.role}</TableHead>
                  <TableHead>{copy.admin.table.approvedAt}</TableHead>
                  <TableHead>{copy.admin.table.lastLogin}</TableHead>
                  <TableHead>{copy.admin.table.status}</TableHead>
                  <TableHead>{copy.admin.table.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7}>
                    <GapMessage
                      title={copy.admin.sections.approvedAccounts.empty}
                      description={copy.admin.gaps.accountsApiMissing}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <DisabledActionList
              actions={[
                copy.admin.actions.revokeAccess,
                copy.admin.actions.promoteToAdmin,
                copy.admin.actions.demoteAdmin,
              ]}
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
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{copy.admin.table.email}</TableHead>
                  <TableHead>{copy.admin.table.sessionCreated}</TableHead>
                  <TableHead>{copy.admin.table.lastSeen}</TableHead>
                  <TableHead>{copy.admin.table.expiresAt}</TableHead>
                  <TableHead>{copy.admin.table.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5}>
                    <GapMessage
                      title={copy.admin.sections.activeSessions.empty}
                      description={copy.admin.gaps.sessionsApiMissing}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <DisabledActionList actions={[copy.admin.actions.terminateSession]} />
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

function GapMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 leading-6">{description}</p>
    </div>
  );
}

function DisabledActionList({ actions }: { actions: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <span
          key={action}
          className="inline-flex h-9 items-center rounded-md border px-3 text-sm text-muted-foreground"
        >
          {action}
        </span>
      ))}
    </div>
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
