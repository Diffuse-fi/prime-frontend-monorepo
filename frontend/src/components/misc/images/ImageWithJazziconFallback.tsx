import { cn } from "@diffuse/ui-kit/cn";
import dynamic from "next/dynamic";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

const Jazzicon = dynamic(() => import("react-jazzicon"), { ssr: false });

type ImageWithJazziconFallbackProps = {
  size?: number;
  jazziconSeed?: number;
  src?: ImageProps["src"];
} & Omit<ImageProps, "width" | "height" | "src">;

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
    <div className={cn(showImg ? "" : "overflow-hidden rounded-full")}>
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
    </div>
  );
}
