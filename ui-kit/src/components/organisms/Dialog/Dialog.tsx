import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as React from "react";

import { cn, tv } from "@/lib";

import { Heading, IconButton } from "../atoms";

const content = tv({
  base: [
    "fixed z-100 max-h-[90dvh] overflow-y-auto",
    "max-sm:bottom-0 left-0 max-sm:right-0 sm:left-1/2 sm:top-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2",
    "rounded-t-lg sm:rounded-lg",
    "bg-fg border border-border shadow-strong",
    "data-[state=open]:animate-modal-content-in",
    "focus:outline-none w-full",
  ],
  defaultVariants: { size: "md" },
  variants: {
    size: { lg: "sm:max-w-[1024px]", md: "sm:max-w-[640px]", sm: "sm:max-w-[360px]" },
  },
});

export type DialogProps = {
  children?: React.ReactNode;
  contentClassName?: string;
  description?: React.ReactNode;
  onOpenChange?: (o: boolean) => void;
  open?: boolean;
  overlayClassName?: string;
  size?: "lg" | "md" | "sm";
  title?: React.ReactNode;
  trigger?: React.ReactNode;
};

export function Dialog({
  children,
  contentClassName,
  description,
  onOpenChange,
  open,
  overlayClassName,
  size,
  title,
  trigger,
}: DialogProps) {
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={open}>
      {trigger ? (
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      ) : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "data-[state=open]:animate-in-fade data-[state=closed]:animate-out-fade fixed inset-0 z-60 bg-black/40 backdrop-blur-sm",
            overlayClassName
          )}
        />
        <DialogPrimitive.Content
          className={cn(content({ size }), contentClassName)}
          {...(!description && { "aria-describedby": undefined })}
        >
          <div className="border-border bg-fg sticky top-0 z-10 flex items-start gap-3 border-b p-4">
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
                aria-label="Close"
                className="bg-muted/20 hover:bg-muted/20 transition-transform hover:scale-108"
                icon={<X size={20} />}
                size="sm"
                variant="ghost"
              />
            </DialogPrimitive.Close>
          </div>
          {children && <div className="mt-2 p-4">{children}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
