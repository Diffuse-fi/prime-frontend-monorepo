import * as React from "react";

import { cn } from "@/lib";

import { Tooltip, TooltipProps } from "./Tooltip";

export type TextWithTooltipProps = {
  ariaLabel?: string;
  className?: string;
  side?: TooltipProps["side"];
  text: string;
  tooltip: React.ReactNode;
};

export const TextWithTooltip = React.forwardRef<HTMLSpanElement, TextWithTooltipProps>(
  ({ ariaLabel, className, side = "top", text, tooltip }, ref) => {
    const tooltipId = React.useId();

    return (
      <Tooltip
        className="max-w-[300px] text-center"
        content={tooltip}
        id={tooltipId}
        side={side}
      >
        <span
          aria-describedby={tooltipId}
          aria-label={ariaLabel ?? text}
          className={cn(
            "standard-focus-ring cursor-help underline decoration-dashed underline-offset-2",
            className
          )}
          ref={ref}
          tabIndex={0}
        >
          {text}
        </span>
      </Tooltip>
    );
  }
);

TextWithTooltip.displayName = "TextWithTooltip";
