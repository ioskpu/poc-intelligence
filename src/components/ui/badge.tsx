import { cn } from "@/lib/utils";

const toneClasses = {
  neutral: "border-border bg-muted text-muted-foreground",
  positive: "border-primary/30 bg-primary/10 text-primary",
  info: "border-secondary/30 bg-secondary/10 text-secondary",
  warning: "border-accent/30 bg-accent/10 text-accent",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof toneClasses;
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
