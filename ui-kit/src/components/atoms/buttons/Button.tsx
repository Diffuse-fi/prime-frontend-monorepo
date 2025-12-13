import * as React from "react";

import { VariantProps } from "@/lib";

import { button } from "./styles";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, size = "md", variant = "solid", ...rest },
  ref
) {
  return <button className={button({ className, size, variant })} ref={ref} {...rest} />;
});

Button.displayName = "Button";
