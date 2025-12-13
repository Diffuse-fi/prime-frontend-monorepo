import * as React from "react";

import { tv, VariantProps } from "@/lib";
import { cn } from "@/lib/cn";

import { Card } from "./Card";

export interface AssetCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof assetCard> {
  renderImage: RenderImage;
  symbol: string;
}

type RenderImage = (props: { alt: string; className: string }) => React.ReactNode;

const assetCard = tv({
  base: "border rounded-xl py-0",
  defaultVariants: { variant: "default" },
  variants: {
    variant: {
      accented: "bg-accent text-primary-fg border-accent",
      default: "bf-fg text-muted border-border",
    },
  },
});

export const AssetCard = React.forwardRef<HTMLDivElement, AssetCardProps>(
  ({ className, renderImage, symbol, variant, ...props }, ref) => {
    return (
      <Card
        cardBodyClassName="px-2 py-2"
        className={cn(assetCard({ variant }), className)}
        ref={ref}
        {...props}
      >
        <div className="flex grow flex-nowrap items-center gap-2">
          {renderImage({
            alt: symbol,
            className: "flex-shrink-0",
          })}
          <p>{symbol}</p>
        </div>
      </Card>
    );
  }
);

AssetCard.displayName = "AssetCard";
