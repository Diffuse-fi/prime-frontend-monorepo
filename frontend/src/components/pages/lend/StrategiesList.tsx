import { DataTable } from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";
import React from "react";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { Strategy } from "@/lib/core/types";
import { formatDate } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";

export interface StrategiesListProps {
  strategies: Strategy[];
}

export function StrategiesList({ strategies }: StrategiesListProps) {
  const t = useTranslations();
  const data = React.useMemo(
    () =>
      strategies.map(strategy => ({
        apr: strategy.apr,
        endDate: strategy.endDate,
        strategy,
      })),
    [strategies]
  );

  return (
    <div className="bg-preset-gray-50 overflow-hidden rounded-md pt-2 pb-4">
      <DataTable
        columns={[
          {
            cell: ({ row }) => (
              <div className="flex items-center gap-2">
                <AssetImage
                  address={row.original.strategy.token.address}
                  alt=""
                  className="grayscale"
                  imgURI={row.original.strategy.token.logoURI}
                  size={20}
                />
                {row.original.strategy.token.symbol}
              </div>
            ),
            enableSorting: false,
            header: t("lend.strategiesList.asset"),
            id: "asset",
          },
          {
            accessorKey: "apr",
            cell: ({ row }) => formatAprToPercent(row.original.apr).text,
            header: t("common.apr"),
            sortingFn: (a, b, id) => {
              const va = a.getValue<bigint>(id);
              const vb = b.getValue<bigint>(id);

              return compareBigints(va, vb);
            },
          },
          {
            accessorKey: "endDate",
            cell: ({ row }) => formatDate(row.original.endDate).text,
            header: t("lend.strategiesList.endDate"),
            sortingFn: (a, b, id) => {
              const va = a.getValue<bigint>(id);
              const vb = b.getValue<bigint>(id);

              return compareBigints(va, vb);
            },
          },
        ]}
        data={data}
      />
    </div>
  );
}

function compareBigints(a: bigint, b: bigint): number {
  if (a === b) return 0;
  if (a > b) return 1;
  return -1;
}
