import * as React from "react";
import { tv, VariantProps } from "@/lib";
import { Button } from "./Button";
import { button } from "./styles";

export const iconButton = tv({
  extend: button,
  defaultVariants: { variant: "ghost", size: "md", icon: true },
});

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof iconButton>, "icon"> {
  "aria-label": string;
  icon: React.ReactNode;
}

export function IconButton({
  size,
  variant,
  className,
  icon,
  "aria-label": ariaLabel,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      className={iconButton({ size, variant, className, icon: true })}
      aria-label={ariaLabel}
      variant={variant}
      {...rest}
    >
      {icon}
    </Button>
  );
}
