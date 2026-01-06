import { AssetInfo } from "@diffuse/config";
import {
  InfoIcon,
  RemoteText,
  TextWithTooltip,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";
import { getAddress } from "viem";

import { useSimulateTokenSale } from "@/lib/core/hooks/useSimulateTokenSale";
import { useStrategyReverseRoute } from "@/lib/core/hooks/useStrategyReverseRoute";
import { Strategy, VaultFullInfo } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { formatDateTime } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprInterest } from "@/lib/formulas/apr";
import { calcDaysInterval } from "@/lib/formulas/date";

interface PositionDetailsProps {
  borrowedAmount: bigint;
  collateralAsset: AssetInfo;
  collateralGiven: bigint;
  leverage: bigint;
  liquidationPenalty: number;
  liquidationPrice?: bigint;
  liquidationPriceLoadingError?: string;
  loadingLiquidationPrice?: boolean;
  selectedAsset: AssetInfo;
  spreadFee: number;
  strategy: Strategy;
  totalBalance?: bigint;
  vault: VaultFullInfo;
}

export function PositionDetails({
  borrowedAmount,
  collateralAsset,
  collateralGiven,
  leverage,
  liquidationPenalty,
  liquidationPrice,
  liquidationPriceLoadingError,
  loadingLiquidationPrice,
  selectedAsset,
  spreadFee,
  strategy,
  totalBalance,
  vault,
}: PositionDetailsProps) {
  const { apr, endDate, token: strategyAsset } = strategy;
  const { adapters: reverseRouteAdapters } = useStrategyReverseRoute({
    strategyId: strategy.id,
    vault,
  });
  const adapters = reverseRouteAdapters.slice(1);
  const selectedAssetAddress = getAddress(selectedAsset.address);
  const collateralAssetAddress = getAddress(collateralAsset.address);
  const collateralIsSelectedAsset = selectedAssetAddress === collateralAssetAddress;
  const daysUntilMaturity = calcDaysInterval({ to: endDate });
  const fullEndDate = formatDateTime(endDate).text;
  const borrowAprBps = apr + BigInt(Math.round(spreadFee));
  const totalBalanceSale = useSimulateTokenSale({
    adapters,
    amount: totalBalance,
  });
  const collateralSale = useSimulateTokenSale({
    adapters,
    amount: collateralIsSelectedAsset ? 0n : collateralGiven,
    enabled: !collateralIsSelectedAsset,
  });

  const collateralInSelectedAsset = collateralIsSelectedAsset
    ? collateralGiven
    : (collateralSale.amountOut ?? null);

  const totalBalanceInSelectedAsset = totalBalanceSale.amountOut ?? null;

  const borrowInterest =
    borrowedAmount > 0n && daysUntilMaturity > 0
      ? calcAprInterest(borrowAprBps, borrowedAmount, {
          durationInDays: daysUntilMaturity,
        })
      : 0n;

  const maturityYield =
    totalBalanceInSelectedAsset !== null && collateralInSelectedAsset !== null
      ? totalBalanceInSelectedAsset -
        collateralInSelectedAsset -
        borrowInterest -
        borrowedAmount
      : null;

  const targetApyBps =
    collateralInSelectedAsset !== null &&
    collateralInSelectedAsset > 0n &&
    maturityYield !== null &&
    daysUntilMaturity > 0
      ? (maturityYield * 365n * 10_000n) /
        (collateralInSelectedAsset * BigInt(daysUntilMaturity))
      : null;
  const showUnprofitableWarning = targetApyBps !== null && targetApyBps <= borrowAprBps;
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
      <div className="flex items-center justify-between">
        <div className="flex items-center leading-none">
          {t("targetApy")}
          <InfoIcon
            ariaLabel={t("targetApyAriaLabel")}
            className="ml-1"
            size={14}
            text={t("targetApyTooltip")}
          />
        </div>
        <span>
          {targetApyBps === null ? "N/A" : formatAprToPercent(targetApyBps).text}
        </span>
      </div>
      {showUnprofitableWarning ? (
        <p className="text-err font-mono text-xs">{t("unprofitableWarning")}</p>
      ) : null}
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
              error={liquidationPriceLoadingError}
              isLoading={loadingLiquidationPrice}
              text={liquidationPriceDisplay}
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
            <div className="flex items-center leading-none">
              <span>{t("borrowApr")}</span>
              <InfoIcon
                ariaLabel={t("borrowAprAriaLabel")}
                className="ml-1"
                size={14}
                text={t("borrowAprTooltip", {
                  apr: formatAprToPercent(apr).text,
                  spreadFee: formatAprToPercent(spreadFee).text,
                })}
              />
            </div>
            <span>{formatAprToPercent(borrowAprBps).text}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-l border-[#7AB7FF] px-2 py-1">
          <div className="flex items-center justify-between">
            <span>{tCommon("leverage")}</span>
            <span>{leverageDisplay}</span>
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
              className="underline decoration-dashed underline-offset-2"
              text={daysUntilMaturity.toString()}
              tooltip={t("until", { date: fullEndDate })}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>{t("maturityYield")}</span>
            <span>
              {maturityYield === null
                ? "N/A"
                : `${formatUnits(maturityYield, selectedAsset.decimals).text} ${selectedAsset.symbol}`}
            </span>
          </div>
        </div>
      </UncontrolledCollapsible>
    </div>
  );
}
