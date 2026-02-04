"use client";

import { AssetInfo } from "@diffuse/config";
import {
  Button,
  Card,
  cn,
  Heading,
  InfoIcon,
  SimpleTable,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { useChainId } from "wagmi";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { isAegisStrategy } from "@/lib/aegis";
import { AegisExitStage } from "@/lib/aegis/types";
import { useAegisExitStage } from "@/lib/aegis/useAegisExitStage";
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
  isExitPending?: boolean;
  onManagePositionBtnClick?: () => void;
  position: BorrowerPosition;
  selectedAsset: AssetInfo;
  strategy: Strategy;
}

export function BorrowerPositionCard({
  className,
  disabled,
  isExitPending,
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

  const isAegis = isAegisStrategy(strategy);

  const stageSelected = useMemo(() => {
    if (!isAegis) return null;
    return {
      address: position.vault.address,
      chainId,
      collateralAsset: collateralAsset.address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
      isAegisStrategy: true,
      positionId: position.id,
      slippage: "0.5",
      strategyId: position.strategyId,
    };
  }, [
    isAegis,
    position.vault.address,
    chainId,
    collateralAsset.address,
    position.id,
    position.strategyId,
  ]);

  const stageQ = useAegisExitStage(stageSelected, position.vault);
  const stagesToIgnoreStatus: AegisExitStage[] = [0, -1];
  const displayExitLabel =
    isAegis && stageQ.data && !stagesToIgnoreStatus.includes(stageQ.data.stage);
  const aegisExitTexts = {
    1: "Exit is prepared and funds are locked. The system now needs a redeem request to be created before it can continue.",
    2: "Redeem request was submitted. The exit is pending approval and may take time. Status will update automatically once approved.",
    3: "Approval is received. The exit is ready to complete and return funds. Completion should be quick once processed.",
  } as const;
  const exitLabelTexts = {
    1: "Exit: submit redeem",
    2: "Exit: pending approval",
    3: "Exit: ready to finalize",
  };
  const exitInfoText = stageQ.data
    ? aegisExitTexts[stageQ.data.stage as keyof typeof aegisExitTexts]
    : "Exit: checking...";
  const exitLabelText = stageQ.data
    ? exitLabelTexts[stageQ.data.stage as keyof typeof exitLabelTexts]
    : "Exit: checking...";

  return (
    <Card
      cardBodyClassName="gap-4"
      className={cn("h-fit", className)}
      header={
        <div className="flex items-start justify-start gap-4">
          <AssetImage
            address={strategyAsset.address}
            alt=""
            imgURI={strategyAsset.logoURI}
            size={24}
          />
          <div className="align-start flex flex-col items-start gap-1">
            <Heading className="font-semibold" level="4">
              {strategyAsset.symbol}
            </Heading>
            <span className="font-mono text-xs">{strategy.name}</span>
            {displayExitLabel ? (
              <span className="mt-1 flex items-center gap-2 text-xs">
                <InfoIcon aria-hidden size={16} text={exitInfoText} />
                {exitLabelText}
              </span>
            ) : null}
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
      {isExitPending && (
        <p className="align-center text-err mt-4 flex font-mono text-sm">
          <InfoIcon
            aria-hidden
            className="text-err mr-2 inline-block"
            size={16}
            text="The strategy exit process may take up to 24 hours (2 hours on average)."
          />
          Exit is pending for this position
          <Button onClick={onManagePositionBtnClick} variant="ghost">
            Check status
          </Button>
        </p>
      )}
      <Button
        className="mx-auto mt-6"
        disabled={disabled || isExitPending}
        onClick={onManagePositionBtnClick}
        size="lg"
      >
        Manage position
      </Button>
    </Card>
  );
}
