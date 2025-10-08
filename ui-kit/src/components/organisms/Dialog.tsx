import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import * as React from "react";
import { tv } from "@/lib";
import { Heading, IconButton } from "../atoms";

const content = tv({
  base: [
    "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    "w-[92vw] max-w-xl z-100",
    "bg-fg border border-border rounded-lg shadow-strong",
    "data-[state=open]:animate-modal-content-in",
    "focus:outline-none",
  ],
  variants: { size: { sm: "max-w-[360px]", md: "max-w-[728px]", lg: "max-w-[1024px]" } },
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
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in-fade data-[state=closed]:animate-out-fade fixed inset-0 z-60 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className={content({ size })}>
          <div className="border-border flex items-start gap-3 border-b p-4">
            <div className="text-text-dimmed min-w-0 flex-1">
              {title && (
                <DialogPrimitive.Title asChild>
                  <Heading level="3">{title}</Heading>
                </DialogPrimitive.Title>
              )}
              {description && (
                <DialogPrimitive.Description className="text-muted mt-1 text-sm">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close asChild>
              <IconButton
                icon={<X size={20} />}
                variant="ghost"
                size="sm"
                aria-label="Close"
                className="bg-muted/20 hover:bg-muted/20 transition-transform hover:scale-108"
              />
            </DialogPrimitive.Close>
          </div>
          {children && <div className="mt-2 p-4">{children}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
