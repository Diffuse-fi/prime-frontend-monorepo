import { Locale } from "@/lib/localization/locale";
import { getDictionary } from "../../lib/localization/dictionaries";
import ConnectButton from "@/components/ConnectButton";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ConnectButton />;
}
