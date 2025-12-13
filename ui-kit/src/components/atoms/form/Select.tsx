import { ChevronDown } from "lucide-react";
import { Select as SelectpPimitive } from "radix-ui";
import * as React from "react";

import { cn, tv } from "@/lib";

import { inputRoot } from "./inputStyles";

export type SelectOption = {
  disabled?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: string;
};

export interface SelectProps
  extends Omit<
    SelectpPimitive.SelectProps,
    "children" | "defaultValue" | "onValueChange" | "value"
  > {
  align?: "center" | "end" | "start";
  "aria-label"?: string;
  className?: string;
  contentClassName?: string;
  defaultValue?: string;
  error?: boolean;
  itemClassName?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: "lg" | "md" | "sm";
  value?: string;
  valueClassName?: string;
}

const selectValue = tv({
  base:
    "w-full flex-1 outline-none bg-transparent" +
    "placeholder:text-border " +
    "data-[placeholder]:text-border",
});

const chevronWrap = tv({
  base: "ml-2 inline-flex items-center text-border",
});

const contentBox = tv({
  base:
    "z-150 min-w-[var(--radix-select-trigger-width)] rounded-xs border border-border " +
    "bg-fg shadow-soft overflow-hidden",
});

const viewportBox = "p-1";

const itemRow = tv({
  base:
    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2.5 text-base " +
    "outline-none data-[highlighted]:bg-border/20 data-[state=checked]:bg-border/30",
  variants: {
    disabled: {
      true: "opacity-50 pointer-events-none",
    },
  },
});

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      align = "start",
      className,
      contentClassName,
      defaultValue,
      disabled,
      error,
      itemClassName,
      onValueChange,
      options,
      placeholder,
      size = "md",
      value,
      valueClassName,
      ...rootProps
    },
    ref
  ) => {
    const state = error ? "error" : "default";

    return (
      <SelectpPimitive.Root
        defaultValue={defaultValue}
        disabled={disabled}
        onValueChange={onValueChange}
        value={value}
        {...rootProps}
      >
        <SelectpPimitive.Trigger
          aria-invalid={error || undefined}
          className={cn(
            inputRoot({ disabled: !!disabled, size, state }),
            "focus:outline-none",
            className
          )}
          ref={ref}
        >
          <SelectpPimitive.Value
            className={cn(selectValue(), valueClassName)}
            placeholder={placeholder}
          />
          <span className={chevronWrap()}>
            <ChevronDown aria-hidden className="h-4 w-4" />
          </span>
        </SelectpPimitive.Trigger>
        <SelectpPimitive.Portal>
          <SelectpPimitive.Content
            align={align}
            className={cn(contentBox(), contentClassName)}
            position="popper"
            sideOffset={6}
          >
            <SelectpPimitive.Viewport className={viewportBox}>
              {options.map(opt => (
                <SelectpPimitive.Item
                  className={cn(itemRow({ disabled: !!opt.disabled }), itemClassName)}
                  disabled={opt.disabled}
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.icon ? (
                    <span className="mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center">
                      {opt.icon}
                    </span>
                  ) : null}
                  <SelectpPimitive.ItemText>{opt.label}</SelectpPimitive.ItemText>
                </SelectpPimitive.Item>
              ))}
            </SelectpPimitive.Viewport>
          </SelectpPimitive.Content>
        </SelectpPimitive.Portal>
      </SelectpPimitive.Root>
    );
  }
);

Select.displayName = "Select";
