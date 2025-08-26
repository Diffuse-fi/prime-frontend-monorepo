import * as React from "react";
import { tv } from "@/lib";

const button = tv({
  base: [
    "inline-flex items-center justify-center",
    "px-4 py-2 rounded-md font-medium",
    "bg-primary text-primary-fg",
    "hover:opacity-95 focus:outline-none",
  ],
  variants: {
    variant: {
      outline: "bg-transparent border border-border text-fg",
      ghost: "bg-transparent text-fg hover:bg-muted/10",
    },
    size: { sm: "text-sm px-3 py-1.5", md: "", lg: "text-lg px-5 py-2.5" },
  },
  defaultVariants: { size: "md" },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant, size, ...rest }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...rest} />;
}
