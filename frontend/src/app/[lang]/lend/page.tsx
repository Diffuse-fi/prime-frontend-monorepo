import { buildMetadataForPage } from "@/app/metadata";
import { Heading } from "@diffuse/ui-kit/Heading";
import LendPage from "@/components/pages/lend";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang: locale = DEFAULT_LOCALE } = params;
  const t = await getTranslations({ locale, namespace: "lend.metadata" });

  return buildMetadataForPage({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    path: "lend",
    locale,
  });
}

export default async function Lend() {
  const t = await getTranslations("lend");

  return (
    <section>
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <LendPage />
    </section>
  );
}
