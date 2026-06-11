"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type SignOutButtonProps = {
  label: string;
};

export function SignOutButton({ label }: SignOutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await fetch("/api/beta-auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } finally {
      window.location.assign("/dashboard");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {label}
    </Button>
  );
}
