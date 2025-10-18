import * as React from "react";
import * as SelectpPimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn, tv } from "@/lib";

export type SelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export interface SelectProps
  extends Omit<
    SelectpPimitive.SelectProps,
    "children" | "value" | "defaultValue" | "onValueChange"
  > {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  error?: boolean;
  success?: boolean;
  placeholder?: string;
  className?: string;
  valueClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  align?: "start" | "center" | "end";
  "aria-label"?: string;
}

const selectRoot = tv({
  base: "relative flex items-center justify-between rounded-xs border border-border bg-transparent standard-focus-ring h-13 px-3",
  variants: {
    state: {
      default: "",
      error: "",
      success: "",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
  },
  defaultVariants: { state: "default" },
});

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
      options,
      value,
      defaultValue,
      onValueChange,
      error,
      success,
      disabled,
      placeholder = "Select…",
      className,
      valueClassName,
      contentClassName,
      itemClassName,
      align = "start",
      ...rootProps
    },
    ref
  ) => {
    const state = error ? "error" : success ? "success" : "default";

    return (
      <SelectpPimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        {...rootProps}
      >
        <SelectpPimitive.Trigger
          ref={ref}
          className={cn(selectRoot({ state, disabled: !!disabled }), className)}
          aria-invalid={error || undefined}
        >
          <SelectpPimitive.Value
            placeholder={placeholder}
            className={cn(selectValue(), valueClassName)}
          />
          <span className={chevronWrap()}>
            <ChevronDown className="h-4 w-4" aria-hidden />
          </span>
        </SelectpPimitive.Trigger>
        <SelectpPimitive.Portal>
          <SelectpPimitive.Content
            align={align}
            position="popper"
            sideOffset={6}
            className={cn(contentBox(), contentClassName)}
          >
            <SelectpPimitive.Viewport className={viewportBox}>
              {options.map(opt => (
                <SelectpPimitive.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(itemRow({ disabled: !!opt.disabled }), itemClassName)}
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
