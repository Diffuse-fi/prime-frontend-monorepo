import * as React from "react";
import { tv, VariantProps } from "@/lib";
import { cn } from "@/lib/cn";

const formField = tv({
  base: "group grid gap-1",
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    disabled: { true: "opacity-60 pointer-events-none" },
  },
  defaultVariants: { size: "md" },
});

const labelText = tv({
  base: "inline-flex items-baseline gap-1 text-text-primary font-mono",
  variants: {
    size: {
      sm: "text-xs",
      md: "text-xs",
      lg: "text-xs",
    },
  },
  defaultVariants: { size: "md" },
});

export interface FormFieldProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children">,
    VariantProps<typeof formField>,
    VariantProps<typeof labelText> {
  label: React.ReactNode;
  labelClassName?: string;
  children: React.ReactElement;

  hint?: React.ReactNode;
  aboveText?: React.ReactNode;
}

export const FormField = React.forwardRef<HTMLLabelElement, FormFieldProps>(
  (
    { label, size, disabled, className, labelClassName, children, hint, ...rest },
    ref
  ) => {
    return (
      <label
        ref={ref}
        className={cn(formField({ size, disabled }), className)}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        <span className={cn(labelText({ size }), labelClassName)}>
          <span>{label}</span>
        </span>

        {children}

        {hint ? <span className="text-border text-xs">{hint}</span> : null}
      </label>
    );
  }
);

FormField.displayName = "FormField";
