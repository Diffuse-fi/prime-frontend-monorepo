import { cn } from "@diffuse/ui-kit";
import { Address, getAddress } from "viem";

import { stableSeedForAddress } from "@/lib/misc/jazzIcons";

import { ImageWithJazziconFallback } from "./ImageWithJazziconFallback";

type AssetImageProps = {
  address: Address;
  alt: string;
  className?: string;
  imgURI?: string;
  size?: number;
};

export function AssetImage({
  address,
  alt,
  className,
  imgURI,
  size = 32,
}: AssetImageProps) {
  const seed = stableSeedForAddress(getAddress(address));

  return (
    <div
      className={cn("bg-transparent", className)}
      style={{ height: size, width: size }}
    >
      <ImageWithJazziconFallback
        alt={alt}
        className="h-full w-full object-cover"
        decoding="async"
        fetchPriority="low"
        jazziconSeed={seed}
        loading="lazy"
        size={size}
        src={imgURI}
      />
    </div>
  );
}
