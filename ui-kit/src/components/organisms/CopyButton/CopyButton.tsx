import copy from "copy-to-clipboard";
import { CopyCheck, CopyIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib";

import { IconButton, IconButtonProps } from "../../atoms/buttons/IconButton";
import { Tooltip } from "../../molecules";

export type CopyButtonProps = Omit<IconButtonProps, "aria-label" | "icon"> & {
  "aria-label"?: string;
  textToCopy: string;
};

export function CopyButton({
  "aria-label": ariaLabel = "Copy to clipboard",
  className,
  onClick,
  size = "md",
  textToCopy,
  ...rest
}: CopyButtonProps) {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const timeoutRef = React.useRef<null | number>(null);

  const clearExistingTimeout = () => {
    if (timeoutRef.current !== null) {
      globalThis.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleCopy: React.MouseEventHandler<HTMLButtonElement> = e => {
    onClick?.(e);
    clearExistingTimeout();
    copy(textToCopy);
    setCopySuccess(true);

    timeoutRef.current = globalThis.window.setTimeout(() => {
      setCopySuccess(false);
      timeoutRef.current = null;
    }, 2000);
  };

  const iconSizeMap = {
    lg: 24,
    md: 20,
    sm: 16,
    xs: 12,
  };
  const iconSize = iconSizeMap[size];
  const icon = copySuccess ? <CopyCheck size={iconSize} /> : <CopyIcon size={iconSize} />;

  React.useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, []);

  return (
    <Tooltip content="Copied!" offset={2} open={copySuccess} side="top">
      <IconButton
        aria-label={ariaLabel}
        className={cn("transition-transform duration-75 active:scale-110", className)}
        icon={icon}
        onClick={handleCopy}
        size={size}
        {...rest}
      />
    </Tooltip>
  );
}
