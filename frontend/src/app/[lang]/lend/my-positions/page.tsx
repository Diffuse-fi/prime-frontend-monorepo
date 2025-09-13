import { buildMetadataForPage } from "@/app/metadata";
import MyPositions from "@/components/pages/lend/my-positions";
import { Heading } from "@diffuse/ui-kit/Heading";
import { useTranslations } from "next-intl";

export const metadata = buildMetadataForPage({
  title: "My positions",
  description: "Page description",
  path: "lend/my-positions",
});

export default function MyPosition() {
  const t = useTranslations("myPositions");

  return (
    <main>
      <section>
        <Heading level="1">{t("title")}</Heading>
        <p>{t("description")}</p>
        <MyPositions />
      </section>
    </main>
  );
}
