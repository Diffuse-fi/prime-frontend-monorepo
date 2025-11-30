import { AssetImage } from "@/components/misc/images/AssetImage";
import { AssetInfo } from "@/lib/assets/validations";
import { Skeleton, AssetCard, RadioGroup, RadioGroupItem, cn } from "@diffuse/ui-kit";
import { RadioGroupProps } from "@diffuse/ui-kit/RadioGroup";
import { useTranslations } from "next-intl";

type Option = AssetInfo;

interface AssetsListProps {
  selectedAsset?: AssetInfo | null;
  onSelectAsset?: (asset: AssetInfo) => void;
  options: Option[];
  isLoading?: boolean;
  skeletonsToShow?: number;
  direction?: RadioGroupProps["dir"];
  className?: string;
}

export function AssetsList({
  selectedAsset,
  onSelectAsset,
  options,
  isLoading,
  skeletonsToShow = 4,
  direction,
  className,
}: AssetsListProps) {
  const t = useTranslations("common.accessibility");
  return (
    <RadioGroup
      className={cn("grid-cols-4", className)}
      aria-label={t("selectAsset")}
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
            <Skeleton key={i} className="h-13" />
          ))
        : options.map(option => (
            <RadioGroupItem
              key={option.address}
              value={option.address}
              className="w-fit rounded-xl"
            >
              <AssetCard
                symbol={option.symbol}
                renderImage={({ alt, className }) => (
                  <AssetImage
                    imgURI={option.logoURI}
                    alt={alt}
                    className={className}
                    address={option.address}
                    size={24}
                  />
                )}
                variant={
                  selectedAsset?.address === option.address ? "accented" : "default"
                }
                className="h-13 px-2"
                onClick={() => onSelectAsset?.(option)}
              />
            </RadioGroupItem>
          ))}
    </RadioGroup>
  );
}
