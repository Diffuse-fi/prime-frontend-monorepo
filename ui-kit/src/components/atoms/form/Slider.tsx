import * as React from "react";
import { Slider as SlidierPrimitive } from "radix-ui";
import { cn } from "@/lib/cn";

export interface SliderProps extends SlidierPrimitive.SliderProps {
  className?: string;
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { className, trackClassName, rangeClassName, thumbClassName, ...props },
  ref
) {
  return (
    <SlidierPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SlidierPrimitive.Track
        className={cn(
          "relative h-2 w-full grow overflow-hidden rounded-full bg-muted",
          trackClassName
        )}
      >
        <SlidierPrimitive.Range
          className={cn("absolute h-full bg-primary", rangeClassName)}
        />
      </SlidierPrimitive.Track>
      <SlidierPrimitive.Thumb
        className={cn(
          "block h-5 w-5 rounded-[10px] border-2 border-primary bg-background shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:border-primary/80",
          thumbClassName
        )}
      />
    </SlidierPrimitive.Root>
  );
});

Slider.displayName = "Slider";
