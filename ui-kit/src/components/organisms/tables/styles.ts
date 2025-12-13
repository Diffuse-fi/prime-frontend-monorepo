import { tv } from "@/lib";

export const table = tv({
  base: "w-full border-separate border-spacing-0 text-sm",
  defaultVariants: { density: "comfy" },
  variants: {
    density: {
      comfy: "leading-6",
      compact: "leading-4",
    },
  },
});

export const td = tv({
  base: "px-3 py-2 border-b border-dashed border-border text-text-dimmed align-top",
});

export const th = tv({
  base: "px-3 py-2 text-left font-medium border-b border-border text-preset-gray-200",
});

export const tr = tv({ base: "hover:bg-muted/10" });
