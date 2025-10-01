import { AssetImage } from "@/components/misc/images/AssetImage";
import { Strategy } from "@/lib/core/types";
import { formatDate } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { SimpleTable } from "@diffuse/ui-kit";

export interface StrategiesListProps {
  strategies: Strategy[];
}

export function StrategiesList({ strategies }: StrategiesListProps) {
  return (
    <div className="bg-preset-gray-50 overflow-hidden rounded-md pt-2 pb-4">
      <SimpleTable
        columns={["Asset", "APR", "End date"]}
        rows={strategies.map(s => [
          <div key="1" className="flex items-center gap-2">
            <AssetImage alt="" address={s.token.asset} size={20} className="grayscale" />
            {s.token.symbol}
          </div>,
          <div key="2">{formatAprToPercent(s.apr).text}</div>,
          <div key="3">{formatDate(s.endDate).text}</div>,
        ])}
      />
    </div>
  );
}
