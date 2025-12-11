import { AssetInfo } from "@diffuse/config";
import {
  AssetInput,
  Button,
  Dialog,
  Heading,
  Tooltip,
  UncontrolledCollapsible,
} from "@diffuse/ui-kit";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { getAddress, parseUnits } from "viem";

import { AssetImage } from "@/components/misc/images/AssetImage";
import { useVaults } from "@/lib/core/hooks/useVaults";
import { useWithdraw } from "@/lib/core/hooks/useWithdraw";
import { LenderPosition } from "@/lib/core/types";
import { formatAsset, formatUnits } from "@/lib/formatters/asset";
import { formatNumberToKMB } from "@/lib/formatters/number";

type WithdrawModalProps = {
  onOpenChange: (open: boolean) => void;
  onWithdrawError: (e: string) => void;
  onWithdrawSuccess: () => void;
  open: boolean;
  selectedAsset: AssetInfo;
  selectedPosition: LenderPosition;
  title?: ReactNode;
};

export function WithdrawModal({
  onOpenChange,
  onWithdrawError,
  onWithdrawSuccess,
  open,
  selectedAsset,
  selectedPosition,
  title,
}: WithdrawModalProps) {
  const [amountToWithdraw, setAmountToWithdraw] = useState<bigint>(0n);
  const { vaultLimits, vaults } = useVaults();
  const t = useTranslations("myPositions.withdrawModal");
  const tMyPositions = useTranslations("myPositions");
  const maxWithdrawable =
    vaultLimits.find(
      v => getAddress(v.address) === getAddress(selectedPosition.vault.address)
    )?.maxWithdraw ?? 0n;
  const vaultsForSelectedAsset = selectedAsset
    ? vaults.filter(v => v.assets?.some(a => a.address === selectedAsset.address))
    : vaults;
  const {
    isPending,
    reset: resetWithdrawState,
    txState,
    withdraw,
  } = useWithdraw(vaultsForSelectedAsset, vaultLimits, {
    onWithdrawError,
    onWithdrawSuccess,
  });

  const confirmingInWalletWithdraw = Object.values(txState).some(
    s => s.phase === "awaiting-signature"
  );
  const balanceFormatted = formatAsset(
    selectedPosition.balance,
    selectedAsset.decimals,
    selectedAsset.symbol
  );

  const suppliedDisplay =
    amountToWithdraw === 0n ? (
      balanceFormatted.text
    ) : selectedPosition.balance >= amountToWithdraw ? (
      <div className="flex items-center gap-2 leading-none">
        {balanceFormatted.text}
        <ArrowRight size={14} />
        {
          formatAsset(
            selectedPosition.balance - amountToWithdraw,
            selectedAsset.decimals,
            selectedAsset.symbol
          ).text
        }
      </div>
    ) : (
      "N/A"
    );

  return (
    <Dialog
      onOpenChange={() => {
        onOpenChange(false);
        resetWithdrawState();
      }}
      open={open}
      size="md"
      title={title}
    >
      <div className="flex flex-col gap-4 px-6">
        <Heading level="5">{t("withdraw")}</Heading>
        <div className="flex flex-col gap-2">
          <AssetInput
            assetSymbol={selectedAsset?.symbol}
            onValueChange={evt => {
              const value = parseUnits(evt.value, selectedAsset.decimals);
              setAmountToWithdraw(value);
            }}
            placeholder="0.0"
            renderAssetImage={() => (
              <AssetImage
                address={selectedAsset.address}
                alt=""
                imgURI={selectedAsset.logoURI}
                size={24}
              />
            )}
            value={
              amountToWithdraw
                ? formatUnits(amountToWithdraw, selectedAsset?.decimals).text
                : ""
            }
          />
          <div className="text-muted flex flex-nowrap items-center gap-2 pl-2 font-mono text-xs">
            {t("availableForWithdraw", { symbol: selectedAsset.symbol })}
            <Tooltip content={t("withdrawAll")} side="bottom">
              <Button
                className="text-xs"
                onClick={() => setAmountToWithdraw(maxWithdrawable)}
                size="sm"
                variant="link"
              >
                {
                  formatNumberToKMB(
                    Number(
                      formatUnits(maxWithdrawable, selectedAsset.decimals).meta!.rawViem
                    )
                  ).text
                }
              </Button>
            </Tooltip>
          </div>
        </div>
        <UncontrolledCollapsible
          defaultOpen
          summary={
            <span className="text-text-dimmed font-mono text-sm">{t("position")}</span>
          }
        >
          <div className="border-primary flex flex-col gap-2 border-l px-2 py-1">
            <div className="flex items-center justify-between text-sm">
              <span>{t("supplied")}</span>
              {suppliedDisplay}
            </div>
          </div>
        </UncontrolledCollapsible>
        <Button
          className="mx-auto mt-12 w-2/3"
          disabled={
            isPending ||
            amountToWithdraw === 0n ||
            amountToWithdraw > selectedPosition.balance
          }
          onClick={() => {
            withdraw({
              amount: amountToWithdraw,
              vaultAddress: selectedPosition.vault.address,
            });
          }}
          size="lg"
        >
          {confirmingInWalletWithdraw
            ? tMyPositions("confirmingInWallet")
            : isPending
              ? tMyPositions("withdrawing")
              : t("withdraw")}
        </Button>
      </div>
    </Dialog>
  );
}
