import { AssetImage } from "../../shared/AssetImage";
import { AssetInfo } from "@/lib/assets/validations";
import { Skeleton, AssetCard, RadioGroup, RadioGroupItem } from "@diffuse/ui-kit";
import { RadioGroupProps } from "@diffuse/ui-kit/RadioGroup";

type Option = AssetInfo;

interface AssetsListProps {
  selectedAsset?: AssetInfo | null;
  onSelectAsset?: (asset: AssetInfo) => void;
  options: Option[];
  isLoading?: boolean;
  skeletonsToShow?: number;
  direction?: RadioGroupProps["dir"];
}

export function AssetsList({
  selectedAsset,
  onSelectAsset,
  options,
  isLoading,
  skeletonsToShow = 4,
  direction,
}: AssetsListProps) {
  return (
    <RadioGroup
      className="grid-cols-4"
      dir={direction}
      value={selectedAsset?.address}
      onValueChange={value => {
        const asset = options.find(option => option.address === value);
        if (asset) {
          onSelectAsset?.(asset);
        }
      }}
    >
      {isLoading
        ? Array.from({ length: skeletonsToShow }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))
        : options.map(option => (
            <RadioGroupItem
              key={option.address}
              value={option.address}
              className="animate-in-fade"
            >
              <AssetCard
                symbol={option.symbol}
                renderImage={({ alt, className }) => (
                  <AssetImage
                    imgURI={option.logoURI}
                    alt={alt}
                    className={className}
                    address={option.address}
                  />
                )}
                className={`h-12 cursor-pointer px-0 ${
                  selectedAsset?.address === option.address && "border-orange-500"
                }`}
                onClick={() => onSelectAsset?.(option)}
              />
            </RadioGroupItem>
          ))}
    </RadioGroup>
  );
}
