import { cn } from "@diffuse/ui-kit";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const Jazzicon = dynamic(() => import("react-jazzicon"), { ssr: false });

type TokenImageProps = {
  className?: string;
  size?: number;
  imgURI?: string;
  address: string;
  alt: string;
};

function jsNumberForAddress(addr: string) {
  return parseInt(addr.slice(2, 10), 16);
}

const seedPerAddressMap = new Map<string, number>();

function stableSeedForAddress(address: string) {
  if (!seedPerAddressMap.has(address)) {
    seedPerAddressMap.set(address, jsNumberForAddress(address));
  }

  return seedPerAddressMap.get(address)!;
}

export function TokenImage({
  address,
  size = 32,
  imgURI,
  className,
  alt,
}: TokenImageProps) {
  const [broken, setBroken] = useState(false);
  const seed = stableSeedForAddress(address.toLowerCase());
  const showImg = !!imgURI && !broken;

  return (
    <div
      className={cn("rounded-full overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      {showImg ? (
        <Image
          src={imgURI!}
          alt={alt}
          width={size}
          height={size}
          className="object-cover"
          onError={() => setBroken(true)}
          placeholder="blur"
          fetchPriority="low"
          decoding="async"
        />
      ) : (
        <Jazzicon diameter={size} seed={seed} />
      )}
    </div>
  );
}
