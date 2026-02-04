"use client";

import { AssetInfo } from "@diffuse/config";
import {
  Button,
  Card,
  CopyButton,
  Heading,
  InfoIcon,
  SimpleTable,
} from "@diffuse/ui-kit";
import { Chain } from "@rainbow-me/rainbowkit";
import { useTranslations } from "next-intl";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { ImageWithJazziconFallback } from "@/components/misc/images/ImageWithJazziconFallback";
import { getStableChainMeta } from "@/lib/chains/meta";
import { Strategy, VaultFullInfo } from "@/lib/core/types";
import { formatEvmAddress, formatUnits } from "@/lib/formatters/asset";
import { formatAprToPercent } from "@/lib/formatters/finance";
import { formatNumberToKMB } from "@/lib/formatters/number";
import { stableSeedForChainId } from "@/lib/misc/jazzIcons";

type BorrowCardProps = {
  chain: Chain;
  isConnected?: boolean;
  onBorrow?: () => void;
  onConnectWallet?: () => void;
  selectedAsset: AssetInfo;
  strategy: Strategy;
  vault: VaultFullInfo;
};

export function BorrowCard({
  chain,
  isConnected,
  onBorrow,
  onConnectWallet,
  selectedAsset,
  strategy,
  vault,
}: BorrowCardProps) {
  const chainMeta = getStableChainMeta(chain.id);
  const availableLiquidityUnits = formatUnits(
    vault.availableLiquidity,
    selectedAsset.decimals
  );
  const availableLiquidityFormatted = formatNumberToKMB(
    Number(availableLiquidityUnits.meta!.rawViem)
  );
  const tCommon = useTranslations("common");
  const t = useTranslations("borrow.borrowCard");
  const onBtnClick = () => {
    if (!isConnected) {
      onConnectWallet?.();
      return;
    }

    onBorrow?.();
  };
  const disabled = vault.availableLiquidity === 0n;

  return (
    <Card
      cardBodyClassName="gap-4 items-center"
      className="relative"
      header={
        <div className="flex items-center justify-start gap-4">
          <AssetImage
            address={strategy.token.address}
            alt=""
            imgURI={strategy.token.logoURI}
            size={42}
          />
          <div className="flex flex-col items-start">
            <Heading className="font-semibold" level="4">
              {`${strategy.token.symbol} / ${selectedAsset.symbol}`}
            </Heading>
            <span className="font-mono text-xs">{strategy.name}</span>
          </div>
        </div>
      }
    >
      <SimpleTable
        aria-label="Strategy details"
        columns={[
          <div className="font-mono text-xs" key="key">
            Details
          </div>,
          <div key="key2"></div>,
        ]}
        density="comfy"
        rows={[
          [
            <div key="1">Chain</div>,
            <div className="flex items-center justify-end gap-2" key="2">
              <ImageWithJazziconFallback
                alt={chain.name}
                className="rounded-full object-cover"
                decoding="async"
                fetchPriority="low"
                jazziconSeed={stableSeedForChainId(chain.id)}
                size={20}
                src={chainMeta.iconUrl}
                style={{ background: chainMeta.iconBackground || "transparent" }}
              />
              {chain.name}
            </div>,
          ],
          [
            <div className="flex items-center pt-1 leading-none" key="1">
              <span>{t("borrowRate")}</span>
              <InfoIcon
                ariaLabel={t("borrowRateAriaLabel")}
                className="ml-1"
                size={14}
                text={t("borrowRateTooltip", {
                  apr: formatAprToPercent(strategy.apr).text,
                  spreadFee: formatAprToPercent(vault.feeData.spreadFee).text,
                })}
              />
            </div>,
            <div className="text-right" key="2">
              {
                formatAprToPercent(
                  strategy.apr + BigInt(Math.round(vault.feeData.spreadFee))
                ).text
              }
            </div>,
          ],
          [
            <div key="1">Curator</div>,
            <div className="text-right" key="2">
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
            <div className="text-right" key="2">
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center justify-end gap-2">
                  <AssetImage
                    address={selectedAsset.address}
                    alt={selectedAsset.symbol}
                    imgURI={selectedAsset.logoURI}
                    size={20}
                  />
                  {selectedAsset.symbol}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <AssetImage
                    address={strategy.token.address}
                    alt={strategy.token.symbol}
                    imgURI={strategy.token.logoURI}
                    size={20}
                  />
                  {strategy.token.symbol}
                </div>
              </div>
            </div>,
          ],
          [
            <div key="1">{t("liquidity")}</div>,
            <div className="text-right" key="2">
              {availableLiquidityFormatted.text} {selectedAsset.symbol}
            </div>,
          ],
        ]}
      />
      <Button
        className="mt-3 w-2/3 md:mt-6"
        disabled={disabled}
        onClick={onBtnClick}
        size="lg"
      >
        {isConnected ? t("borrow") : tCommon("connectWallet")}
      </Button>
    </Card>
  );
}
