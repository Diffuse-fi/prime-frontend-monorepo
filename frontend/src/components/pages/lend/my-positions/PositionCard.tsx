"use client";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { getContractExplorerUrl } from "@/lib/chains/meta";
import { LenderPosition } from "@/lib/core/types";
import { formatAsset } from "@/lib/formatters/asset";
import { formatDate } from "@/lib/formatters/date";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprInterest } from "@/lib/formulas";
import {
  Button,
  Card,
  Heading,
  IconButton,
  SimpleTable,
  Tooltip,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { ExternalLink } from "lucide-react";
import { useChainId } from "wagmi";

export interface PositionCardProps {
  position: LenderPosition;
  className?: string;
  onWithDrawSuccess?: () => void;
  onWithDrawError?: () => void;
}

export function PositionCard({ className, position }: PositionCardProps) {
  const { vault, asset, balance, accruedYield } = position;
  const chainId = useChainId();
  const explorerUrl = getContractExplorerUrl(chainId, vault.address);
  const vaultAprFormatted = formatAprToPercent(vault.targetApr);
  const defaultLockupPerdiod = 90; // TODO - get real value from the vault data when ready
  const reward = calcAprInterest(vault.targetApr, balance, {
    durationInDays: defaultLockupPerdiod,
  });
  const rewardDisplay = reward
    ? `${reward > 0n ? "≈ " : ""}${formatAprToPercent(reward).text} ${asset.symbol}`
    : "-";
  const profitDisplay = !!accruedYield
    ? `${formatAprToPercent(accruedYield).text} ${asset.symbol}`
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
          <div className="flex items-center gap-2">
            <Heading level="4" className="inline font-semibold">
              {vault.name}
            </Heading>
            <span className="text-text-dimmed text-sm">{asset?.symbol}</span>
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
          <p className="text-lg">{profitDisplay}</p>
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
        {vault?.strategies?.map(s => (
          <div key={s.apr}>
            {formatAprToPercent(s.apr).text} APR, until&nbsp;
            {formatDate(s.endDate).text}
          </div>
        ))}
      </UncontrolledCollapsible>
      <div className="flex justify-between">
        <Button disabled>Withdraw</Button>
        <Tooltip side="top" content="Open in explorer">
          <AppLink href={explorerUrl ? explorerUrl : ""}>
            <IconButton
              aria-label="Open in explorer"
              size="lg"
              variant="ghost"
              className="text-secondary"
              icon={<ExternalLink size={24} />}
              disabled={!explorerUrl}
            />
          </AppLink>
        </Tooltip>
      </div>
    </Card>
  );
}
