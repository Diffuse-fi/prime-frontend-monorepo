import { AssetInfo } from "@diffuse/config";
import { AssetCard, cn, RadioGroup, RadioGroupItem, Skeleton } from "@diffuse/ui-kit";
import { RadioGroupProps } from "@diffuse/ui-kit/RadioGroup";

import { AssetImage } from "@/components/misc/images/AssetImage";

interface AssetsListProps {
  className?: string;
  direction?: RadioGroupProps["dir"];
  isLoading?: boolean;
  onSelectAsset?: (asset: AssetInfo) => void;
  options: Option[];
  selectedAsset?: AssetInfo | null;
  skeletonsToShow?: number;
}

type Option = AssetInfo;

export function AssetsList({
  className,
  direction,
  isLoading,
  onSelectAsset,
  options,
  selectedAsset,
  skeletonsToShow = 4,
}: AssetsListProps) {
  return (
    <RadioGroup
      aria-label="Select an asset"
      className={cn("grid-cols-4", className)}
      dir={direction}
      onValueChange={value => {
        const asset = options.find(option => option.address === value);
        if (asset) {
          onSelectAsset?.(asset);
        }
      }}
      value={selectedAsset?.address}
    >
      {isLoading
        ? Array.from({ length: skeletonsToShow }).map((_, i) => (
            <Skeleton className="h-13" key={i} />
          ))
        : options.map(option => (
            <RadioGroupItem
              className="w-fit rounded-xl"
              key={option.address}
              value={option.address}
            >
              <AssetCard
                className="h-13 px-2"
                onClick={() => onSelectAsset?.(option)}
                renderImage={({ alt, className }) => (
                  <AssetImage
                    address={option.address}
                    alt={alt}
                    className={className}
                    imgURI={option.logoURI}
                    size={24}
                  />
                )}
                symbol={option.symbol}
                variant={
                  selectedAsset?.address === option.address ? "accented" : "default"
                }
              />
            </RadioGroupItem>
          ))}
    </RadioGroup>
  );
}
