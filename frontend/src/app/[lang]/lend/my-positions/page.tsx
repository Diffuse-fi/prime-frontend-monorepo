import { Locale } from "@/lib/localization/locale";
import { buildMetadataForPage } from "@/app/metadata";
import { Heading, Text } from "@diffuse/ui-kit";
import { getDictionary } from "@/lib/localization/dictionaries";
import MyPositions from "@/components/pages/lend/my-positions";

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
