import { Locale } from "@/lib/localization/locale";
import { buildMetadataForPage } from "@/app/metadata";
import { Heading } from "@diffuse/ui-kit/Heading";
import { getDictionary } from "@/lib/localization/dictionaries";
import LendPage from "@/components/pages/lend";

export const metadata = buildMetadataForPage({
  title: "Lend",
  description: "Page description",
  path: "lend",
});

export default async function Lend({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <section>
      <Heading level="1">{dict.lend.title}</Heading>
      <p>{dict.lend.description}</p>
      <LendPage />
    </section>
  );
}
