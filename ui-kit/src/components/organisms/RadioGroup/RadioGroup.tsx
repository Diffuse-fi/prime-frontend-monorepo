import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/cn";

export interface RadioGroupItemProps
  extends Omit<RadioGroupPrimitive.RadioGroupItemProps, "asChild" | "children"> {
  children?: React.ReactNode;
  className?: string;
}

export interface RadioGroupProps
  extends Omit<RadioGroupPrimitive.RadioGroupProps, "asChild"> {
  children?: React.ReactNode;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ children, className, defaultValue, name, onValueChange, value, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Root
        className={cn("grid gap-6", className)}
        defaultValue={defaultValue}
        name={name}
        onValueChange={onValueChange}
        ref={ref}
        value={value}
        {...rest}
      >
        {children}
      </RadioGroupPrimitive.Root>
    );
  }
);
RadioGroup.displayName = "RadioCards";

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ children, className, disabled, value, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Item
        className={cn(
          "standard-focus-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        disabled={disabled}
        ref={ref}
        value={value!}
        {...rest}
      >
        {children}
      </RadioGroupPrimitive.Item>
    );
  }
);
RadioGroupItem.displayName = "RadioCards.Item";

const RadioGroupNamespace = Object.assign(RadioGroup, { Item: RadioGroupItem });
export { RadioGroupNamespace as RadioGroup };
