import * as React from "react";

import { tv, VariantProps } from "@/lib";
import { cn } from "@/lib/cn";

const formField = tv({
  base: "group grid gap-1",
  defaultVariants: { size: "md" },
  variants: {
    disabled: { true: "opacity-60 pointer-events-none" },
    size: {
      lg: "",
      md: "",
      sm: "",
    },
  },
});

const labelText = tv({
  base: "inline-flex items-baseline gap-1 text-text-primary font-mono",
  defaultVariants: { size: "md" },
  variants: {
    error: {
      false: "",
      true: "text-err",
    },
    size: {
      lg: "text-xs",
      md: "text-xs",
      sm: "text-xs",
    },
  },
});

const hintCn = tv({
  base: "text-xs",
  variants: {
    error: {
      false: "text-border",
      true: "text-err",
    },
  },
});

export interface FormFieldProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children">,
    VariantProps<typeof formField>,
    VariantProps<typeof labelText> {
  aboveText?: React.ReactNode;
  children: React.ReactElement;
  hint?: React.ReactNode;
  label: React.ReactNode;
  labelClassName?: string;
}

export const FormField = React.forwardRef<HTMLLabelElement, FormFieldProps>(
  (
    { children, className, disabled, error, hint, label, labelClassName, size, ...rest },
    ref
  ) => {
    return (
      <label
        aria-disabled={disabled || undefined}
        className={cn(formField({ disabled, size }), className)}
        ref={ref}
        {...rest}
      >
        <span className={cn(labelText({ error, size }), labelClassName)}>{label}</span>

        {children}

        {hint ? <span className={hintCn({ error })}>{hint}</span> : null}
      </label>
    );
  }
);

FormField.displayName = "FormField";
