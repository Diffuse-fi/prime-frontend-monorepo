import { Tooltip as TooltipPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib";

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  children: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  offset?: number;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  side?: "bottom" | "left" | "right" | "top";
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      className,
      content,
      defaultOpen,
      offset = 4,
      onOpenChange,
      open,
      side = "top",
      ...props
    },
    ref
  ) => {
    return (
      <TooltipPrimitive.Root
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        open={open}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            align="center"
            className={cn(
              "bg-fg text-text-primary shadow-soft relative z-110 rounded-md px-3 py-1.5 text-sm",
              "data-[side=top]:animate-in-slide-down data-[side=bottom]:animate-in-slide-up",
              "dark:bg-border",
              className
            )}
            hideWhenDetached
            ref={ref}
            side={side}
            sideOffset={offset}
            {...props}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-fg" height={5} width={11} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    );
  }
);

export const TooltipProvider = TooltipPrimitive.Provider;

Tooltip.displayName = "Tooltip";
