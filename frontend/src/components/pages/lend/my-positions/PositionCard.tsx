"use client";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { getContractExplorerUrl } from "@/lib/chains/rpc";
import { LenderPosition } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";
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
import { useTranslations } from "next-intl";

export interface PositionCardProps {
  position: LenderPosition;
  className?: string;
  withdrawButton?: ReactNode;
  claimRewardsButton?: ReactNode;
}

export function PositionCard({
  className,
  position,
  withdrawButton,
  claimRewardsButton,
}: PositionCardProps) {
  const { vault, asset, balance, accruedYield } = position;
  const chainId = useChainId();
  const explorerUrl = getContractExplorerUrl(chainId, vault.address);
  const vaultAprFormatted = formatAprToPercent(vault.targetApr);
  const profitDisplay = !!accruedYield
    ? `${formatUnits(accruedYield, asset.decimals).text} ${asset.symbol}`
    : "-";
  const t = useTranslations("myPositions");
  const tLend = useTranslations("lend");
  const tCommon = useTranslations("common");

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
        density="comfy"
        columns={[
          tLend("rewardsType"),
          <div key="key" className="text-right font-mono text-xs">
            {tCommon("apr")}
          </div>,
          <div key="key" className="text-right font-mono text-xs">
            {t("reward")}
          </div>,
        ]}
        rows={[
          [
            <div key="1" className="flex items-center">
              <AssetImage
                alt=""
                address={vault?.assets?.at(0)!.address}
                imgURI={vault?.assets?.at(0)!.logoURI}
                className="mr-1"
                size={20}
              />
              {tLend("targetApy")}
            </div>,
            <div key="2" className="text-right">
              {vaultAprFormatted.text}
            </div>,
            <div key="3" className="text-right">
              {profitDisplay}
            </div>,
          ],
        ]}
      />
      <UncontrolledCollapsible summary={tLend("listOfStrategies")} defaultOpen={false}>
        <StrategiesList strategies={vault.strategies} />
      </UncontrolledCollapsible>
      <div className="flex justify-between gap-2">
        {claimRewardsButton}
        {withdrawButton}
        <Tooltip side="top" content={t("openInExplorer")}>
          <ButtonLike
            href={explorerUrl || ""}
            component={AppLink}
            aria-label={t("openInExplorerAriaLabel")}
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
