import { cn } from "@/lib";
import { forwardRef, HTMLAttributes } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, fluid = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        fluid ? "" : "max-w-screen-xl",
        className
      )}
      {...props}
    />
  )
);

Container.displayName = "Container";
