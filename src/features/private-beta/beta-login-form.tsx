"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

type BetaLoginFormProps = {
  locale: Locale;
  nextPath: string;
};

export function BetaLoginForm({ locale, nextPath }: BetaLoginFormProps) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/beta-auth/request-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            redirectPath: nextPath,
          }),
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(readError(payload, locale));
        }

        setStatus("sent");
        setMessage(
          locale === "es"
            ? "Si el email esta aprobado, recibiras un enlace de acceso."
            : "If the email is approved, you will receive an access link.",
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : locale === "es"
              ? "No se pudo solicitar el enlace."
              : "The access link could not be requested.",
        );
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">
          {locale === "es" ? "Email aprobado" : "Approved email"}
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-secondary"
        />
      </label>
      <Button type="submit" disabled={isPending}>
        {isPending
          ? locale === "es"
            ? "Enviando..."
            : "Sending..."
          : locale === "es"
            ? "Enviar magic link"
            : "Send magic link"}
      </Button>
      {message ? (
        <p
          className={
            status === "error"
              ? "text-sm text-rose-500"
              : "text-sm text-muted-foreground"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function readError(payload: unknown, locale: Locale) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as Record<string, unknown>).error === "string"
  ) {
    return (payload as Record<string, string>).error;
  }

  return locale === "es"
    ? "No se pudo solicitar el enlace."
    : "The access link could not be requested.";
}
