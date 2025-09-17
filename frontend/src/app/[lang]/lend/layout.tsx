import { ClientNavigation } from "@/components/misc/ClientNavigation";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";
import { Container } from "@diffuse/ui-kit/Container";
import { Locale } from "next-intl";
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
    <div className="relative flex grow flex-col gap-12 overflow-scroll">
      <Container className="bg-bg sticky top-0 z-10 mt-5">
        <ClientNavigation
          ariaLabel="Lend page navigation"
          config={[
            { href: "/lend", label: tLend("navigation.lend"), exact: true },
            { href: "/lend/my-positions", label: tLend("navigation.myPositions") },
          ]}
          variant="tabs"
        />
      </Container>
      <Container as="main" className="grow pb-5">
        {children}
      </Container>
    </div>
  );
}
