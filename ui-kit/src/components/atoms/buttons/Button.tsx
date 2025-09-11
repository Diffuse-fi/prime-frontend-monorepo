import * as React from "react";
import { tv, VariantProps } from "@/lib";

const button = tv({
  base: [
    "inline-flex items-center justify-center",
    "cursor-pointer disabled:cursor-not-allowed",
    "transition-colors transition-duration-200",
    "standard-focus-ring",
  ],
  variants: {
    variant: {
      solid:
        "border bg-fg border-border text-fg hover:bg-btn-hover hover:text-primary-fg",
      ghost: "bg-transparent hover:bg-muted/10 text-primary",
    },
    size: {
      sm: "text-sm px-3 py-1.5 rounded-sm",
      md: "rounded-md text-body px-4 py-2",
      lg: "rounded-lg text-lg px-5 py-2.5",
    },
  },
  defaultVariants: { size: "md" },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "solid", size, ...rest },
  ref
) {
  return <button ref={ref} className={button({ variant, size, className })} {...rest} />;
});

Button.displayName = "Button";
