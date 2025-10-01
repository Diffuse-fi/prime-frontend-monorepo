import { buildMetadataForPage } from "@/app/metadata";
import { Heading } from "@diffuse/ui-kit/Heading";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";
import { JsonLd } from "@/components/misc/JsonLd";
import { getWebPageGraph } from "@/app/jsonld";
import { BorrowPositions } from "@/components/pages/borrow/BorrowPositions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: locale = DEFAULT_LOCALE } = await params;
  const t = await getTranslations({ locale, namespace: "borrow-positions.metadata" });

  return buildMetadataForPage({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    path: "borrow/my-positions",
    locale,
  });
}

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
          title: t("metadata.title"),
          description: t("metadata.description"),
          path: "borrow/my-positions",
          lang,
        })}
      />
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <BorrowPositions />
    </section>
  );
}
