import { tv } from "@/lib";

export const inputRoot = tv({
  base: "relative flex items-center rounded-xs border bg-fg transition-colors duration-200",
  variants: {
    size: {
      sm: "h-12 px-2",
      md: "h-13 px-3",
      lg: "h-14 px-4",
    },
    state: {
      default: "border-border focus-within:border-text-primary",
      error: "border-err focus-within:border-err",
    },
    disabled: {
      true: "opacity-50",
    },
  },
  defaultVariants: { size: "md", state: "default", disabled: false },
});

export const inputField = tv({
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
