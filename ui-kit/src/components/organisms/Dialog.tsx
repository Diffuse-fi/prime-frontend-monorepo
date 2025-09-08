import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import * as React from "react";
import { tv } from "@/lib";

const content = tv({
  base: [
    "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    "w-[92vw] max-w-xl p-5",
    "bg-bg text-fg border border-border rounded-lg shadow-soft",
    "data-[state=open]:animate-in-zoom data-[state=closed]:animate-out-zoom",
    "focus:outline-none",
  ],
  variants: { size: { sm: "max-w-md", md: "max-w-xl", lg: "max-w-2xl" } },
  defaultVariants: { size: "md" },
});

export type DialogProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
};

export function Dialog({
  title,
  description,
  trigger,
  children,
  size,
  open,
  onOpenChange,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      ) : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in-fade data-[state=closed]:animate-out-fade fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className={content({ size })}>
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              {title && (
                <DialogPrimitive.Title className="text-base font-semibold">
                  {title}
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-muted mt-1 text-sm">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              className="hover:bg-muted/10 rounded-md p-2 focus:outline-none"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>
          {children && <div className="mt-4">{children}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
