import dynamic from "next/dynamic";
import Image, { ImageProps } from "next/image";
import { Fragment, useState } from "react";

const Jazzicon = dynamic(() => import("react-jazzicon"), { ssr: false });

type ImageWithJazziconFallbackProps = {
  size?: number;
  jazziconSeed?: number;
} & Omit<ImageProps, "width" | "height">;

export function ImageWithJazziconFallback({
  jazziconSeed,
  size = 32,
  src,
  alt,
  onError,
  ...props
}: ImageWithJazziconFallbackProps) {
  const [broken, setBroken] = useState(false);
  const showImg = !!src && !broken;

  return (
    <Fragment>
      {showImg ? (
        <Image
          alt={alt}
          src={src}
          width={size}
          height={size}
          onError={e => {
            setBroken(true);
            onError?.(e);
          }}
          {...props}
        />
      ) : (
        <Jazzicon diameter={size} seed={jazziconSeed} />
      )}
    </Fragment>
  );
}
