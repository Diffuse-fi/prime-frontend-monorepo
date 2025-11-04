import * as React from "react";
import { Tooltip, TooltipProps } from "./Tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib";

export type InfoIconProps = {
  text: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  size?: number;
  side?: TooltipProps["side"];
};

export const InfoIcon = React.forwardRef<HTMLSpanElement, InfoIconProps>(
  ({ text, className, ariaLabel = "More info", size, side = "top" }, ref) => {
    const tooltipId = React.useId();

    return (
      <Tooltip
        content={text}
        className="max-w-[300px] text-center"
        id={tooltipId}
        side={side}
      >
        <span
          tabIndex={0}
          className={cn(
            "standard-focus-ring inline-flex cursor-help rounded-full",
            className
          )}
          aria-describedby={tooltipId}
          aria-label={ariaLabel ?? text}
          ref={ref}
        >
          <Info size={size} aria-hidden="true" />
        </span>
      </Tooltip>
    );
  }
);

InfoIcon.displayName = "InfoIcon";
