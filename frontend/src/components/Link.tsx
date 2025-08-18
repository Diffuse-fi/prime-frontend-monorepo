import { localizePath, PropsWithLocale } from "@/lib/localization/locale";
import NextLink, { LinkProps } from "next/link";

export default function Link({ locale, href, ...p }: PropsWithLocale<LinkProps>) {
  return <NextLink href={localizePath(String(href), locale)} {...p} />;
}
