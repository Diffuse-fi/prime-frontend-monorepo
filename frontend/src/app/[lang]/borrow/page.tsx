import { Locale } from "@/lib/localization/locale";
import { buildMetadataForPage } from "@/app/metadata";
import { useTranslations } from "next-intl";

export const metadata = buildMetadataForPage({
  title: "Borrow",
  description: "Page description",
  path: "borrow",
});

export default function Borrow() {
  const t = useTranslations("borrow");

  return <></>;
}
