import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { tv } from "@/lib";

const badge = tv({
  base: "inline-flex items-center font-medium whitespace-nowrap",
  variants: {
    variant: {
      pill: "rounded-full",
      dot: "gap-1",
    },
    size: {
      sm: "text-xs px-2 py-0.5 gap-1",
      md: "text-sm px-2.5 py-0.5 gap-1.5",
      lg: "text-sm px-3 py-1 gap-2",
    },
    color: {
      primary: "bg-[color:var(--ui-primary)] text-[color:var(--ui-primary-fg)]",
      success: "bg-[color:var(--ui-success,#22c55e)] text-white",
      warning: "bg-[color:var(--ui-warning,#f59e0b)] text-white",
      danger: "bg-[color:var(--ui-danger,#ef4444)] text-white",
      muted: "bg-[color:var(--ui-border)] text-[color:var(--ui-fg)]",
    },
  },
  compoundVariants: [
    {
      variant: "dot",
      class: "text-sm text-[color:var(--ui-fg)] px-0 py-0 font-normal",
    },
  ],
  defaultVariants: {
    variant: "pill",
    size: "md",
    color: "primary",
  },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
  variant?: "pill" | "dot";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "danger" | "muted";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ asChild, variant, size, color, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    if (variant === "dot") {
      return (
        <Comp ref={ref} className={badge({ variant, size, color, className })} {...props}>
          <span
            className={tv({
              base: "inline-block h-2.5 w-2.5 rounded-full",
              variants: {
                color: {
                  primary: "bg-[color:var(--ui-primary)]",
                  success: "bg-[color:var(--ui-success,#22c55e)]",
                  warning: "bg-[color:var(--ui-warning,#f59e0b)]",
                  danger: "bg-[color:var(--ui-danger,#ef4444)]",
                  muted: "bg-[color:var(--ui-border)]",
                },
              },
            })({ color })}
          />
          {children ? <span>{children}</span> : null}
        </Comp>
      );
    }

    return (
      <Comp ref={ref} className={badge({ variant, size, color, className })} {...props}>
        {children}
      </Comp>
    );
  }
);

Badge.displayName = "Badge";
