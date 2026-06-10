"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import {
  changePrivateBetaAccount,
  resendPrivateBetaInvitation,
  terminatePrivateBetaAccountSessions,
} from "@/services/api/private-beta-client";
import type { PrivateBetaAdminSnapshot } from "@/services/api/private-beta";

type PrivateBetaAccount = PrivateBetaAdminSnapshot["accounts"][number];

type PrivateBetaAccountTableProps = {
  locale: Locale;
  accounts: PrivateBetaAccount[];
};

type AccountAction = "revoke" | "reactivate" | "promote" | "demote";

export function PrivateBetaAccountTable({
  locale,
  accounts,
}: PrivateBetaAccountTableProps) {
  const copy = getPrivateBetaCopy(locale);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const visibleAccounts = useMemo(() => {
    if (!normalizedQuery) {
      return accounts;
    }

    return accounts.filter((account) =>
      `${account.name} ${account.email}`.toLowerCase().includes(normalizedQuery),
    );
  }, [accounts, normalizedQuery]);

  return (
    <div className="space-y-4">
      <input
        className="h-10 w-full max-w-sm rounded-md border bg-background px-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        placeholder={copy.admin.search.accounts}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {visibleAccounts.length === 0 ? (
        <div className="rounded-md border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
          {copy.admin.sections.approvedAccounts.empty}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{copy.admin.table.name}</TableHead>
              <TableHead>{copy.admin.table.email}</TableHead>
              <TableHead>{copy.admin.table.role}</TableHead>
              <TableHead>{copy.admin.table.approvedAt}</TableHead>
              <TableHead>{copy.admin.table.lastLogin}</TableHead>
              <TableHead>{copy.admin.table.invitation}</TableHead>
              <TableHead>{copy.admin.table.status}</TableHead>
              <TableHead>{copy.admin.table.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>
                  <Badge tone={account.role === "admin" ? "warning" : "info"}>
                    {account.role}
                  </Badge>
                </TableCell>
                <TableCell>{formatOptionalDate(account.approvedAt, locale)}</TableCell>
                <TableCell>{formatOptionalDate(account.lastLoginAt, locale)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge tone={toneForInvitation(account.invitationStatus)}>
                      {account.invitationStatus}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatOptionalDate(account.invitationSentAt, locale)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge tone={account.status === "Active" ? "positive" : "warning"}>
                    {account.status}
                  </Badge>
                </TableCell>
                <TableCell className="min-w-56">
                  <AccountActions locale={locale} account={account} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function AccountActions({
  locale,
  account,
}: {
  locale: Locale;
  account: PrivateBetaAccount;
}) {
  const router = useRouter();
  const copy = getPrivateBetaCopy(locale);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runAccountAction(action: AccountAction) {
    setPendingAction(action);
    setError(null);
    startTransition(async () => {
      try {
        await changePrivateBetaAccount(account.id, { action });
        router.refresh();
      } catch (actionError) {
        setError(readActionError(actionError, locale));
      } finally {
        setPendingAction(null);
      }
    });
  }

  function runTerminateSessions() {
    setPendingAction("sessions");
    setError(null);
    startTransition(async () => {
      try {
        await terminatePrivateBetaAccountSessions(account.id);
        router.refresh();
      } catch (actionError) {
        setError(readActionError(actionError, locale));
      } finally {
        setPendingAction(null);
      }
    });
  }

  function runResendInvitation() {
    setPendingAction("invitation");
    setError(null);
    startTransition(async () => {
      try {
        await resendPrivateBetaInvitation(account.id);
        router.refresh();
      } catch (actionError) {
        setError(readActionError(actionError, locale));
      } finally {
        setPendingAction(null);
      }
    });
  }

  return (
    <div className="space-y-2">
      <details className="group">
        <summary className="inline-flex h-9 cursor-pointer items-center rounded-md border px-3 text-sm text-foreground hover:bg-muted">
          {pendingAction ? copy.admin.actions.running : copy.admin.actions.actionMenu}
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {account.status === "Active" ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => runAccountAction("revoke")}
            >
              {copy.admin.actions.revokeAccess}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() => runAccountAction("reactivate")}
            >
              {copy.admin.actions.reactivateAccount}
            </Button>
          )}
          {account.role === "admin" ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => runAccountAction("demote")}
            >
              {copy.admin.actions.demoteAdmin}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => runAccountAction("promote")}
            >
              {copy.admin.actions.promoteToAdmin}
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={runTerminateSessions}
          >
            {copy.admin.actions.terminateAllSessions}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending || account.status !== "Active"}
            onClick={runResendInvitation}
          >
            {copy.admin.actions.resendInvitation}
          </Button>
        </div>
      </details>
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}

function formatOptionalDate(value: string | null, locale: Locale) {
  return value ? formatDate(value, locale) : "-";
}

function toneForInvitation(status: PrivateBetaAccount["invitationStatus"]) {
  if (status === "Used") {
    return "positive";
  }

  if (status === "Opened" || status === "Sent") {
    return "info";
  }

  return "warning";
}

function readActionError(error: unknown, locale: Locale) {
  if (error instanceof Error) {
    return error.message;
  }

  return locale === "es"
    ? "No se pudo completar la accion."
    : "The action could not be completed.";
}
