import { ClientNavigation } from "@/components/shared/ClientNavigation";
import { DEFAULT_LOCALE, Locale } from "@/lib/localization/locale";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

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
    <main className="flex flex-col gap-12 py-5">
      <ClientNavigation
        locale={lang}
        ariaLabel="Lend page navigation"
        config={[
          { href: "/lend", label: tLend("navigation.lend"), exact: true },
          { href: "/lend/my-positions", label: tLend("navigation.myPositions") },
        ]}
        variant="tabs"
      />
      {children}
    </main>
  );
}
