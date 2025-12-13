import * as React from "react";

import { cn, VariantProps } from "@/lib";

import { button } from "./styles";

export type ButtonLikeProps<T extends React.ElementType = "button"> = PolymorphicProps<
  T,
  VariantProps<typeof button> & {
    className?: string;
  }
>;

type PolymorphicProps<T extends React.ElementType, P> = Omit<
  React.ComponentPropsWithoutRef<T>,
  "component" | keyof P
> &
  P & {
    component?: T;
  };

export function ButtonLike<T extends React.ElementType = "button">({
  className,
  component,
  icon,
  size = "md",
  variant,
  ...rest
}: ButtonLikeProps<T>) {
  const Component = component ?? "button";

  return (
    <Component className={cn(button({ className, icon, size, variant }))} {...rest} />
  );
}
