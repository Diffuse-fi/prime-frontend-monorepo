import * as React from "react";

import { tv } from "@/lib";

const heading = tv({
  base: "font-semibold tracking-tight text-balance",
  defaultVariants: { align: "left", level: "2" },
  variants: {
    align: { center: "text-center", left: "text-left", right: "text-right" },
    level: {
      "1": "text-h1",
      "2": "text-h2",
      "3": "text-h3",
      "4": "text-h4",
      "5": "text-h5",
      "6": "text-h6",
    },
  },
});

type Level = "1" | "2" | "3" | "4" | "5" | "6";

export function Heading({
  align,
  children,
  className,
  level = "2",
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement> & {
  align?: "center" | "left" | "right";
  level?: Level;
  tone?: "default" | "muted";
}) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={heading({ align, className, level })} {...rest}>
      {children}
    </Tag>
  );
}
