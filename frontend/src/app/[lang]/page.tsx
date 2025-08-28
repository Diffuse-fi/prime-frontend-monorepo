import { Locale } from "@/lib/localization/locale";
import { redirect, RedirectType } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  //redirect(`/${lang}/lend`, RedirectType.replace);
}
