import * as React from "react";
import { tv, VariantProps } from "@/lib";

const badge = tv({
  base: "inline-flex items-center font-medium whitespace-nowrap rounded-full",
  variants: {
    size: {
      sm: "text-xs py-0.5 gap-1",
      md: "text-sm py-0.5 gap-1.5",
      lg: "text-sm py-1 gap-2",
    },
    color: {
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
      muted: "text-muted",
    },
  },
  defaultVariants: {
    size: "md",
    color: "success",
  },
});

const dot = tv({
  base: "inline-block h-6 w-6 rounded-full",
  variants: {
    color: {
      success: "bg-success",
      warning: "bg-warn",
      error: "bg-err",
      muted: "bg-muted",
    },
  },
  defaultVariants: { color: "success" },
});

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badge>;

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ size, color, className, children, ...props }, ref) => {
    return (
      <span ref={ref} className={badge({ size, color, className })} {...props}>
        <span
          className={dot({
            color,
          })}
          aria-hidden="true"
        />
        {children ? <span>{children}</span> : null}
      </span>
    );
  }
);

Badge.displayName = "Badge";
