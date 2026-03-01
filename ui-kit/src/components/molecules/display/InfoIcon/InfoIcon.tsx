import { Info } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib";

import { Tooltip, TooltipProps } from "../Tooltip/Tooltip";

export type InfoIconProps = {
  ariaLabel?: string;
  className?: string;
  side?: TooltipProps["side"];
  size?: number;
  text: React.ReactNode;
};

export const InfoIcon = React.forwardRef<HTMLSpanElement, InfoIconProps>(
  ({ ariaLabel = "More info", className, side = "top", size, text }, ref) => {
    const tooltipId = React.useId();

    return (
      <Tooltip
        className="max-w-[300px] text-center"
        content={text}
        id={tooltipId}
        side={side}
      >
        <span
          aria-describedby={tooltipId}
          aria-label={ariaLabel}
          className={cn(
            "standard-focus-ring inline-flex cursor-help rounded-full",
            className
          )}
          ref={ref}
          tabIndex={0}
        >
          <Info aria-hidden="true" size={size} />
        </span>
      </Tooltip>
    );
  }
);

InfoIcon.displayName = "InfoIcon";
