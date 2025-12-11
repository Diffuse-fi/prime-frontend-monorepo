import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "lucide-react";
import { cn, tv } from "@/lib";

type CheckboxRootProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

export interface CheckboxProps extends Omit<CheckboxRootProps, "children" | "asChild"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean;
  className?: string;
  boxClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  size?: "sm" | "md" | "lg";
}

const checkboxBox = tv({
  base:
    "inline-flex shrink-0 items-center justify-center rounded-[6px] border border-border bg-fg " +
    "transition-colors duration-150 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-fg " +
    "data-[state=checked]:border-accent data-[state=checked]:bg-accent " +
    "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent " +
    "disabled:cursor-not-allowed disabled:opacity-40",
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
    error: {
      true: "border-error data-[state=checked]:bg-error data-[state=indeterminate]:bg-error",
    },
  },
  defaultVariants: {
    size: "md",
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
      label,
      description,
      error,
      disabled,
      className,
      boxClassName,
      labelClassName,
      descriptionClassName,
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
          ref={ref}
          disabled={disabled}
          className={cn(checkboxBox({ size, error: !!error }), boxClassName)}
          aria-invalid={error || undefined}
          {...rootProps}
        >
          <CheckboxPrimitive.Indicator className={indicatorBox()}>
            <Check className="h-3 w-3" aria-hidden />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || description) && (
          <span className="flex flex-col">
            {label && (
              <span className={cn("text-sm leading-relaxed", labelClassName)}>
                {label}
              </span>
            )}
            {description && (
              <span
                className={cn(
                  "text-border mt-1 text-xs leading-relaxed",
                  descriptionClassName
                )}
              >
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
