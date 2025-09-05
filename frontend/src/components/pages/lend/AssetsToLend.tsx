import { TokenImage } from "@/components/TokenImage";
import { TokenInfo } from "@/lib/tokens/validations";
import { Skeleton, TokenCard, RadioGroup, RadioGroupItem } from "@diffuse/ui-kit";
import { RadioGroupProps } from "@diffuse/ui-kit/RadioGroup";

type Option = TokenInfo;

interface AssetsToLendProps {
  selectedAsset?: TokenInfo | null;
  onSelectAsset?: (asset: TokenInfo) => void;
  options: Option[];
  isLoading?: boolean;
  skeletonsToShow?: number;
  direction?: RadioGroupProps["dir"];
}

export function AssetsTolend({
  selectedAsset,
  onSelectAsset,
  options,
  isLoading,
  skeletonsToShow = 4,
  direction,
}: AssetsToLendProps) {
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
            <RadioGroupItem key={option.address} value={option.address}>
              <TokenCard
                symbol={option.symbol}
                renderImage={({ alt, className }) => (
                  <TokenImage
                    imgURI={option.logoURI}
                    alt={alt}
                    className={className}
                    address={option.address}
                  />
                )}
                className={`cursor-pointer h-12 px-0 ${
                  selectedAsset?.address === option.address && "border-orange-500"
                }`}
                onClick={() => onSelectAsset?.(option)}
              />
            </RadioGroupItem>
          ))}
    </RadioGroup>
  );
}
