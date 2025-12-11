import { Heading } from "@diffuse/ui-kit/Heading";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getWebPageGraph } from "@/app/jsonld";
import { buildMetadataForPage } from "@/app/metadata";
import { JsonLd } from "@/components/misc/JsonLd";
import { BorrowPositions } from "@/components/pages/borrow/BorrowPositions";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";

export default async function BorrowPositionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = DEFAULT_LOCALE } = await params;
  const t = await getTranslations("borrow-positions");

  return (
    <section>
      <JsonLd
        graph={getWebPageGraph({
          description: t("metadata.description"),
          lang,
          path: "borrow/my-positions",
          title: t("metadata.title"),
        })}
      />
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <BorrowPositions />
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: locale = DEFAULT_LOCALE } = await params;
  const t = await getTranslations({ locale, namespace: "borrow-positions.metadata" });

  return buildMetadataForPage({
    description: t("description"),
    keywords: t("keywords"),
    locale,
    path: "borrow/my-positions",
    title: t("title"),
  });
}
