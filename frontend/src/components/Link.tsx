import { localizePath, PropsWithLocale } from "@/lib/localization/locale";
import NextLink, { LinkProps } from "next/link";
import { ReactNode } from "react";

export default function Link({
  locale,
  href,
  ...p
}: PropsWithLocale<
  LinkProps & {
    children: ReactNode;
  }
>) {
  return <NextLink href={localizePath(String(href), locale)} {...p} />;
}
