"use client";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { AssetInfo } from "@/lib/assets/validations";
import { getStableChainMeta } from "@/lib/chains/meta";
import { VaultFullInfo } from "@/lib/core/types";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
import { Button, Card, Heading, SimpleTable } from "@diffuse/ui-kit";
import { Chain } from "@rainbow-me/rainbowkit";

type BorrowCardProps = {
  strategy: VaultFullInfo["strategies"][number];
  selectedAsset: AssetInfo;
  isConnected?: boolean;
  onBorrow?: () => void;
  chain: Chain;
};

export function BorrowCard({
  strategy,
  selectedAsset,
  onBorrow,
  chain,
  isConnected,
}: BorrowCardProps) {
  const chainMeta = getStableChainMeta(chain.id);

  return (
    <Card
      cardBodyClassName="gap-4 items-center"
      header={
        <div className="flex items-center justify-start gap-4">
          <AssetImage alt="" address={selectedAsset.address} size={42} />
          <div className="flex items-center gap-4">
            <Heading level="4" className="font-semibold">
              {strategy.id}
            </Heading>
          </div>
        </div>
      }
    >
      <SimpleTable
        aria-label="Strategy details"
        density="comfy"
        columns={[
          <div key="key" className="font-mono text-xs">
            Details
          </div>,
          <div key="key2"></div>,
        ]}
        rows={[
          [
            <div key="1">Chain</div>,
            <div key="2" className="flex items-center justify-end gap-2">
              <ImageWithJazziconFallback
                alt={chain.name}
                size={20}
                src={chainMeta.iconUrl}
                className="rounded-full object-cover"
                style={{ background: chainMeta.iconBackground || "transparent" }}
                jazziconSeed={stableSeedForChainId(chain.id)}
                decoding="async"
                fetchPriority="low"
              />
              {chain.name}
            </div>,
          ],
          [
            <div key="1">APR</div>,
            <div key="2" className="text-right">
              {formatAprToPercent(strategy.apr).text}
            </div>,
          ],
          [
            <div key="1">Curator</div>,
            <div key="2" className="text-right">
              Diffuse Prime
            </div>,
          ],
          [
            <div key="1">Collateral</div>,
            <div key="2" className="text-right">
              {selectedAsset.symbol}
            </div>,
          ],
        ]}
      />
      <Button
        size="lg"
        className="mt-3 w-2/3 md:mt-6"
        onClick={onBorrow}
        disabled={!isConnected}
      >
        {isConnected ? "Borrow" : "Connect wallet"}
      </Button>
    </Card>
  );
}
