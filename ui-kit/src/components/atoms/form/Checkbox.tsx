import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";

import { cn, tv } from "@/lib";

export interface CheckboxProps extends Omit<CheckboxRootProps, "asChild" | "children"> {
  boxClassName?: string;
  className?: string;
  error?: boolean;
  label?: React.ReactNode;
  labelClassName?: string;
  size?: "lg" | "md" | "sm";
}

type CheckboxRootProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

const checkboxBox = tv({
  base:
    "inline-flex shrink-0 items-center justify-center rounded-[6px] border border-border bg-fg cursor-pointer " +
    "transition-colors duration-150 " +
    "standard-focus-ring " +
    "data-[state=checked]:border-accent data-[state=checked]:bg-accent " +
    "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent " +
    "disabled:cursor-not-allowed disabled:opacity-40 " +
    "dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=indeterminate]:bg-primary",
  defaultVariants: {
    size: "md",
  },
  variants: {
    error: {
      true: "border-error data-[state=checked]:bg-error data-[state=indeterminate]:bg-error",
    },
    size: {
      lg: "h-6 w-6",
      md: "h-5 w-5",
      sm: "h-4 w-4",
    },
  },
});

const indicatorBox = tv({
  base: "flex items-center justify-center text-fg",
});

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      boxClassName,
      className,
      disabled,
      error,
      label,
      labelClassName,
      size = "md",
      ...rootProps
    },
    ref
  ) => {
    return (
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <CheckboxPrimitive.Root
          aria-invalid={error || undefined}
          className={cn(checkboxBox({ error: !!error, size }), boxClassName)}
          disabled={disabled}
          ref={ref}
          {...rootProps}
        >
          <CheckboxPrimitive.Indicator className={indicatorBox()}>
            <Check aria-hidden className="h-3 w-3" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {label && (
          <span className="flex flex-col">
            {label && (
              <span className={cn("text-sm leading-relaxed", labelClassName)}>
                {label}
              </span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
