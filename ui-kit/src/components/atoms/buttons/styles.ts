import { tv } from "@/lib";

export const button = tv({
  base: [
    "inline-flex items-center justify-center",
    "cursor-pointer disabled:cursor-not-allowed",
    "transition-colors transition-duration-200",
    "standard-focus-ring whitespace-nowrap",
  ],
  variants: {
    variant: {
      solid:
        "border bg-primary/80 border-primary text-fg hover:bg-primary active:bg-secondary " +
        "disabled:bg-muted disabled:border-muted",
      ghost: "bg-transparent hover:bg-muted/10 text-primary",
    },
    size: {
      sm: "text-sm px-3 py-1.5 rounded-sm",
      md: "rounded-md text-body px-4 py-2",
      lg: "rounded-lg text-[18px] px-5 py-2.5 h-13",
    },
    icon: {
      true: "p-0! text-text-dimmed border-none",
      false: "",
    },
  },
  compoundVariants: [
    { icon: true, size: "sm", class: "h-8 w-8" },
    { icon: true, size: "md", class: "h-10 w-10" },
    { icon: true, size: "lg", class: "h-12 w-12" },
  ],
  defaultVariants: { size: "md", variant: "solid", icon: false },
});
