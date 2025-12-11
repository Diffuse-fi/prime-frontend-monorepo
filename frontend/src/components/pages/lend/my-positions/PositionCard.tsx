"use client";

import {
  ButtonLike,
  Card,
  Heading,
  SimpleTable,
  Tooltip,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { useChainId } from "wagmi";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { getContractExplorerUrl } from "@/lib/chains/rpc";
import { LenderPosition } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";

import { StrategiesList } from "../StrategiesList";

export interface PositionCardProps {
  claimRewardsButton?: ReactNode;
  className?: string;
  position: LenderPosition;
  withdrawButton?: ReactNode;
}

export function PositionCard({
  claimRewardsButton,
  className,
  position,
  withdrawButton,
}: PositionCardProps) {
  const { accruedYield, asset, balance, vault } = position;
  const chainId = useChainId();
  const explorerUrl = getContractExplorerUrl(chainId, vault.address);
  const vaultAprFormatted = formatAprToPercent(vault.targetApr);
  const profitDisplay = accruedYield
    ? `${formatUnits(accruedYield, asset.decimals).text} ${asset.symbol}`
    : "-";
  const t = useTranslations("myPositions");
  const tLend = useTranslations("lend");
  const tCommon = useTranslations("common");

  return (
    <Card
      cardBodyClassName="gap-4"
      className={className}
      header={
        <div className="flex items-center justify-start gap-4">
          {asset && (
            <AssetImage
              address={asset?.address}
              alt=""
              imgURI={asset?.logoURI}
              size={24}
            />
          )}
          <div className="flex items-end gap-2">
            <Heading className="leading-none" level="4">
              {vault.name}
            </Heading>
            <p className="text-text-dimmed leading-none">{asset?.symbol}</p>
          </div>
        </div>
      }
    >
      <div className="flex justify-between">
        <div>
          <span className="font-mono text-xs">{t("deposited")}</span>
          <p className="text-lg">
            {formatAsset(balance, asset.decimals, asset.symbol).text}
          </p>
        </div>
        <div>
          <span className="text-right font-mono text-xs">{t("profit")}</span>
          <p className="text-secondary text-lg">{profitDisplay}</p>
        </div>
      </div>
      <SimpleTable
        aria-label={tLend("ariaLabels.vaultRewards")}
        columns={[
          tLend("rewardsType"),
          <div className="text-right font-mono text-xs" key="key">
            {tCommon("apr")}
          </div>,
          <div className="text-right font-mono text-xs" key="key">
            {t("reward")}
          </div>,
        ]}
        density="comfy"
        rows={[
          [
            <div className="flex items-center" key="1">
              <AssetImage
                address={vault?.assets?.at(0)!.address}
                alt=""
                className="mr-1"
                imgURI={vault?.assets?.at(0)!.logoURI}
                size={20}
              />
              {tLend("targetApy")}
            </div>,
            <div className="text-right" key="2">
              {vaultAprFormatted.text}
            </div>,
            <div className="text-right" key="3">
              {profitDisplay}
            </div>,
          ],
        ]}
      />
      <UncontrolledCollapsible defaultOpen={false} summary={tLend("listOfStrategies")}>
        <StrategiesList strategies={vault.strategies} />
      </UncontrolledCollapsible>
      <div className="flex justify-between gap-2">
        {claimRewardsButton}
        {withdrawButton}
        <Tooltip content={t("openInExplorer")} side="top">
          <ButtonLike
            aria-label={t("openInExplorerAriaLabel")}
            className="text-secondary"
            component={AppLink}
            disabled={!explorerUrl}
            href={explorerUrl || ""}
            icon
            size="lg"
            variant="ghost"
          >
            <ExternalLink aria-hidden={true} size={24} />
          </ButtonLike>
        </Tooltip>
      </div>
    </Card>
  );
}
