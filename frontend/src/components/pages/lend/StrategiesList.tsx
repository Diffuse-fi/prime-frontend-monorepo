import { SimpleTable } from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { Strategy } from "@/lib/core/types";
import { formatDate } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";

export interface StrategiesListProps {
  strategies: Strategy[];
}

export function StrategiesList({ strategies }: StrategiesListProps) {
  const t = useTranslations();

  return (
    <div className="bg-preset-gray-50 overflow-hidden rounded-md pt-2 pb-4">
      <SimpleTable
        columns={[
          t("lend.strategiesList.asset"),
          t("common.apr"),
          t("lend.strategiesList.endDate"),
        ]}
        rows={strategies.map(s => [
          <div className="flex items-center gap-2" key="1">
            <AssetImage
              address={s.token.address}
              alt=""
              className="grayscale"
              imgURI={s.token.logoURI}
              size={20}
            />
            {s.token.symbol}
          </div>,
          <div key="2">{formatAprToPercent(s.apr).text}</div>,
          <div key="3">{formatDate(s.endDate).text}</div>,
        ])}
      />
    </div>
  );
}
