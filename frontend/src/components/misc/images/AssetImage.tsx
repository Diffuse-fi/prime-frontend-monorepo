import { stableSeedForAddress } from "@/lib/misc/jazzIcons";
import { cn } from "@diffuse/ui-kit";
import { getAddress, Address } from "viem";
import { ImageWithJazziconFallback } from "./ImageWithJazziconFallback";

type AssetImageProps = {
  className?: string;
  size?: number;
  imgURI?: string;
  address: Address;
  alt: string;
};

export function AssetImage({
  address,
  size = 32,
  imgURI,
  className,
  alt,
}: AssetImageProps) {
  const seed = stableSeedForAddress(getAddress(address));

  return (
    <div
      className={cn("overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      <ImageWithJazziconFallback
        src={imgURI}
        alt={alt}
        size={size}
        className="h-full w-full object-cover"
        jazziconSeed={seed}
        fetchPriority="low"
        decoding="async"
        loading="lazy"
      />
    </div>
  );
}
