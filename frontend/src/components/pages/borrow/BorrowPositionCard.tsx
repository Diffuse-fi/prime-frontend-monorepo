"use client";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { AssetInfo } from "@/lib/assets/validations";
import { getStableChainMeta } from "@/lib/chains/meta";
import { getContractExplorerUrl } from "@/lib/chains/rpc";
import { BorrowerPosition } from "@/lib/core/types";
import { formatAsset, formatEvmAddress, formatUnits } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprInterest } from "@/lib/formulas/apr";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
import {
  Button,
  ButtonLike,
  Card,
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
  strategyApr: bigint;
}

export function BorrowerPositionCard({
  className,
  position,
  onManagePositionBtnClick,
  disabled,
  selectedAsset,
  strategyApr,
}: BorrowerPositionCardProps) {
  const {
    strategyBalance,
    strategyId,
    assetsBorrowed,
    asset: strategyAsset,
    leverage,
    collateralGiven,
    collateralType,
  } = position;
  const chainId = useChainId();
  const explorerUrl = getContractExplorerUrl(chainId, position.vault.address);
  const { iconUrl, iconBackground } = getStableChainMeta(chainId);
  const collateralAsset = collateralType === 0 ? selectedAsset : strategyAsset;

  return (
    <Card
      className={className}
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
          <p className="text-lg">{`x${(Number(leverage) / 100).toFixed(2)}`}</p>
        </div>
        <div className="flex flex-col gap-4">
          <p>APY</p>
          <p className="text-lg">{formatAprToPercent(strategyApr).text}</p>
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
        <div></div>
      </UncontrolledCollapsible>
      <Button
        disabled={disabled}
        size="lg"
        className="mx-auto"
        onClick={onManagePositionBtnClick}
      >
        Manage position
      </Button>
    </Card>
  );
}
