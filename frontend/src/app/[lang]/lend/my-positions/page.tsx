import { buildMetadataForPage } from "@/app/metadata";
import MyPositions from "@/components/pages/lend/my-positions";
import { Heading } from "@diffuse/ui-kit/Heading";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";
import { JsonLd } from "@/components/misc/JsonLd";
import { getWebPageGrapth } from "@/app/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: locale = DEFAULT_LOCALE } = await params;
  const t = await getTranslations({ locale, namespace: "myPositions.metadata" });

  return buildMetadataForPage({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    path: "lend/my-positions",
    locale,
  });
}

export default async function MyPosition({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = DEFAULT_LOCALE } = await params;
  const t = await getTranslations("myPositions");

  return (
    <section>
      <JsonLd
        graph={getWebPageGrapth({
          title: t("title"),
          description: t("description"),
          path: "lend/my-positions",
          lang,
        })}
      />
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <MyPositions />
    </section>
  );
}
