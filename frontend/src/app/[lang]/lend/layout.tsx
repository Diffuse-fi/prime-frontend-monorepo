import { ClientNavigation } from "@/components/shared/ClientNavigation";
import { getDictionary } from "@/lib/localization/dictionaries";
import { DEFAULT_LOCALE, Locale } from "@/lib/localization/locale";
import { ReactNode } from "react";

export default async function LendLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang = DEFAULT_LOCALE } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <ClientNavigation
        className="mb-6"
        locale={lang}
        ariaLabel="Lend page navigation"
        config={[
          { href: "/lend", label: dict.lend.navigation.lend, exact: true },
          { href: "/lend/my-positions", label: dict.lend.navigation.myPositions },
        ]}
        variant="tabs"
      />
      {children}
    </main>
  );
}
