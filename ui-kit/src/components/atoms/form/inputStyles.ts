import { tv } from "@/lib";

export const inputRoot = tv({
  base: "relative flex items-center rounded-xs border bg-fg transition-colors duration-200",
  defaultVariants: { disabled: false, size: "md", state: "default" },
  variants: {
    disabled: {
      true: "opacity-50",
    },
    size: {
      lg: "h-14 px-4",
      md: "h-13 px-3",
      sm: "h-12 px-2",
    },
    state: {
      default: "border-border focus-within:border-text-primary",
      error: "border-err focus-within:border-err",
    },
  },
});

export const inputField = tv({
  base:
    "w-full flex-1 outline-none bg-transparent " +
    "placeholder:text-border " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  defaultVariants: { size: "md" },
  variants: {
    size: {
      lg: "text-lg",
      md: "text-lg",
      sm: "text-lg",
    },
    withLeft: { true: "pl-1" },
    withRight: { true: "pr-1" },
  },
});
