"use client";

import { CircleHelp } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TooltipLabelProps = {
  label: ReactNode;
  tooltip: string;
  className?: string;
  labelClassName?: string;
  tooltipClassName?: string;
};

export function TooltipLabel({
  label,
  tooltip,
  className,
  labelClassName,
  tooltipClassName,
}: TooltipLabelProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <span
      ref={rootRef}
      className={cn("relative inline-flex items-center gap-1", className)}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className={cn("inline-flex items-center gap-1", labelClassName)}>{label}</span>
      <button
        type="button"
        aria-describedby={open ? tooltipId : undefined}
        aria-label={tooltip}
        aria-expanded={open}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/30 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        onClick={() => setOpen((value) => !value)}
      >
        <CircleHelp className="h-3 w-3" aria-hidden="true" />
      </button>
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-xs leading-5 text-popover-foreground shadow-lg",
            tooltipClassName,
          )}
        >
          {tooltip}
        </span>
      ) : null}
    </span>
  );
}
