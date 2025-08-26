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

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
}

export function Container({ fluid = false, className, ...rest }: ContainerProps) {
  return <div className={container({ fluid, className })} {...rest} />;
}
