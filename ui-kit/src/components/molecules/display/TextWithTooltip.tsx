import * as React from "react";
import { Tooltip, TooltipProps } from "./Tooltip";
import { cn } from "@/lib";

export type TextWithTooltipProps = {
  text: string;
  tooltip: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  side?: TooltipProps["side"];
};

export const TextWithTooltip = React.forwardRef<HTMLSpanElement, TextWithTooltipProps>(
  ({ text, tooltip, className, ariaLabel, side = "top" }, ref) => {
    const tooltipId = React.useId();

    return (
      <Tooltip
        content={tooltip}
        className="max-w-[300px] text-center"
        id={tooltipId}
        side={side}
      >
        <span
          ref={ref}
          tabIndex={0}
          aria-label={ariaLabel ?? text}
          aria-describedby={tooltipId}
          className={cn(
            "standard-focus-ring cursor-help underline decoration-dashed underline-offset-2",
            className
          )}
        >
          {text}
        </span>
      </Tooltip>
    );
  }
);

TextWithTooltip.displayName = "TextWithTooltip";
