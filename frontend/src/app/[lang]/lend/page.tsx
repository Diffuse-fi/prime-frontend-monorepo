import { Heading } from "@diffuse/ui-kit/Heading";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getWebPageGraph } from "@/app/jsonld";
import { buildMetadataForPage } from "@/app/metadata";
import { JsonLd } from "@/components/misc/JsonLd";
import Lend from "@/components/pages/lend";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: locale = DEFAULT_LOCALE } = await params;
  const t = await getTranslations({ locale, namespace: "lend.metadata" });

  return buildMetadataForPage({
    description: t("description"),
    keywords: t("keywords"),
    locale,
    path: "lend",
    title: t("title"),
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
          description: t("metadata.description"),
          lang,
          path: "lend",
          title: t("metadata.title"),
        })}
      />
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <Lend />
    </section>
  );
}
