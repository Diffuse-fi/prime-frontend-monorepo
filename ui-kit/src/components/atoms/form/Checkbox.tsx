import { Check } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";

import { cn, tv } from "@/lib";

export interface CheckboxProps extends Omit<CheckboxRootProps, "asChild" | "children"> {
  boxClassName?: string;
  className?: string;
  error?: boolean | string;
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
    "disabled:cursor-not-allowed disabled:opacity-40",
  defaultVariants: {
    size: "md",
  },
  variants: {
    error: {
      false:
        "data-[state=checked]:border-preset-gray-200 data-[state=checked]:bg-preset-gray-200 " +
        "data-[state=indeterminate]:border-preset-gray-200 data-[state=indeterminate]:bg-preset-gray-200 " +
        "dark:border-primary dark:data-[state=checked]:bg-primary dark:data-[state=indeterminate]:bg-primary",
      true: "border-err data-[state=checked]:border-err data-[state=indeterminate]:border-err",
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
      error: genericError,
      label,
      labelClassName,
      size = "md",
      ...rootProps
    },
    ref
  ) => {
    const error = !!genericError;
    const errorMsg = typeof genericError === "string" ? genericError : undefined;

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
          className={cn(
            checkboxBox({ error: !!error, size }),
            boxClassName,
            label && "mt-0.75"
          )}
          disabled={disabled}
          ref={ref}
          {...rootProps}
        >
          <CheckboxPrimitive.Indicator className={indicatorBox()}>
            <Check aria-hidden className="h-3 w-3" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {(label || errorMsg) && (
          <div className="flex flex-col text-left">
            {label && <span className={cn("text-sm", labelClassName)}>{label}</span>}
            {errorMsg && <span className="text-err mt-1 block text-xs">{errorMsg}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
