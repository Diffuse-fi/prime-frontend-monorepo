import * as React from "react";
import { tv } from "@/lib";

const text = tv({
  base: "text-body text-text-primary",
  variants: {
    size: {
      body: "text-body",
      subtle: "text-subtle",
      small: "text-small",
      xs: "text-xs",
    },
    tone: { default: "text-text-primary", muted: "text-muted" },
    weight: { regular: "font-regular", medium: "font-medium", semibold: "font-semibold" },
  },
  defaultVariants: { size: "body", tone: "default", weight: "regular" },
});

export function Text({
  as = "p",
  className,
  size,
  tone,
  weight,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "div";
  size?: "body" | "subtle" | "small" | "xs";
  tone?: "default" | "muted";
  weight?: "regular" | "medium" | "semibold";
}) {
  const Tag = as;
  return <Tag className={text({ size, tone, weight, className })} {...rest} />;
}
