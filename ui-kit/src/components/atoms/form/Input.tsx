import * as React from "react";
import { cn } from "@/lib";
import { tv } from "@/lib";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  error?: boolean;
  success?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}

const inputRoot = tv({
  base: "relative flex items-center rounded-xs border border-border bg-transparent standard-focus-ring",
  variants: {
    size: {
      sm: "h-12 px-2",
      md: "h-13 px-3",
      lg: "h-14 px-4",
    },
    state: {
      default: "",
      error: "",
      success: "",
    },
  },
  defaultVariants: { size: "md", state: "default" },
});

const inputField = tv({
  base:
    "w-full flex-1 outline-none bg-transparent " +
    "placeholder:text-border " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  variants: {
    size: {
      sm: "text-lg",
      md: "text-lg",
      lg: "text-lg",
    },
    withLeft: { true: "pl-1" },
    withRight: { true: "pr-1" },
  },
  defaultVariants: { size: "md" },
});

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      error,
      success,
      left,
      right,
      className,
      wrapperClassName,
      type = "text",
      ...props
    },
    ref
  ) => {
    const state = error ? "error" : success ? "success" : "default";

    return (
      <div className={cn(inputRoot({ size, state }), wrapperClassName)}>
        {left ? (
          <span className="ml-2 inline-flex items-center text-[color:var(--ui-muted)]">
            {left}
          </span>
        ) : null}

        <input
          ref={ref}
          type={type}
          className={cn(
            inputField({
              size,
              withLeft: Boolean(left),
              withRight: Boolean(right),
            }),
            className
          )}
          {...props}
        />

        {right ? (
          <span className="mr-2 inline-flex items-center text-[color:var(--ui-muted)]">
            {right}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
