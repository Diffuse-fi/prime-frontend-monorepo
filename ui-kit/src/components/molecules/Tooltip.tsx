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
  offset?: number;
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
      offset = 4,
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
          sideOffset={offset}
          ref={ref}
          hideWhenDetached
          side={side}
          align="center"
          className={cn(
            "bg-fg text-text-primary shadow-soft rounded-md px-3 py-1.5 text-sm",
            "data-[side=top]:animate-in-slide-down data-[side=bottom]:animate-in-slide-up",
            className
          )}
          {...props}
        >
          {content}
          <TooltipPrimitive.Arrow width={11} height={5} className="bg-fg" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    );
  }
);

export const TooltipProvider = TooltipPrimitive.Provider;

Tooltip.displayName = "Tooltip";
