import * as React from "react";
import { cn, tv, VariantProps } from "@/lib";

const variants = tv({
  base: "animate-pulse bg-gray-200 dark:bg-gray-700",
  variants: {
    rounded: {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    rounded: "md",
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, rounded = "md", ...props }, ref) => {
    return <div ref={ref} className={cn(variants({ rounded }), className)} {...props} />;
  }
);

Skeleton.displayName = "Skeleton";
