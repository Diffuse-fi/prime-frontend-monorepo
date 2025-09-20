import { AppLink } from "@/components/misc/AppLink";
import { DEFAULT_LOCALE } from "@/lib/localization/locale";
import { ButtonLike } from "@diffuse/ui-kit/ButtonLike";
import { Container } from "@diffuse/ui-kit/Container";
import { Heading } from "@diffuse/ui-kit/Heading";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const locale = (await getLocale()) || DEFAULT_LOCALE;
  const t = await getTranslations({ locale, namespace: "not-found" });

  return (
    <Container as="main" className="flex flex-col items-center gap-6 py-16">
      <Heading level="1">{t("title")}</Heading>
      <p>{t("description")}</p>
      <ButtonLike href="/lend" component={AppLink} variant="ghost" size="lg">
        {t("cta")}
      </ButtonLike>
    </Container>
  );
}
