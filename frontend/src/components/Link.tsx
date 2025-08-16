import { Locale, localizePath } from "@/lib/localization";
import NextLink, { LinkProps } from "next/link";

export default function Link({ locale, href, ...p }: LinkProps & { locale: Locale }) {
  return <NextLink href={localizePath(String(href), locale)} {...p} />;
}
