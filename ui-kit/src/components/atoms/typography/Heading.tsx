import * as React from "react";
import { tv } from "@/lib";

const heading = tv({
  base: "font-semibold tracking-tight text-balance",
  variants: {
    level: {
      1: "text-h1",
      2: "text-h2",
      3: "text-h3",
      4: "text-h4",
    },
    align: { left: "text-left", center: "text-center", right: "text-right" },
    tone: { default: "text-text-primary", muted: "text-muted" },
  },
  defaultVariants: { level: 2, align: "left", tone: "default" },
});

type Level = 1 | 2 | 3 | 4;

export function Heading({
  as,
  level = 2,
  align,
  tone,
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement> & {
  as?: keyof React.JSX.IntrinsicElements;
  level?: Level;
  align?: "left" | "center" | "right";
  tone?: "default" | "muted";
}) {
  const Tag = as ?? (`h${level}` as const);
  return (
    <Tag className={heading({ level, align, tone, className })} {...rest}>
      {children}
    </Tag>
  );
}
