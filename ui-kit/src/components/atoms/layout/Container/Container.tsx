import * as React from "react";

import { tv } from "@/lib";

const container = tv({
  base: "mx-auto w-full px-4 sm:px-6 lg:px-8",
  defaultVariants: {
    fluid: false,
  },
  variants: {
    fluid: {
      false: "max-w-screen-xl",
      true: "",
    },
  },
});

export interface ContainerProps<T extends React.ElementType>
  extends React.HTMLAttributes<T> {
  as?: React.ElementType;
  fluid?: boolean;
}

export function Container<T extends React.ElementType>({
  as,
  className,
  fluid = false,
  ...rest
}: ContainerProps<T>) {
  const Element = as ?? "div";
  return <Element className={container({ className, fluid })} {...rest} />;
}
