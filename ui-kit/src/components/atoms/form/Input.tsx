import * as React from "react";

import { cn } from "@/lib";

import { inputField, inputRoot } from "./inputStyles";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  error?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  size?: "lg" | "md" | "sm";
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      disabled,
      error,
      left,
      right,
      size = "md",
      type = "text",
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const state = error ? "error" : "default";

    return (
      <div
        className={cn(inputRoot({ disabled: !!disabled, size, state }), wrapperClassName)}
      >
        {left ? <span className="ml-2 inline-flex items-center">{left}</span> : null}

        <input
          aria-invalid={error ? "true" : undefined}
          className={cn(
            inputField({
              size,
              withLeft: Boolean(left),
              withRight: Boolean(right),
            }),
            className
          )}
          disabled={disabled}
          ref={ref}
          type={type}
          {...props}
        />

        {right ? <span className="mr-2 inline-flex items-center">{right}</span> : null}
      </div>
    );
  }
);

Input.displayName = "Input";
