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
    tone: {
      default: "",
      muted: "text-muted",
    },
  },
  defaultVariants: { size: "md", tone: "default" },
});

export interface FormFieldProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "children">,
    VariantProps<typeof formField>,
    VariantProps<typeof labelText> {
  label: React.ReactNode;
  labelClassName?: string;
  children: React.ReactElement;
}

export const FormField = React.forwardRef<HTMLLabelElement, FormFieldProps>(
  (
    { label, size, tone, disabled, className, labelClassName, children, ...rest },
    ref
  ) => {
    return (
      <label
        ref={ref}
        className={cn(formField({ size, disabled }), className)}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        <span className={cn(labelText({ size, tone }), labelClassName)}>
          <span>{label}</span>
        </span>

        {children}
      </label>
    );
  }
);

FormField.displayName = "FormField";
