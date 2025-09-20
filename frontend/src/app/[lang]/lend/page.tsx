import { buildMetadataForPage } from "@/app/metadata";
import { Heading } from "@diffuse/ui-kit/Heading";
import Lend from "@/components/pages/lend";
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
  const t = await getTranslations({ locale, namespace: "lend.metadata" });

  return buildMetadataForPage({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    path: "lend",
    locale,
  });
}

export default async function LendPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = DEFAULT_LOCALE } = await params;
  const t = await getTranslations("lend");

  return (
    <section>
      <JsonLd
        graph={getWebPageGraph({
          title: t("metadata.title"),
          description: t("metadata.description"),
          path: "lend",
          lang,
        })}
      />
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <Lend />
    </section>
  );
}
