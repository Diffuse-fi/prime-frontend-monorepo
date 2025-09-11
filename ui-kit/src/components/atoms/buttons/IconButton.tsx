import * as React from "react";
import { tv } from "@/lib";
import { Button } from "./Button";

const iconButton = tv({
  base: "p-0 text-text-dimmed border-none",
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    },
    variant: {
      solid: "",
      ghost: "",
    },
  },
  defaultVariants: { size: "md", variant: "ghost" },
});

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "ghost";
  "aria-label": string;
};

export function IconButton({
  icon,
  size,
  variant,
  className,
  "aria-label": ariaLabel,
  ...rest
}: Props) {
  return (
    <Button
      className={iconButton({ size, variant, className })}
      aria-label={ariaLabel}
      variant={variant}
      {...rest}
    >
      {icon}
    </Button>
  );
}
