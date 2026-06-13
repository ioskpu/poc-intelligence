import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary",
        secondary:
          "bg-muted text-foreground hover:bg-muted/80 focus-visible:outline-secondary",
        outline:
          "border bg-transparent text-foreground hover:bg-muted focus-visible:outline-secondary",
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-secondary",
      },
      tone: {
        neutral: "border-border bg-muted text-muted-foreground hover:bg-muted/80",
        positive: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",
        info: "border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/20",
        warning: "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-5",
        xs: "h-7 px-2 text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, tone, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, tone, size }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  tone,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, tone, size }), className)} {...props} />
  );
}
