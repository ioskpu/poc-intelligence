"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { getPrivateBetaCopy } from "@/lib/private-beta-content";
import { type Locale } from "@/lib/i18n";
import { changePrivateBetaRequestStatus } from "@/services/api/private-beta-client";

type PrivateBetaRequestActionsProps = {
  locale: Locale;
  requestId: string;
};

export function PrivateBetaRequestActions({
  locale,
  requestId,
}: PrivateBetaRequestActionsProps) {
  const router = useRouter();
  const copy = getPrivateBetaCopy(locale);
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runAction(nextStatus: "Approved" | "Rejected", action: "approve" | "reject") {
    setPendingAction(action);
    setError(null);

    startTransition(async () => {
      try {
        await changePrivateBetaRequestStatus(requestId, {
          status: nextStatus,
        });
        router.refresh();
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : locale === "es"
              ? "No se pudo actualizar la solicitud."
              : "The request could not be updated.",
        );
      } finally {
        setPendingAction(null);
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => runAction("Approved", "approve")}
          disabled={isPending || pendingAction !== null}
        >
          {pendingAction === "approve"
            ? copy.admin.actions.approving
            : copy.admin.actions.approve}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => runAction("Rejected", "reject")}
          disabled={isPending || pendingAction !== null}
        >
          {pendingAction === "reject"
            ? copy.admin.actions.rejecting
            : copy.admin.actions.reject}
        </Button>
      </div>
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
