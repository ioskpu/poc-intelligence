"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { getPrivateBetaCopy } from "@/lib/private-beta-content";
import { type Locale } from "@/lib/i18n";
import { changePrivateBetaRequestStatus } from "@/services/api/private-beta-client";
import { Check, X } from "lucide-react";

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
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          size="xs"
          tone="info"
          variant="outline"
          className="font-bold h-7"
          onClick={() => runAction("Approved", "approve")}
          disabled={isPending || pendingAction !== null}
        >
          {pendingAction === "approve" ? (
             <span className="animate-pulse">{copy.admin.actions.approving}</span>
          ) : (
            <span className="flex items-center gap-1"><Check className="h-3 w-3" /> {copy.admin.actions.approve}</span>
          )}
        </Button>
        <Button
          type="button"
          size="xs"
          tone="warning"
          variant="outline"
          className="font-bold h-7"
          onClick={() => runAction("Rejected", "reject")}
          disabled={isPending || pendingAction !== null}
        >
          {pendingAction === "reject" ? (
            <span className="animate-pulse">{copy.admin.actions.rejecting}</span>
          ) : (
            <span className="flex items-center gap-1"><X className="h-3 w-3" /> {copy.admin.actions.reject}</span>
          )}
        </Button>
      </div>
      {error ? <p className="text-[10px] text-rose-500 text-right">{error}</p> : null}
    </div>
  );
}
