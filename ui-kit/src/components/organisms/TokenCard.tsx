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
        cardBodyClassName="px-2 py-2"
        {...props}
      >
        <div className="flex flex-nowrap items-center gap-2">
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
