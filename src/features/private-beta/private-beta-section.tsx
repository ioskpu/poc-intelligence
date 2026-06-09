"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPrivateBetaCopy,
  getPrivateBetaExperienceOptions,
} from "@/lib/private-beta-content";
import { type Locale } from "@/lib/i18n";
import {
  submitPrivateBetaRequest,
  trackPrivateBetaLandingVisit,
} from "@/services/api/private-beta-client";

type PrivateBetaSectionProps = {
  locale: Locale;
};

type SubmissionState =
  | {
      status: "idle" | "submitting";
      error: string | null;
    }
  | {
      status: "submitted";
      error: string | null;
    };

const fieldClassName =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

export function PrivateBetaSection({ locale }: PrivateBetaSectionProps) {
  const copy = getPrivateBetaCopy(locale);
  const experienceOptions = getPrivateBetaExperienceOptions(locale);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: "idle",
    error: null,
  });
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    experienceLevel: experienceOptions[0]?.value ?? "Exploring",
    interest: "",
  });

  useEffect(() => {
    const storageKey = "poc-intelligence-private-beta-visit";

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    window.sessionStorage.setItem(storageKey, "1");
    void trackPrivateBetaLandingVisit({
      locale,
      pathname: window.location.pathname,
    });
  }, [locale]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSubmissionState({ status: "submitting", error: null });

    try {
      await submitPrivateBetaRequest({
        name: formValues.name,
        email: formValues.email,
        experienceLevel: formValues.experienceLevel,
        interest: formValues.interest,
      });

      setSubmissionState({ status: "submitted", error: null });
    } catch (error) {
      setSubmissionState({
        status: "idle",
        error:
          error instanceof Error
            ? error.message
            : locale === "es"
              ? "No pudimos enviar la solicitud."
              : "We could not submit the request.",
      });
    }
  }

  return (
    <section
      id="private-beta"
      className="mx-auto grid max-w-6xl gap-4 px-6 pb-20 lg:grid-cols-[1.05fr_0.95fr]"
    >
      <Card className="h-full">
        <CardHeader className="space-y-3">
          <Badge tone="info" className="w-fit">
            {copy.landing.badge}
          </Badge>
          <CardTitle>{copy.landing.title}</CardTitle>
          <CardDescription className="leading-6">
            {copy.landing.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>{copy.landing.intro}</p>
          <div className="space-y-3 rounded-md border bg-muted/25 p-4 text-foreground">
            <p className="text-sm font-semibold text-foreground">
              {copy.landing.processTitle}
            </p>
            <p className="text-sm text-muted-foreground">
              {copy.landing.processDescription}
            </p>
            <BetaBullet>{copy.landing.process.limited}</BetaBullet>
            <BetaBullet>{copy.landing.process.gradual}</BetaBullet>
            <BetaBullet>{copy.landing.process.reviewed}</BetaBullet>
            <BetaBullet>{copy.landing.process.next}</BetaBullet>
          </div>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="space-y-3">
          <CardTitle>{copy.landing.accessTitle}</CardTitle>
          <CardDescription className="leading-6">
            {copy.landing.accessDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissionState.status === "submitted" ? (
            <div className="space-y-4 rounded-md border bg-muted/20 p-4">
              <Badge tone="positive" className="w-fit">
                {copy.landing.pendingLabel}
              </Badge>
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">
                  {copy.landing.successTitle}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {copy.landing.successMessage}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setSubmissionState({ status: "idle", error: null })
                }
              >
                {copy.landing.form.reset}
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="beta-name">
                  {copy.landing.form.name}
                </label>
                <input
                  id="beta-name"
                  className={fieldClassName}
                  autoComplete="name"
                  required
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="beta-email">
                  {copy.landing.form.email}
                </label>
                <input
                  id="beta-email"
                  className={fieldClassName}
                  autoComplete="email"
                  inputMode="email"
                  type="email"
                  required
                  value={formValues.email}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="beta-experience">
                  {copy.landing.form.experience}
                </label>
                <select
                  id="beta-experience"
                  className={fieldClassName}
                  required
                  value={formValues.experienceLevel}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      experienceLevel: event.target.value as
                        | "Exploring"
                        | "Intermediate"
                        | "Advanced"
                        | "Professional",
                    }))
                  }
                >
                  {experienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {copy.landing.form.experienceHelp}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="beta-interest">
                  {copy.landing.form.interest}
                </label>
                <textarea
                  id="beta-interest"
                  className={`${fieldClassName} min-h-28 resize-none`}
                  placeholder={copy.landing.form.interestPlaceholder}
                  value={formValues.interest}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      interest: event.target.value,
                    }))
                  }
                />
              </div>

              {submissionState.error ? (
                <p className="text-sm text-rose-500">{submissionState.error}</p>
              ) : null}

              <Button type="submit" disabled={submissionState.status === "submitting"}>
                {submissionState.status === "submitting"
                  ? copy.landing.form.submitting
                  : copy.landing.form.submit}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function BetaBullet({ children }: { children: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
