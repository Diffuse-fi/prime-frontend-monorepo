import * as React from "react";
import { VariantProps } from "@/lib";
import { button } from "./styles";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "solid", size, ...rest },
  ref
) {
  return <button ref={ref} className={button({ variant, size, className })} {...rest} />;
});

Button.displayName = "Button";
