import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";

const Jazzicon = dynamic(() => import("react-jazzicon"), { ssr: false });

type TokenImageProps = {
  className?: string;
  size?: number;
  imgURI?: string;
  address: string;
};

function jsNumberForAddress(addr: string) {
  return parseInt(addr.slice(2, 10), 16);
}

export function TokenImage({ address, size = 32, imgURI, className }: TokenImageProps) {
  const [broken, setBroken] = useState(false);
  const seed = useMemo(() => jsNumberForAddress(address), [address]);
  const showImg = !!imgURI && !broken;

  return (
    <div className={className}>
      {showImg ? (
        <Image
          src={imgURI!}
          alt="token logo"
          width={size}
          height={size}
          className="rounded-full"
          onError={() => setBroken(true)}
        />
      ) : (
        <Jazzicon diameter={size} seed={seed} />
      )}
    </div>
  );
}
