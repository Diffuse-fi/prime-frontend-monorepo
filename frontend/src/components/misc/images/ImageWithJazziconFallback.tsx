import { cn } from "@diffuse/ui-kit/cn";
import dynamic from "next/dynamic";
import Image, { ImageProps } from "next/image";
import React, { useState } from "react";

const Jazzicon = dynamic(() => import("react-jazzicon"), { ssr: false });

type ImageWithJazziconFallbackProps = Omit<ImageProps, "height" | "src" | "width"> & {
  jazziconSeed?: number;
  size?: number;
  src?: ImageProps["src"];
};

export function ImageWithJazziconFallback({
  alt,
  jazziconSeed,
  onError,
  size = 32,
  src,
  ...props
}: ImageWithJazziconFallbackProps) {
  const [broken, setBroken] = useState(false);
  const showImg = !!src && !broken;

  return (
    <div className={cn(showImg ? "" : "overflow-hidden rounded-full")}>
      {showImg ? (
        <Image
          alt={alt}
          height={size}
          onError={e => {
            setBroken(true);
            onError?.(e);
          }}
          src={src}
          width={size}
          {...props}
        />
      ) : (
        <Jazzicon diameter={size} seed={jazziconSeed} />
      )}
    </div>
  );
}
