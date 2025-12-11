import { Strategy } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { formatDateTime } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprInterest } from "@/lib/formulas/apr";
import { calcDaysInterval } from "@/lib/formulas/date";
import { AssetInfo } from "@diffuse/config";
import {
  InfoIcon,
  RemoteText,
  TextWithTooltip,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";

interface PositionDetailsProps {
  strategy: Strategy;
  selectedAsset: AssetInfo;
  liquidationPrice?: bigint;
  enterTimeOrDeadline: number;
  collateralGiven: bigint;
  leverage: bigint;
  loadingLiquidationPrice?: boolean;
  liquidationPriceLoadingError?: string;
  spreadFee: number;
  liquidationPenalty: number;
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
  spreadFee,
  liquidationPenalty,
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
  const t = useTranslations("borrow.positionDetails");
  const tCommon = useTranslations("common");

  return (
    <div className="text-text-dimmed mt-2 flex flex-col gap-4 text-sm">
      <UncontrolledCollapsible
        defaultOpen
        summary={
          <span className="text-muted font-mono text-xs">{t("positionHealth")}</span>
        }
      >
        <div className="flex flex-col gap-2 border-l border-[#FF4800] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>{t("liquidationPrice")}</span>
            <RemoteText
              isLoading={loadingLiquidationPrice}
              text={liquidationPriceDisplay}
              error={liquidationPriceLoadingError}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>{t("liquidationPenalty")}</span>
            <span>{formatAprToPercent(liquidationPenalty, 0).text}</span>
          </div>
        </div>
      </UncontrolledCollapsible>
      <UncontrolledCollapsible
        defaultOpen
        summary={<span className="text-muted font-mono text-xs">{tCommon("apr")}</span>}
      >
        <div className="flex flex-col gap-2 border-l border-[#7AB7FF] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>{t("borrowApr")}</span>
            <span>{formatAprToPercent(apr).text}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-l border-[#7AB7FF] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>{tCommon("leverage")}</span>
            <span>{leverageDisplay}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-l border-[#7AB7FF] px-2 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center leading-none">
              {t("spreadFee")}
              <InfoIcon
                text={t("spreadFeeTooltip")}
                size={14}
                className="ml-1"
                ariaLabel={t("spreadFeeAriaLabel")}
              />
            </div>
            <span>{formatAprToPercent(spreadFee, 0).text}</span>
          </div>
        </div>
      </UncontrolledCollapsible>
      <UncontrolledCollapsible
        defaultOpen
        summary={<span className="text-muted font-mono text-xs">{t("yield")}</span>}
      >
        <div className="flex flex-col gap-2 border-l border-[#49E695] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>{t("daysUntilMaturity")}</span>
            <TextWithTooltip
              text={daysUntilMaturity.toString()}
              tooltip={t("until", { date: fullEndDate })}
              className="underline decoration-dashed underline-offset-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <span>{t("maturityYield")}</span>
            <span>
              {maturityYield !== 0n
                ? `${formatUnits(maturityYield, selectedAsset.decimals).text} ${selectedAsset.symbol}`
                : "N/A"}
            </span>
          </div>
        </div>
      </UncontrolledCollapsible>
    </div>
  );
}
