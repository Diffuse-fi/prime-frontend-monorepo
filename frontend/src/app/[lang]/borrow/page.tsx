import { buildMetadataForPage } from "@/app/metadata";
import { Heading } from "@diffuse/ui-kit/Heading";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";
import { JsonLd } from "@/components/misc/JsonLd";
import { getWebPageGraph } from "@/app/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: locale = DEFAULT_LOCALE } = await params;
  const t = await getTranslations({ locale, namespace: "borrow.metadata" });

  return buildMetadataForPage({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    path: "borrow",
    locale,
  });
}

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
          title: t("metadata.title"),
          description: t("metadata.description"),
          path: "borrow",
          lang,
        })}
      />
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      Borrow
    </section>
  );
}
