import * as React from "react";
import { cn } from "@/lib/cn";
import { Card } from "./index.js";
import { tv, VariantProps } from "@/lib";

type RenderImage = (props: { alt: string; className: string }) => React.ReactNode;

export interface AssetCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof assetCard> {
  symbol: string;
  renderImage: RenderImage;
}

const assetCard = tv({
  base: "border rounded-xl py-0",
  variants: {
    variant: {
      default: "bf-fg text-muted border-border",
      accented: "bg-accent text-primary-fg border-accent",
    },
  },
  defaultVariants: { variant: "default" },
});

export const AssetCard = React.forwardRef<HTMLDivElement, AssetCardProps>(
  ({ symbol, className, renderImage, variant, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(assetCard({ variant }), className)}
        cardBodyClassName="px-2 py-2"
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
