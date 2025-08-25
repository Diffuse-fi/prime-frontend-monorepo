import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-[95vw] max-w-lg rounded-2xl bg-background p-6 shadow-xl border border-border",
        className
      )}
      {...props}
    />
  </DialogPrimitive.Portal>
));

DialogContent.displayName = "DialogContent";
