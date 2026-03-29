import * as React from "react";

import { cn, tv, VariantProps } from "@/lib";

const variants = tv({
  base: "animate-pulse bg-gray-200 dark:bg-gray-700",
  defaultVariants: {
    rounded: "md",
  },
  variants: {
    rounded: {
      full: "rounded-full",
      lg: "rounded-lg",
      md: "rounded-md",
      sm: "rounded-sm",
    },
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, rounded = "md", ...props }, ref) => {
    return <div className={cn(variants({ rounded }), className)} ref={ref} {...props} />;
  }
);

Skeleton.displayName = "Skeleton";
