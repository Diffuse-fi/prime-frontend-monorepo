"use client";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { AssetInfo } from "@/lib/assets/validations";
import { getStableChainMeta } from "@/lib/chains/meta";
import { Strategy, VaultFullInfo } from "@/lib/core/types";
import { formatEvmAddress, formatUnits } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { formatNumberToKMB } from "@/lib/formatters/number";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";
import { Button, Card, CopyButton, Heading, SimpleTable } from "@diffuse/ui-kit";
import { Chain } from "@rainbow-me/rainbowkit";
import { useTranslations } from "next-intl";

type BorrowCardProps = {
  strategy: Strategy;
  selectedAsset: AssetInfo;
  isConnected?: boolean;
  onConnectWallet?: () => void;
  onBorrow?: () => void;
  chain: Chain;
  vault: VaultFullInfo;
};

export function BorrowCard({
  strategy,
  selectedAsset,
  onBorrow,
  chain,
  isConnected,
  vault,
  onConnectWallet,
}: BorrowCardProps) {
  const chainMeta = getStableChainMeta(chain.id);
  const availableLiquidityUnits = formatUnits(
    vault.availableLiquidity,
    selectedAsset.decimals
  );
  const availableLiquidityFormatted = formatNumberToKMB(
    Number(availableLiquidityUnits.meta!.rawViem)
  );
  const t = useTranslations("common");
  const onBtnClick = () => {
    if (!isConnected) {
      onConnectWallet?.();
      return;
    }

    onBorrow?.();
  };

  return (
    <Card
      className="relative"
      cardBodyClassName="gap-4 items-center"
      header={
        <div className="flex items-center justify-start gap-4">
          <AssetImage alt="" address={selectedAsset.address} size={42} />
          <div className="flex flex-col items-start">
            <Heading level="4" className="font-semibold">
              {`${strategy.token.symbol} / ${selectedAsset.symbol}`}
            </Heading>
            <span className="font-mono text-xs">{strategy.name}</span>
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
              {vault.curator ? (
                <div className="-my-1 -mr-1 flex items-center justify-end gap-1">
                  {formatEvmAddress(vault.curator)}
                  <CopyButton size="sm" textToCopy={vault.curator} variant="ghost" />
                </div>
              ) : (
                "-"
              )}
            </div>,
          ],
          [
            <div key="1">Collateral</div>,
            <div key="2" className="text-right">
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center justify-end gap-2">
                  <AssetImage
                    imgURI={selectedAsset.logoURI}
                    alt={selectedAsset.symbol}
                    address={selectedAsset.address}
                    size={20}
                  />
                  {selectedAsset.symbol}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <AssetImage
                    imgURI={strategy.token.logoURI}
                    alt={strategy.token.symbol}
                    address={strategy.token.address}
                    size={20}
                  />
                  {strategy.token.symbol}
                </div>
              </div>
            </div>,
          ],
          [
            <div key="1">Liquidity</div>,
            <div key="2" className="text-right">
              {availableLiquidityFormatted.text} {selectedAsset.symbol}
            </div>,
          ],
        ]}
      />
      <Button size="lg" className="mt-3 w-2/3 md:mt-6" onClick={onBtnClick}>
        {isConnected ? "Borrow" : t("connectWallet")}
      </Button>
    </Card>
  );
}
