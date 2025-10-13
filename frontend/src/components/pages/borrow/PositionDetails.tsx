import { AssetInfo } from "@/lib/assets/validations";
import { Strategy } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { formatDateTime } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprInterest } from "@/lib/formulas/apr";
import { calcDaysInterval } from "@/lib/formulas/date";
import { RemoteText, Tooltip, UncontrolledCollapsible } from "@diffuse/ui-kit";

interface PositionDetailsProps {
  strategy: Strategy;
  selectedAsset: AssetInfo;
  liquidationPrice?: bigint;
  enterTimeOrDeadline: number;
  collateralGiven: bigint;
  leverage: bigint;
  loadingLiquidationPrice?: boolean;
  liquidationPriceLoadingError?: string;
}

export function PositionDetails({
  selectedAsset,
  strategy,
  liquidationPrice,
  enterTimeOrDeadline,
  collateralGiven,
  leverage,
  loadingLiquidationPrice,
  liquidationPriceLoadingError,
}: PositionDetailsProps) {
  const { apr, endDate, token: strategyAsset } = strategy;
  const daysUntilMaturity = calcDaysInterval({ to: endDate });
  const fullEndDate = formatDateTime(endDate).text;
  const maturityYield = calcAprInterest(apr, collateralGiven, {
    durationInDays: calcDaysInterval({
      to: endDate,
      from: enterTimeOrDeadline,
    }),
  });
  const leverageDisplay = `x${(Number(leverage) / 100).toFixed(2)}`;
  const liquidationPriceDisplay = liquidationPrice
    ? formatAsset(
        liquidationPrice,
        strategyAsset.decimals,
        `${selectedAsset.symbol} / ${strategyAsset.symbol}`
      ).text
    : "N/A";

  return (
    <div className="text-text-dimmed mt-2 flex flex-col gap-4 text-sm">
      <UncontrolledCollapsible
        defaultOpen
        summary={<span className="text-muted font-mono text-xs">Position health</span>}
      >
        <div className="flex flex-col gap-2 border-l border-[#FF4800] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>Liquidation price</span>
            <RemoteText
              isLoading={loadingLiquidationPrice}
              text={liquidationPriceDisplay}
              error={liquidationPriceLoadingError}
            />
          </div>
        </div>
      </UncontrolledCollapsible>
      <UncontrolledCollapsible
        defaultOpen
        summary={<span className="text-muted font-mono text-xs">APR</span>}
      >
        <div className="flex flex-col gap-2 border-l border-[#7AB7FF] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>Borrow APR</span>
            <span>{formatAprToPercent(apr).text}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-l border-[#7AB7FF] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>Leverage</span>
            <span>{leverageDisplay}</span>
          </div>
        </div>
      </UncontrolledCollapsible>
      <UncontrolledCollapsible
        defaultOpen
        summary={<span className="text-muted font-mono text-xs">Yield</span>}
      >
        <div className="flex flex-col gap-2 border-l border-[#49E695] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>Days until maturity</span>
            <Tooltip content={fullEndDate} side="top">
              <span>{daysUntilMaturity}</span>
            </Tooltip>
          </div>
          <div className="flex items-center justify-between">
            <span>Maturity yield</span>
            <span>
              {formatUnits(maturityYield, selectedAsset.decimals).text}{" "}
              {selectedAsset.symbol}
            </span>
          </div>
        </div>
      </UncontrolledCollapsible>
    </div>
  );
}
