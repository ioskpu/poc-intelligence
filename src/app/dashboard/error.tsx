"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, RotateCw } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveLocale } from "@/lib/i18n";

type DashboardErrorProps = {
  error: Error;
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));

  useEffect(() => {
    console.error("Dashboard market ranking load failed", error);
  }, [error]);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar locale={locale} />
      <div className="flex min-w-0 flex-1 items-center justify-center p-6">
        <Card className="max-w-lg">
          <CardHeader>
            <AlertTriangle className="h-5 w-5 text-accent" aria-hidden="true" />
            <CardTitle>
              {locale === "es" ? "Ranking de mercados no disponible" : "Market rankings unavailable"}
            </CardTitle>
            <CardDescription>
              {locale === "es"
                ? "El ranking de mercados no está disponible temporalmente. Revisa la fuente de datos y vuelve a intentarlo."
                : "Market rankings are temporarily unavailable. Check the data source and try again."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
              {locale === "es"
                ? "El dashboard no pudo cargar la instantánea más reciente de mercados."
                : "The dashboard could not load the latest market ranking snapshot."}
            </p>
            <Button className="mt-4" onClick={reset}>
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              {locale === "es" ? "Reintentar" : "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
