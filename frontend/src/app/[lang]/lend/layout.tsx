import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

import { LayoutWithTabsNav } from "@/components/misc/LayoutWithTabsNav";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";

export default async function LendLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang = DEFAULT_LOCALE } = await params;
  const tLend = await getTranslations({ locale: lang, namespace: "lend" });

  return (
    <LayoutWithTabsNav
      navConfig={[
        { exact: true, href: "/lend", label: tLend("navigation.lend") },
        { href: "/lend/my-positions", label: tLend("navigation.myPositions") },
      ]}
    >
      {children}
    </LayoutWithTabsNav>
  );
}
