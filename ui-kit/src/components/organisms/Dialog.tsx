import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
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
  variants: {
    size: { sm: "sm:max-w-[360px]", md: "sm:max-w-[640px]", lg: "sm:max-w-[1024px]" },
  },
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
  contentClassName?: string;
  overlayClassName?: string;
};

export function Dialog({
  title,
  description,
  trigger,
  children,
  size,
  open,
  onOpenChange,
  contentClassName,
  overlayClassName,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
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
