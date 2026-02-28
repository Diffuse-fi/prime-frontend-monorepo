import * as React from "react";

import { tv, VariantProps } from "@/lib";

import { Button } from "../Button/Button";
import { button } from "../styles";

export const iconButton = tv({
  defaultVariants: { icon: true, size: "md", variant: "ghost" },
  extend: button,
});

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof iconButton>, "icon"> {
  "aria-label": string;
  icon: React.ReactNode;
}

export function IconButton({
  "aria-label": ariaLabel,
  className,
  icon,
  size = "md",
  variant,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className={iconButton({ className, icon: true, size, variant })}
      size={size}
      variant={variant}
      {...rest}
    >
      {icon}
    </Button>
  );
}
