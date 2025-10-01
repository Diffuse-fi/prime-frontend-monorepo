"use client";

import { AppLink } from "@/components/misc/AppLink";
import { AssetImage } from "@/components/misc/images/AssetImage";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { getStableChainMeta } from "@/lib/chains/meta";
import { getContractExplorerUrl } from "@/lib/chains/rpc";
import { BorrowerPosition } from "@/lib/core/types";
import { formatAsset, formatEvmAddress, formatUnits } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { calcAprInterest } from "@/lib/formulas/apr";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
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

export interface BorrowerPositionCardProps {
  position: BorrowerPosition;
  className?: string;
  withdrawButton?: ReactNode;
}

export function BorrowerPositionCard({
  className,
  position,
  withdrawButton,
}: BorrowerPositionCardProps) {
  const { strategyBalance, strategyId, assetsBorrowed, asset } = position;
  const chainId = useChainId();
  const explorerUrl = getContractExplorerUrl(chainId, position.vault.address);
  const { iconUrl, iconBackground } = getStableChainMeta(chainId);

  return (
    <Card
      className={className}
      cardBodyClassName="gap-4"
      header={
        <div className="flex items-center justify-start gap-4">
          <AssetImage alt="" address={asset.asset} size={20} />
          <Heading level="4" className="inline font-semibold">
            {asset.symbol}
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
              className="text-text-dimmed bg-muted/15 hover:bg-muted/20 flex h-8 items-center gap-3 rounded-md p-2 text-sm transition-colors"
            >
              {formatEvmAddress(position.vault.address)}
              <ExternalLink size={20} className="" />
            </AppLink>
          )}
        </div>
      }
    >
      More info
    </Card>
  );
}
