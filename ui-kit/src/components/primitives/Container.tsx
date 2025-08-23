import { cn } from "@/lib";
import { forwardRef, HTMLAttributes } from "react";

/**
 * Container component props.
 */
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * If true, the container will always take the full width of its parent.
   */
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
