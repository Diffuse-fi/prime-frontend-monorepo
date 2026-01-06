"use client";

import { AssetInfo } from "@diffuse/config";
import {
  Button,
  Card,
  cn,
  Heading,
  SimpleTable,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { ExternalLink } from "lucide-react";
import { useChainId } from "wagmi";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { getStableChainMeta } from "@/lib/chains/meta";
import { getContractExplorerUrl } from "@/lib/chains/rpc";
import { BorrowerPosition, Strategy } from "@/lib/core/types";
import { formatEvmAddress, formatUnits } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";

import { PositionDetails } from "./PositionDetails";

export interface BorrowerPositionCardProps {
  className?: string;
  disabled?: boolean;
  onManagePositionBtnClick?: () => void;
  position: BorrowerPosition;
  selectedAsset: AssetInfo;
  strategy: Strategy;
}

export function BorrowerPositionCard({
  className,
  disabled,
  onManagePositionBtnClick,
  position,
  selectedAsset,
  strategy,
}: BorrowerPositionCardProps) {
  const {
    asset: strategyAsset,
    assetsBorrowed,
    collateralGiven,
    collateralType,
    leverage,
    liquidationPrice,
    strategyBalance,
  } = position;
  const chainId = useChainId();
  const { apr } = strategy;
  const explorerUrl = getContractExplorerUrl(chainId, position.vault.address);
  const { iconBackground, iconUrl } = getStableChainMeta(chainId);
  const collateralAsset = collateralType === 0 ? selectedAsset : strategyAsset;

  return (
    <Card
      cardBodyClassName="gap-4"
      className={cn("h-fit", className)}
      header={
        <div className="flex items-center justify-start gap-4">
          <AssetImage
            address={strategyAsset.address}
            alt=""
            imgURI={strategyAsset.logoURI}
            size={24}
          />
          <div className="flex flex-col items-start">
            <Heading className="font-semibold" level="4">
              {strategyAsset.symbol}
            </Heading>
            <span className="font-mono text-xs">{strategy.name}</span>
          </div>
          <div className="bg-muted/15 ml-auto flex size-8 items-center justify-center rounded-full">
            <ImageWithJazziconFallback
              alt=""
              className="object-cover"
              decoding="async"
              fetchPriority="low"
              jazziconSeed={stableSeedForChainId(chainId)}
              size={20}
              src={iconUrl}
              style={{
                background: iconBackground || "transparent",
              }}
            />
          </div>
          {explorerUrl && (
            <AppLink
              className="text-text-dimmed bg-muted/15 hover:bg-muted/20 flex h-8 items-center gap-3 rounded-md p-2 text-sm text-nowrap transition-colors"
              href={explorerUrl}
            >
              {formatEvmAddress(position.vault.address)}
              <ExternalLink className="" size={20} />
            </AppLink>
          )}
        </div>
      }
    >
      <div className="bg-muted/15 flex justify-between gap-4 rounded-md px-10 py-5">
        <div className="flex flex-col gap-4">
          <p>Health factor</p>
          <p className="text-lg">-</p>
        </div>
        <div className="flex flex-col gap-4">
          <p>Leverage</p>
          <p className="text-lg">{`x${(Number(leverage) / 100).toFixed(2)}`}</p>
        </div>
        <div className="flex flex-col gap-4">
          <p>APY</p>
          <p className="text-lg">{formatAprToPercent(apr).text}</p>
        </div>
      </div>
      <SimpleTable
        aria-label="Position details"
        className="px-10"
        columns={[
          <div className="font-mono text-xs" key="key">
            Position
          </div>,
          <div key="key2"></div>,
        ]}
        density="comfy"
        rows={[
          [
            <div key="row-1-1">Total balance</div>,
            <div className="text-right" key="row-1-2">
              {formatUnits(strategyBalance, strategyAsset.decimals).text}{" "}
              {strategyAsset.symbol}
            </div>,
          ],
          [
            <div key="row-1-1">Total debt</div>,
            <div className="text-right" key="row-1-2">
              {formatUnits(assetsBorrowed, selectedAsset.decimals).text}{" "}
              {selectedAsset.symbol}
            </div>,
          ],
          [
            <div key="row-1-1">Collateral</div>,
            <div className="text-right" key="row-1-2">
              {formatUnits(collateralGiven, collateralAsset.decimals).text}{" "}
              {collateralAsset.symbol}
            </div>,
          ],
        ]}
      />
      <UncontrolledCollapsible className="mt-2 px-10 md:mt-4" summary="Position details">
        <PositionDetails
          borrowedAmount={assetsBorrowed}
          collateralAsset={collateralAsset}
          collateralGiven={collateralGiven}
          leverage={leverage}
          liquidationPenalty={position.vault.feeData.liquidationFee}
          liquidationPrice={liquidationPrice}
          liquidationPriceLoadingError={undefined}
          loadingLiquidationPrice={false}
          selectedAsset={selectedAsset}
          spreadFee={position.vault.feeData.spreadFee}
          strategy={strategy}
          totalBalance={strategyBalance}
          vault={position.vault}
        />
      </UncontrolledCollapsible>
      <Button
        className="mx-auto mt-6"
        disabled={disabled}
        onClick={onManagePositionBtnClick}
        size="lg"
      >
        Manage position
      </Button>
    </Card>
  );
}
