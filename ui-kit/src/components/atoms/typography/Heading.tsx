import * as React from "react";
import { tv } from "@/lib";

const heading = tv({
  base: "font-semibold tracking-tight text-balance",
  variants: {
    level: {
      "1": "text-h1",
      "2": "text-h2",
      "3": "text-h3",
      "4": "text-h4",
      "5": "text-h5",
      "6": "text-h6",
    },
    align: { left: "text-left", center: "text-center", right: "text-right" },
  },
  defaultVariants: { level: "2", align: "left" },
});

type Level = "1" | "2" | "3" | "4" | "5" | "6";

export function Heading({
  level = "2",
  align,
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement> & {
  level?: Level;
  align?: "left" | "center" | "right";
  tone?: "default" | "muted";
}) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={heading({ level, align, className })} {...rest}>
      {children}
    </Tag>
  );
}
