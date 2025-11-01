import * as React from "react";
import { cn } from "@/lib";
import { inputField, inputRoot } from "./inputStyles";

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
      disabled,
      type = "text",
      ...props
    },
    ref
  ) => {
    const state = error ? "error" : "default";

    return (
      <div
        className={cn(inputRoot({ size, state, disabled: !!disabled }), wrapperClassName)}
      >
        {left ? <span className="ml-2 inline-flex items-center">{left}</span> : null}

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
          aria-invalid={error ? "true" : undefined}
          disabled={disabled}
          {...props}
        />

        {right ? <span className="mr-2 inline-flex items-center">{right}</span> : null}
      </div>
    );
  }
);

Input.displayName = "Input";
