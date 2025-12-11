import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

import { LayoutWithTabsNav } from "@/components/misc/LayoutWithTabsNav";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";

export default async function BorrowLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang = DEFAULT_LOCALE } = await params;
  const tBorrow = await getTranslations({ locale: lang, namespace: "borrow" });

  return (
    <LayoutWithTabsNav
      navConfig={[
        { exact: true, href: "/borrow", label: tBorrow("navigation.borrow") },
        {
          href: "/borrow/my-positions",
          label: tBorrow("navigation.borrowPositions"),
        },
      ]}
    >
      {children}
    </LayoutWithTabsNav>
  );
}
