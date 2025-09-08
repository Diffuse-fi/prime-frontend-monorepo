import { stableSeedForAddress } from "@/lib/misc/jazzIcons";
import { cn } from "@diffuse/ui-kit";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { getAddress, Address } from "viem";

const Jazzicon = dynamic(() => import("react-jazzicon"), { ssr: false });

type TokenImageProps = {
  className?: string;
  size?: number;
  imgURI?: string;
  address: Address;
  alt: string;
};

export function TokenImage({
  address,
  size = 32,
  imgURI,
  className,
  alt,
}: TokenImageProps) {
  const [broken, setBroken] = useState(false);
  const seed = stableSeedForAddress(getAddress(address));
  const showImg = !!imgURI && !broken;

  return (
    <div
      className={cn("overflow-hidden rounded-full", className)}
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
