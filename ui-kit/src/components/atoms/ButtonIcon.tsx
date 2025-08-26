import * as React from "react";
import { tv } from "@/lib";

const iconButton = tv({
  base: "inline-flex items-center justify-center rounded-md focus:outline-none",
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    },
    variant: {
      solid: "bg-primary text-primary-fg hover:opacity-90",
      ghost: "bg-transparent hover:bg-muted/10 text-fg",
    },
  },
  defaultVariants: { size: "md", variant: "ghost" },
});

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "ghost";
};

export function IconButton({
  icon,
  size,
  variant,
  className,
  "aria-label": ariaLabel,
  ...rest
}: Props) {
  if (!ariaLabel) {
    console.warn("IconButton should have aria-label for accessibility");
  }
  return (
    <button
      className={iconButton({ size, variant, className })}
      aria-label={ariaLabel}
      {...rest}
    >
      {icon}
    </button>
  );
}
