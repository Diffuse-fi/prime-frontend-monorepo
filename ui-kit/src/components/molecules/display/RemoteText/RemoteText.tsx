import * as React from "react";

import { cn } from "@/lib";

import { Skeleton } from "../../../atoms";

export interface RemoteTextProps {
  className?: string;
  error?: string;
  isLoading?: boolean;
  text: string;
  textComponent?: React.ElementType;
}

export const RemoteText = React.forwardRef<HTMLDivElement, RemoteTextProps>(
  ({ className, error, isLoading, text, textComponent }, ref) => {
    const Text = textComponent ?? "span";

    return (
      <div
        aria-busy={isLoading || undefined}
        className={cn("relative inline-flex flex-col gap-1", className)}
        ref={ref}
      >
        <Text className={cn(isLoading && "invisible")}>{text}</Text>
        {isLoading && <Skeleton className="absolute top-0 right-0 bottom-0 left-0" />}
        {error && (
          <span className="text-err text-xs" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

RemoteText.displayName = "RemoteText";
