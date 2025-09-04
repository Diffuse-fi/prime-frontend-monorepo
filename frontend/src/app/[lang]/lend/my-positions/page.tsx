import { Locale } from "@/lib/localization/locale";
import { buildMetadataForPage } from "@/app/metadata";
import { getDictionary } from "@/lib/localization/dictionaries";
import MyPositions from "@/components/pages/lend/my-positions";
import { Heading } from "@diffuse/ui-kit/Heading";
import { Text } from "@diffuse/ui-kit/Text";

export const metadata = buildMetadataForPage({
  title: "My positions",
  description: "Page description",
  path: "lend/my-positions",
});

export default async function MyPosition({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main>
      <section>
        <Heading level={1}>{dict.lend.myPositions.title}</Heading>
        <Text>{dict.lend.myPositions.description}</Text>
        <MyPositions />
      </section>
    </main>
  );
}
