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
        "relative flex w-full touch-none items-center select-none",
        className
      )}
      {...props}
    >
      <SlidierPrimitive.Track
        className={cn(
          "bg-muted relative h-2 w-full grow overflow-hidden rounded-full",
          trackClassName
        )}
      >
        <SlidierPrimitive.Range
          className={cn("bg-primary absolute h-full", rangeClassName)}
        />
      </SlidierPrimitive.Track>
      <SlidierPrimitive.Thumb
        className={cn(
          "border-primary bg-primary block h-5 w-5 rounded-[10px] border-2 shadow-sm",
          "focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          "hover:border-primary/80",
          thumbClassName
        )}
      />
    </SlidierPrimitive.Root>
  );
});

Slider.displayName = "Slider";
