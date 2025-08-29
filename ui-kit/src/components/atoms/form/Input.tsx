import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  error?: boolean;
  success?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  asChild?: boolean;
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
      asChild,
      className,
      wrapperClassName,
      type = "text",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "input";
    const sizeCls =
      size === "sm"
        ? "h-8 px-2 text-sm"
        : size === "lg"
          ? "h-12 px-4 text-base"
          : "h-10 px-3 text-sm";
    const base =
      "w-full outline-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[color:var(--ui-muted)]";
    const stateCls = error
      ? "border-[color:var(--ui-danger)] focus-visible:ring-[color:var(--ui-danger)]"
      : success
        ? "border-[color:var(--ui-success)] focus-visible:ring-[color:var(--ui-success)]"
        : "";

    return (
      <div className={cn("relative flex items-center", stateCls, wrapperClassName)}>
        {left ? (
          <span className="ml-2 inline-flex items-center text-[color:var(--ui-muted)]">
            {left}
          </span>
        ) : null}

        <Comp
          ref={ref}
          type={type}
          className={cn(
            base,
            sizeCls,
            Boolean(left) && "pl-1",
            Boolean(right) && "pr-1",
            "flex-1",
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
