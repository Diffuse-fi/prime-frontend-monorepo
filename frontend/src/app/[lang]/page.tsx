import { Locale } from "@/lib/localization";
import { getDictionary } from "./dictionaries";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <ConnectButton />;
}
