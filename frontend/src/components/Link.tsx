import { localizePath, PropsWithLocale } from "@/lib/localization/locale";
import NextLink, { LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";

export default function Link({
  locale,
  href,
  ...p
}: PropsWithLocale<LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return <NextLink href={localizePath(String(href), locale)} {...p} />;
}
