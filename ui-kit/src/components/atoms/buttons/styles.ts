import { tv } from "@/lib";

export const button = tv({
  base: [
    "inline-flex items-center justify-center",
    "cursor-pointer disabled:cursor-not-allowed",
    "transition-colors transition-duration-200",
    "standard-focus-ring whitespace-nowrap",
  ],
  compoundVariants: [
    { class: "h-6 w-6", icon: true, size: "xs" },
    { class: "h-8 w-8", icon: true, size: "sm" },
    { class: "h-10 w-10", icon: true, size: "md" },
    { class: "h-12 w-12", icon: true, size: "lg" },
    { class: "px-0 py-0", size: "xs", variant: "link" },
    { class: "px-0 py-0", size: "sm", variant: "link" },
    { class: "px-0 py-0", size: "md", variant: "link" },
    { class: "px-0 py-0", size: "lg", variant: "link" },
  ],
  defaultVariants: { icon: false, size: "md", variant: "solid" },
  variants: {
    icon: {
      false: "",
      true: "p-0! text-text-dimmed border-none",
    },
    size: {
      lg: "rounded-lg text-[18px] px-5 py-2.5 h-13",
      md: "rounded-md px-4 py-2",
      sm: "text-sm px-3 py-1.5 rounded-sm",
      xs: "text-xs px-2 py-1 rounded-xs",
    },
    variant: {
      ghost: "bg-transparent hover:bg-muted/10 text-primary",
      link: "bg-transparent underline decoration-dashed underline-offset-2 text-primary hover:text-primary/80 active:text-primary/60",
      solid:
        "border bg-primary/80 border-primary text-fg hover:bg-primary active:bg-secondary " +
        "disabled:bg-muted disabled:border-muted",
    },
  },
});
