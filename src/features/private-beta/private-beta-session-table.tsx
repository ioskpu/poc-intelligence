"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, type Locale } from "@/lib/i18n";
import { getPrivateBetaCopy } from "@/lib/private-beta-content";
import { terminatePrivateBetaSession } from "@/services/api/private-beta-client";
import type { PrivateBetaAdminSnapshot } from "@/services/api/private-beta";

type PrivateBetaSession = PrivateBetaAdminSnapshot["sessions"][number];

type PrivateBetaSessionTableProps = {
  locale: Locale;
  sessions: PrivateBetaSession[];
};

export function PrivateBetaSessionTable({
  locale,
  sessions,
}: PrivateBetaSessionTableProps) {
  const copy = getPrivateBetaCopy(locale);

  if (sessions.length === 0) {
    return (
      <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
        {copy.admin.sections.activeSessions.empty}
      </div>
    );
  }

  return (
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
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell className="font-medium">{session.email}</TableCell>
            <TableCell>{formatOptionalDate(session.createdAt, locale)}</TableCell>
            <TableCell>{formatOptionalDate(session.lastSeenAt, locale)}</TableCell>
            <TableCell>{formatOptionalDate(session.expiresAt, locale)}</TableCell>
            <TableCell>
              <TerminateSessionAction locale={locale} sessionId={session.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TerminateSessionAction({
  locale,
  sessionId,
}: {
  locale: Locale;
  sessionId: string;
}) {
  const router = useRouter();
  const copy = getPrivateBetaCopy(locale);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runAction() {
    setError(null);
    startTransition(async () => {
      try {
        await terminatePrivateBetaSession(sessionId);
        router.refresh();
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : locale === "es"
              ? "No se pudo terminar la sesion."
              : "The session could not be terminated.",
        );
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={runAction}
      >
        {isPending ? copy.admin.actions.running : copy.admin.actions.terminateSession}
      </Button>
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}

function formatOptionalDate(value: string | null, locale: Locale) {
  return value ? formatDate(value, locale) : "-";
}
