import { TokenImage } from "@/components/TokenImage";
import { TokenInfo } from "@/lib/tokens/validations";
import { Skeleton, TokenCard } from "@diffuse/ui-kit";

type Option = TokenInfo;

interface AssetsToLendProps {
  selectedAsset?: TokenInfo | null;
  onSelectAsset?: (asset: TokenInfo) => void;
  options: Option[];
  isLoading?: boolean;
  skeletonsToShow?: number;
}

export function AssetsTolend({
  selectedAsset,
  onSelectAsset,
  options,
  isLoading,
  skeletonsToShow = 4,
}: AssetsToLendProps) {
  return (
    <div className="grid gap-2 grid-cols-4">
      {isLoading
        ? Array.from({ length: skeletonsToShow }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))
        : options.map(option => (
            <TokenCard
              key={option.address}
              symbol={option.symbol}
              renderImage={({ alt, className }) => (
                <TokenImage
                  imgURI={option.logoURI}
                  alt={alt}
                  className={className}
                  address={option.address}
                />
              )}
              className={`cursor-pointer h-12 ${
                selectedAsset?.address === option.address && "border-orange-500"
              }`}
              onClick={() => onSelectAsset?.(option)}
            />
          ))}
    </div>
  );
}
