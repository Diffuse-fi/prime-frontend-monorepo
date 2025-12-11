import { Heading } from "@diffuse/ui-kit/Heading";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getWebPageGraph } from "@/app/jsonld";
import { buildMetadataForPage } from "@/app/metadata";
import { JsonLd } from "@/components/misc/JsonLd";
import Borrow from "@/components/pages/borrow";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";

export default async function BorrowPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = DEFAULT_LOCALE } = await params;
  const t = await getTranslations("borrow");

  return (
    <section>
      <JsonLd
        graph={getWebPageGraph({
          description: t("metadata.description"),
          lang,
          path: "borrow",
          title: t("metadata.title"),
        })}
      />
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <Borrow />
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: locale = DEFAULT_LOCALE } = await params;
  const t = await getTranslations({ locale, namespace: "borrow.metadata" });

  return buildMetadataForPage({
    description: t("description"),
    keywords: t("keywords"),
    locale,
    path: "borrow",
    title: t("title"),
  });
}
