import * as React from "react";
import { cn, VariantProps } from "@/lib";
import { button } from "./styles";

type PolymorphicProps<T extends React.ElementType, P> = P & {
  component?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, keyof P | "component">;

export type ButtonLikeProps<T extends React.ElementType = "button"> = PolymorphicProps<
  T,
  VariantProps<typeof button> & {
    className?: string;
  }
>;

export function ButtonLike<T extends React.ElementType = "button">({
  component,
  className,
  variant,
  size = "md",
  icon,
  ...rest
}: ButtonLikeProps<T>) {
  const Component = component ?? "button";

  return (
    <Component className={cn(button({ variant, size, className, icon }))} {...rest} />
  );
}
