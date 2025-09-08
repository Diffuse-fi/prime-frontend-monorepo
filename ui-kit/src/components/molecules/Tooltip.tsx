import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@/lib";

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      side = "top",
      open,
      defaultOpen,
      className,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    return (
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          ref={ref}
          side={side}
          align="center"
          className={cn(
            "rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white shadow-md",
            "data-[side=top]:animate-in-slide-down data-[side=bottom]:animate-in-slide-up",
            className
          )}
          {...props}
        >
          {content}
          <TooltipPrimitive.Arrow width={11} height={5} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    );
  }
);

export const TooltipProvider = TooltipPrimitive.Provider;

Tooltip.displayName = "Tooltip";
