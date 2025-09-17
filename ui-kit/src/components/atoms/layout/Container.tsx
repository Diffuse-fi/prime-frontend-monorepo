import * as React from "react";
import { tv } from "@/lib";

const container = tv({
  base: "mx-auto w-full px-4 sm:px-6 lg:px-8",
  variants: {
    fluid: {
      true: "",
      false: "max-w-screen-xl",
    },
  },
  defaultVariants: {
    fluid: false,
  },
});

export interface ContainerProps<T extends React.ElementType>
  extends React.HTMLAttributes<T> {
  fluid?: boolean;
  as?: React.ElementType;
}

export function Container<T extends React.ElementType>({
  fluid = false,
  className,
  as,
  ...rest
}: ContainerProps<T>) {
  const Element = as ?? "div";
  return <Element className={container({ fluid, className })} {...rest} />;
}
