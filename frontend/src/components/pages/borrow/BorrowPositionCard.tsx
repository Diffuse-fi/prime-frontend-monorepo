"use client";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { AssetInfo } from "@/lib/assets/validations";
import { getStableChainMeta } from "@/lib/chains/meta";
import { getContractExplorerUrl } from "@/lib/chains/rpc";
import { BorrowerPosition, Strategy } from "@/lib/core/types";
import { formatAsset, formatEvmAddress, formatUnits } from "@/lib/formatters/asset";
import { formatDateTime } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprInterest } from "@/lib/formulas/apr";
import { calcDaysInterval } from "@/lib/formulas/date";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
import {
  Button,
  Card,
  cn,
  Heading,
  SimpleTable,
  Tooltip,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { ExternalLink } from "lucide-react";
import { useChainId } from "wagmi";

export interface BorrowerPositionCardProps {
  selectedAsset: AssetInfo;
  position: BorrowerPosition;
  className?: string;
  onManagePositionBtnClick?: () => void;
  disabled?: boolean;
  strategy: Strategy;
}

export function BorrowerPositionCard({
  className,
  position,
  onManagePositionBtnClick,
  disabled,
  selectedAsset,
  strategy,
}: BorrowerPositionCardProps) {
  const {
    strategyBalance,
    assetsBorrowed,
    asset: strategyAsset,
    leverage,
    liquidationPrice,
    collateralGiven,
    collateralType,
    enterTimeOrDeadline,
  } = position;
  const chainId = useChainId();
  const { apr, endDate } = strategy;
  const explorerUrl = getContractExplorerUrl(chainId, position.vault.address);
  const { iconUrl, iconBackground } = getStableChainMeta(chainId);
  const collateralAsset = collateralType === 0 ? selectedAsset : strategyAsset;

  const daysUntilMaturity = calcDaysInterval({ to: endDate });
  const fullEndDate = formatDateTime(endDate).text;
  const maturityYield = calcAprInterest(apr, collateralGiven, {
    durationInDays: calcDaysInterval({
      to: endDate,
      from: enterTimeOrDeadline,
    }),
  });
  const leverageDisplay = `x${(Number(leverage) / 100).toFixed(2)}`;
  const liquidationPriceDisplay = formatAsset(
    liquidationPrice,
    strategyAsset.decimals,
    `${selectedAsset.symbol} / ${strategyAsset.symbol}`
  ).text;

  return (
    <Card
      className={cn("h-fit", className)}
      cardBodyClassName="gap-4"
      header={
        <div className="flex items-center justify-start gap-4">
          <AssetImage alt="" address={strategyAsset.asset} size={20} />
          <Heading level="4" className="inline font-semibold">
            {strategyAsset.symbol}
          </Heading>
          <div className="bg-muted/15 ml-auto flex size-8 items-center justify-center rounded-full">
            <ImageWithJazziconFallback
              src={iconUrl}
              alt=""
              size={20}
              className="object-cover"
              style={{
                background: iconBackground || "transparent",
              }}
              fetchPriority="low"
              decoding="async"
              jazziconSeed={stableSeedForChainId(chainId)}
            />
          </div>
          {explorerUrl && (
            <AppLink
              href={explorerUrl}
              className="text-text-dimmed bg-muted/15 hover:bg-muted/20 flex h-8 items-center gap-3 rounded-md p-2 text-sm text-nowrap transition-colors"
            >
              {formatEvmAddress(position.vault.address)}
              <ExternalLink size={20} className="" />
            </AppLink>
          )}
        </div>
      }
    >
      <div className="bg-preset-gray-50 flex justify-between gap-4 rounded-md px-10 py-5">
        <div className="flex flex-col gap-4">
          <p>Health factor</p>
          <p className="text-lg">-</p>
        </div>
        <div className="flex flex-col gap-4">
          <p>Leverage</p>
          <p className="text-lg">{leverageDisplay}</p>
        </div>
        <div className="flex flex-col gap-4">
          <p>APY</p>
          <p className="text-lg">{formatAprToPercent(apr).text}</p>
        </div>
      </div>
      <SimpleTable
        className="px-10"
        density="comfy"
        aria-label="Position details"
        columns={[
          <div key="key" className="font-mono text-xs">
            Position
          </div>,
          <div key="key2"></div>,
        ]}
        rows={[
          [
            <div key="row-1-1">Total balance</div>,
            <div key="row-1-2" className="text-right">
              {formatUnits(strategyBalance, strategyAsset.decimals).text}{" "}
              {strategyAsset.symbol}
            </div>,
          ],
          [
            <div key="row-1-1">Total debt</div>,
            <div key="row-1-2" className="text-right">
              {formatUnits(assetsBorrowed, selectedAsset.decimals).text}{" "}
              {selectedAsset.symbol}
            </div>,
          ],
          [
            <div key="row-1-1">Collateral</div>,
            <div key="row-1-2" className="text-right">
              {formatUnits(collateralGiven, collateralAsset.decimals).text}{" "}
              {collateralAsset.symbol}
            </div>,
          ],
        ]}
      />
      <UncontrolledCollapsible summary="Position details" className="mt-2 px-10 md:mt-4">
        <div className="text-text-dimmed mt-2 flex flex-col gap-2 text-sm">
          <UncontrolledCollapsible
            defaultOpen
            summary={
              <span className="text-muted font-mono text-xs">Position health</span>
            }
          >
            <div className="flex flex-col gap-2 border-l border-[#FF4800] px-2 py-1">
              <div className="flex items-center justify-between">
                <span>Liquidation price</span>
                <span>{liquidationPriceDisplay}</span>
              </div>
            </div>
          </UncontrolledCollapsible>
          <UncontrolledCollapsible
            defaultOpen
            summary={<span className="text-muted font-mono text-xs">APR</span>}
          >
            <div className="flex flex-col gap-2 border-l border-[#7AB7FF] px-2 py-1">
              <div className="flex items-center justify-between">
                <span>Overall APR</span>
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
      </UncontrolledCollapsible>
      <Button
        disabled={disabled}
        size="lg"
        className="mx-auto mt-6"
        onClick={onManagePositionBtnClick}
      >
        Manage position
      </Button>
    </Card>
  );
}
