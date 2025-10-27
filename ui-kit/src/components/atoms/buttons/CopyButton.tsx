import * as React from "react";
import { CopyCheck, CopyIcon } from "lucide-react";
import { IconButton, IconButtonProps } from "./IconButton";
import { cn } from "@/lib";
import copy from "copy-to-clipboard";

export type CopyButtonProps = Omit<IconButtonProps, "icon" | "aria-label"> & {
  "aria-label"?: string;
  textToCopy: string;
};

export function CopyButton({
  size = "md",
  onClick,
  className,
  "aria-label": ariaLabel = "Copy to clipboard",
  textToCopy,
  ...rest
}: CopyButtonProps) {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const clearExistingTimeout = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleCopy: React.MouseEventHandler<HTMLButtonElement> = e => {
    onClick?.(e);
    clearExistingTimeout();
    copy(textToCopy);
    setCopySuccess(true);

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
      className={cn("transition-transform duration-75 active:scale-110", className)}
      icon={icon}
      aria-label={ariaLabel}
      onClick={handleCopy}
      size={size}
      {...rest}
    />
  );
}
