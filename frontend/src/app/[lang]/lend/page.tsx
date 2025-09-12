import { buildMetadataForPage } from "@/app/metadata";
import { Heading } from "@diffuse/ui-kit/Heading";
import LendPage from "@/components/pages/lend";
import { useTranslations } from "next-intl";

export const metadata = buildMetadataForPage({
  title: "Lend",
  description: "Page description",
  path: "lend",
});

export default function Lend() {
  const t = useTranslations("lend");

  return (
    <section>
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <LendPage />
    </section>
  );
}
