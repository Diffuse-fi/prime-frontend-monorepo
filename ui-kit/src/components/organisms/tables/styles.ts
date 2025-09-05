import { tv } from "@/lib";

export const table = tv({
  base: "w-full border-separate border-spacing-0 text-sm",
  variants: {
    density: {
      comfy: "leading-6",
      compact: "leading-4",
    },
  },
  defaultVariants: { density: "comfy" },
});

export const td = tv({
  base: "px-3 py-2 border-b border-border text-foreground/90",
});

export const th = tv({
  base: "px-3 py-2 text-left font-medium text-muted border-b border-border bg-muted/10",
});

export const tr = tv({ base: "hover:bg-muted/10" });
