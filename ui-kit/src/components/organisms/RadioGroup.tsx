import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn";

export interface RadioGroupProps
  extends Omit<RadioGroupPrimitive.RadioGroupProps, "asChild"> {
  className?: string;
  children?: React.ReactNode;
}

export interface RadioGroupItemProps
  extends Omit<RadioGroupPrimitive.RadioGroupItemProps, "asChild" | "children"> {
  children?: React.ReactNode;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, className, value, defaultValue, onValueChange, children, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        className={cn("grid gap-6", className)}
        name={name}
        {...rest}
      >
        {children}
      </RadioGroupPrimitive.Root>
    );
  }
);
RadioGroup.displayName = "RadioCards";

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ value, children, disabled, className, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Item
        value={value!}
        disabled={disabled}
        ref={ref}
        className={cn(
          "standard-focus-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
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
