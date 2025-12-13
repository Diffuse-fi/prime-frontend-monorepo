import copy from "copy-to-clipboard";
import { CopyCheck, CopyIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib";

import { IconButton, IconButtonProps } from "./IconButton";

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

    // eslint-disable-next-line unicorn/prefer-global-this
    timeoutRef.current = window.setTimeout(() => {
      setCopySuccess(false);
      timeoutRef.current = null;
    }, 2000);
  };

  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  const icon = copySuccess ? <CopyCheck size={iconSize} /> : <CopyIcon size={iconSize} />;

  React.useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, []);

  return (
    <IconButton
      aria-label={ariaLabel}
      className={cn("transition-transform duration-75 active:scale-110", className)}
      icon={icon}
      onClick={handleCopy}
      size={size}
      {...rest}
    />
  );
}
