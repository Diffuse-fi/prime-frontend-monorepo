import { Locale } from "@/lib/localization/locale";
import { getDictionary } from "../../lib/localization/dictionaries";
import WalletButton from "@/components/WalletButton";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <WalletButton></WalletButton>;
}
