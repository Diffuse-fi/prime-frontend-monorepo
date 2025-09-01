import * as React from "react";
import { cn } from "@/lib/cn";
import { Card } from "../molecules";
import { Text } from "../atoms";

type RenderImage = (props: { alt: string; className: string }) => React.ReactNode;

export interface TokenCardProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol: string;
  renderImage: RenderImage;
}

export const TokenCard = React.forwardRef<HTMLDivElement, TokenCardProps>(
  ({ symbol, className, renderImage, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("border-[color:var(--ui-accent)]", className)}
        {...props}
      >
        <div className="flex items-center gap-2 flex-nowrap">
          {renderImage({
            alt: symbol,
            className: "flex-shrink-0",
          })}
          <Text>{symbol}</Text>
        </div>
      </Card>
    );
  }
);

TokenCard.displayName = "TokenCard";
