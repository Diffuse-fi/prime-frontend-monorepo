import { Heading } from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";
import { memo } from "react";

function RisksNoticeComponent() {
  const t = useTranslations("lend.risks");

  return (
    <ul className="bg-err-light list-inside list-none space-y-2 rounded-sm p-4">
      <li>
        <Heading level="4" className="text-err font-semibold">
          {t("utilization.title")}
        </Heading>
        <p className="inline">{t("utilization.description")}</p>
      </li>
      <li>
        <Heading level="4" className="text-err font-semibold">
          {t("protocol.title")}
        </Heading>
        <p className="inline">{t("protocol.description")}</p>
      </li>
    </ul>
  );
}

export const RisksNotice = memo(RisksNoticeComponent);
