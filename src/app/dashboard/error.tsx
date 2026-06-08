"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardErrorProps = {
  error: Error;
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard market ranking load failed", error);
  }, [error]);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 items-center justify-center p-6">
        <Card className="max-w-lg">
          <CardHeader>
            <AlertTriangle className="h-5 w-5 text-accent" aria-hidden="true" />
            <CardTitle>Market rankings unavailable</CardTitle>
            <CardDescription>
              Market rankings are temporarily unavailable. Check that Futures
              Lab is running and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
              The dashboard could not load the latest market ranking snapshot.
            </p>
            <Button className="mt-4" onClick={reset}>
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
