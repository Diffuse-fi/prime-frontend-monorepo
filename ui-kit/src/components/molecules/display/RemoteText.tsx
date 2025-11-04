import * as React from "react";
import { Skeleton } from "../../atoms";
import { cn } from "@/lib";

export interface RemoteTextProps {
  isLoading?: boolean;
  text: string;
  textComponent?: React.ElementType;
  className?: string;
  error?: string;
}

export const RemoteText = React.forwardRef<HTMLDivElement, RemoteTextProps>(
  ({ text, isLoading, textComponent, className, error }, ref) => {
    const Text = textComponent ?? "span";

    return (
      <div
        aria-busy={isLoading || undefined}
        ref={ref}
        className={cn("relative inline-flex flex-col gap-1", className)}
      >
        <Text className={cn(isLoading && "invisible")}>{text}</Text>
        {isLoading && <Skeleton className="absolute top-0 right-0 bottom-0 left-0" />}
        {error && (
          <span role="alert" className="text-err text-xs">
            {error}
          </span>
        )}
      </div>
    );
  }
);

RemoteText.displayName = "RemoteText";
