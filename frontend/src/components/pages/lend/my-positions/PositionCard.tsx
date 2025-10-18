"use client";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { getContractExplorerUrl } from "@/lib/chains/rpc";
import { LenderPosition } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprInterest } from "@/lib/formulas/apr";
import {
  ButtonLike,
  Card,
  Heading,
  SimpleTable,
  Tooltip,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { ExternalLink } from "lucide-react";
import { ReactNode } from "react";
import { useChainId } from "wagmi";
import { StrategiesList } from "../StrategiesList";

export interface PositionCardProps {
  position: LenderPosition;
  className?: string;
  withdrawButton?: ReactNode;
}

export function PositionCard({ className, position, withdrawButton }: PositionCardProps) {
  const { vault, asset, balance, accruedYield } = position;
  const chainId = useChainId();
  const explorerUrl = getContractExplorerUrl(chainId, vault.address);
  const vaultAprFormatted = formatAprToPercent(vault.targetApr);
  const defaultLockupPerdiod = 90; // TODO - get real value from the vault data when ready
  const reward = formatUnits(
    calcAprInterest(vault.targetApr, balance, {
      durationInDays: defaultLockupPerdiod,
    }),
    asset.decimals
  ).text;
  const rewardDisplay = reward ? `${reward} ${asset.symbol}` : "-";

  const profitDisplay = !!accruedYield
    ? `${formatUnits(accruedYield, asset.decimals).text} ${asset.symbol}`
    : "-";

  return (
    <Card
      className={className}
      cardBodyClassName="gap-4"
      header={
        <div className="flex items-center justify-start gap-4">
          {asset && (
            <AssetImage
              imgURI={asset?.logoURI}
              size={24}
              address={asset?.address}
              alt=""
            />
          )}
          <div className="flex items-end gap-2">
            <Heading level="4" className="leading-none">
              {vault.name}
            </Heading>
            <p className="text-text-dimmed leading-none">{asset?.symbol}</p>
          </div>
        </div>
      }
    >
      <div className="flex justify-between">
        <div>
          <span className="font-mono text-xs">Deposited</span>
          <p className="text-lg">
            {formatAsset(balance, asset.decimals, asset.symbol).text}
          </p>
        </div>
        <div>
          <span className="text-right font-mono text-xs">Profit</span>
          <p className="text-secondary text-lg">{profitDisplay}</p>
        </div>
      </div>
      <SimpleTable
        aria-label="Vault rewards based on input amount and target APR"
        density="comfy"
        columns={[
          "Rewards type",
          <div key="key" className="text-right font-mono text-xs">
            APR
          </div>,
          <div key="key" className="text-right font-mono text-xs">
            Reward
          </div>,
        ]}
        rows={[
          [
            <div key="1" className="flex items-center">
              <AssetImage
                alt=""
                address={vault?.assets?.at(0)!.address}
                className="mr-1"
                size={20}
              />
              Target APY
            </div>,
            <div key="2" className="text-right">
              {vaultAprFormatted.text}
            </div>,
            <div key="3" className="text-right">
              {rewardDisplay}
            </div>,
          ],
        ]}
      />
      <UncontrolledCollapsible summary="List of strategies" defaultOpen={false}>
        <StrategiesList strategies={vault.strategies} />
      </UncontrolledCollapsible>
      <div className="flex justify-between">
        {withdrawButton}
        <Tooltip side="top" content="Open in explorer">
          <ButtonLike
            href={explorerUrl || ""}
            component={AppLink}
            aria-label="Open vault smart contract in explorer"
            variant="ghost"
            size="lg"
            className="text-secondary"
            disabled={!explorerUrl}
            icon
          >
            <ExternalLink aria-hidden={true} size={24} />
          </ButtonLike>
        </Tooltip>
      </div>
    </Card>
  );
}
