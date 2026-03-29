import * as React from "react";

import { tv, VariantProps } from "@/lib";

const badge = tv({
  base: "inline-flex items-center font-medium whitespace-nowrap rounded-full",
  defaultVariants: {
    color: "success",
    size: "md",
  },
  variants: {
    color: {
      error: "text-error",
      muted: "text-muted",
      success: "text-success",
      warning: "text-warning",
    },
    size: {
      lg: "text-sm py-1 gap-2",
      md: "text-sm py-0.5 gap-1.5",
      sm: "text-xs py-0.5 gap-1",
    },
  },
});

const dot = tv({
  base: "inline-block h-6 w-6 rounded-full",
  defaultVariants: { color: "success" },
  variants: {
    color: {
      error: "bg-err",
      muted: "bg-muted",
      success: "bg-success",
      warning: "bg-warn",
    },
  },
});

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge>;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, color, size, ...props }, ref) => {
    return (
      <span className={badge({ className, color, size })} ref={ref} {...props}>
        <span
          aria-hidden="true"
          className={dot({
            color,
          })}
        />
        {children ? <span>{children}</span> : null}
      </span>
    );
  }
);

Badge.displayName = "Badge";
